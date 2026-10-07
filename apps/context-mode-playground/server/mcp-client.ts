import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createInterface, type Interface } from "node:readline";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

type JsonRpcId = number;
type Pending = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  timer: ReturnType<typeof setTimeout>;
};

export type McpToolResult = {
  content?: Array<{ type: string; text?: string }>;
  isError?: boolean;
  [key: string]: unknown;
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(path.join(root, "package.json"));

function resolveContextModeBin(): string {
  try {
    return require.resolve("context-mode/cli");
  } catch {
    return path.join(root, "node_modules", "context-mode", "cli.bundle.mjs");
  }
}

export class ContextModeClient {
  private child: ChildProcessWithoutNullStreams | null = null;
  private rl: Interface | null = null;
  private nextId = 0;
  private pending = new Map<JsonRpcId, Pending>();
  private ready: Promise<void> | null = null;
  private storageDir: string;

  constructor(storageDir = path.join(root, ".context-mode")) {
    this.storageDir = storageDir;
  }

  async ensure(): Promise<void> {
    if (this.ready) return this.ready;
    this.ready = this.start();
    try {
      await this.ready;
    } catch (err) {
      this.ready = null;
      throw err;
    }
  }

  private async start(): Promise<void> {
    const bin = resolveContextModeBin();
    this.child = spawn(process.execPath, [bin], {
      cwd: root,
      env: {
        ...process.env,
        CONTEXT_MODE_DIR: this.storageDir,
      },
      stdio: ["pipe", "pipe", "pipe"],
    });

    this.child.stderr.on("data", () => {
      // swallow experimental sqlite warnings; surface real failures via RPC
    });

    this.child.on("exit", () => {
      this.rejectAll(new Error("context-mode MCP process exited"));
      this.child = null;
      this.rl = null;
      this.ready = null;
    });

    this.rl = createInterface({ input: this.child.stdout });
    this.rl.on("line", (line) => this.onLine(line));

    await this.request("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "context-mode-playground", version: "0.1.0" },
    });

    this.notify("notifications/initialized", {});
  }

  private onLine(line: string): void {
    let msg: { id?: JsonRpcId; result?: unknown; error?: unknown };
    try {
      msg = JSON.parse(line) as typeof msg;
    } catch {
      return;
    }
    if (msg.id == null) return;
    const pending = this.pending.get(msg.id);
    if (!pending) return;
    clearTimeout(pending.timer);
    this.pending.delete(msg.id);
    if (msg.error) pending.reject(msg.error);
    else pending.resolve(msg.result);
  }

  private rejectAll(err: Error): void {
    for (const [, p] of this.pending) {
      clearTimeout(p.timer);
      p.reject(err);
    }
    this.pending.clear();
  }

  private notify(method: string, params: Record<string, unknown>): void {
    if (!this.child) throw new Error("MCP not started");
    this.child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
  }

  private request(method: string, params: Record<string, unknown>, timeoutMs = 30000): Promise<unknown> {
    if (!this.child) throw new Error("MCP not started");
    const id = ++this.nextId;
    this.child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`MCP timeout: ${method}`));
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
    });
  }

  async callTool(name: string, args: Record<string, unknown> = {}): Promise<McpToolResult> {
    await this.ensure();
    const result = (await this.request("tools/call", {
      name,
      arguments: args,
    })) as McpToolResult;
    return result;
  }

  textOf(result: McpToolResult): string {
    return (result.content ?? [])
      .filter((c) => c.type === "text" && typeof c.text === "string")
      .map((c) => c.text as string)
      .join("\n");
  }

  async close(): Promise<void> {
    this.rejectAll(new Error("client closed"));
    this.rl?.close();
    this.child?.kill();
    this.child = null;
    this.rl = null;
    this.ready = null;
  }
}

let singleton: ContextModeClient | null = null;

export function getClient(): ContextModeClient {
  if (!singleton) singleton = new ContextModeClient();
  return singleton;
}
