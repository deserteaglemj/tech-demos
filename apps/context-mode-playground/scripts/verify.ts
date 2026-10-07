/**
 * End-to-end verification that context-mode MCP works as intended.
 * Run: bun run verify
 */
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(path.join(root, "package.json"));
const bin = (() => {
  try {
    return require.resolve("context-mode/cli");
  } catch {
    return path.join(root, "node_modules/context-mode/cli.bundle.mjs");
  }
})();

const fixtureDir = path.join(root, "fixtures");
const logPath = path.join(fixtureDir, "access.log");
const docsDir = path.join(fixtureDir, "docs");
const outPath = path.join(root, "verify-results.json");
const storageDir = path.join(root, ".context-mode-verify");

type Row = { name: string; ok: boolean; detail: string };
const rows: Row[] = [];

function record(name: string, ok: boolean, detail: string) {
  rows.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  console.log(`      ${detail.replace(/\n/g, "\n      ")}`);
}

function tokens(text: string) {
  return Math.ceil(Buffer.byteLength(text, "utf8") / 4);
}

function textOf(result: { content?: Array<{ type: string; text?: string }> }) {
  return (result.content ?? [])
    .filter((c) => c.type === "text" && c.text)
    .map((c) => c.text as string)
    .join("\n");
}

const child = spawn(process.execPath, [bin], {
  cwd: root,
  env: { ...process.env, CONTEXT_MODE_DIR: storageDir },
  stdio: ["pipe", "pipe", "pipe"],
});
child.stderr.on("data", () => {});
const rl = createInterface({ input: child.stdout });
let id = 0;
const pending = new Map<
  number,
  { resolve: (v: unknown) => void; reject: (e: unknown) => void; t: ReturnType<typeof setTimeout> }
>();

function send(method: string, params: Record<string, unknown>, timeoutMs = 30000) {
  const msgId = ++id;
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: msgId, method, params }) + "\n");
  return new Promise<unknown>((resolve, reject) => {
    const t = setTimeout(() => {
      pending.delete(msgId);
      reject(new Error(`timeout ${method}`));
    }, timeoutMs);
    pending.set(msgId, { resolve, reject, t });
  });
}

rl.on("line", (line) => {
  try {
    const msg = JSON.parse(line) as { id?: number; result?: unknown; error?: unknown };
    if (msg.id == null || !pending.has(msg.id)) return;
    const p = pending.get(msg.id)!;
    clearTimeout(p.t);
    pending.delete(msg.id);
    if (msg.error) p.reject(msg.error);
    else p.resolve(msg.result);
  } catch {
    /* ignore non-json */
  }
});

try {
  const init = (await send("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "context-mode-verify", version: "0.1.0" },
  })) as { serverInfo?: { name: string; version: string } };
  record(
    "MCP initialize",
    !!init.serverInfo?.name,
    `${init.serverInfo?.name}@${init.serverInfo?.version}`,
  );
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");

  const listed = (await send("tools/list", {})) as { tools?: Array<{ name: string }> };
  const names = (listed.tools ?? []).map((t) => t.name);
  const required = [
    "ctx_execute",
    "ctx_index",
    "ctx_search",
    "ctx_stats",
    "ctx_doctor",
    "ctx_batch_execute",
  ];
  const missing = required.filter((n) => !names.includes(n));
  record("tools/list", missing.length === 0, `${names.length} tools; missing=${missing.join(",") || "none"}`);

  const doctor = textOf(
    (await send("tools/call", { name: "ctx_doctor", arguments: {} })) as {
      content?: Array<{ type: string; text?: string }>;
    },
  );
  record("ctx_doctor", /Server test: PASS|FTS5/i.test(doctor), doctor.split("\n").slice(0, 6).join(" | "));

  const raw = fs.readFileSync(logPath, "utf8");
  const rawTok = tokens(raw);
  const exec = textOf(
    (await send("tools/call", {
      name: "ctx_execute",
      arguments: {
        language: "javascript",
        code: `const fs=require('fs');
const lines=fs.readFileSync(${JSON.stringify(logPath)},'utf8').trim().split('\\n');
const errors=lines.filter(l=>/\\bERROR\\b/.test(l));
console.log('errors='+errors.length+' of '+lines.length);
errors.slice(0,8).forEach(l=>console.log(l));`,
        intent: "ERROR lines",
      },
    })) as { content?: Array<{ type: string; text?: string }> },
  );
  const execTok = tokens(exec);
  const reduction = ((rawTok - execTok) / rawTok) * 100;
  record(
    "ctx_execute context savings",
    /errors=\d+/.test(exec) && reduction > 80,
    `raw≈${rawTok} tok → sandbox≈${execTok} tok (${reduction.toFixed(1)}% less)`,
  );

  const py = textOf(
    (await send("tools/call", {
      name: "ctx_execute",
      arguments: {
        language: "python",
        code: `print(sum(1 for _ in open(${JSON.stringify(logPath)})))`,
      },
    })) as { content?: Array<{ type: string; text?: string }> },
  );
  record("ctx_execute python", /\d+/.test(py), py.trim().slice(-40));

  const indexed = textOf(
    (await send("tools/call", {
      name: "ctx_index",
      arguments: { path: docsDir, source: "verify:docs", extensions: [".md"] },
    })) as { content?: Array<{ type: string; text?: string }> },
  );
  record("ctx_index", /Indexed/i.test(indexed), indexed.slice(0, 140).replace(/\n/g, " "));

  const search = textOf(
    (await send("tools/call", {
      name: "ctx_search",
      arguments: { queries: ["BM25 sandbox FTS5"], limit: 3 },
    })) as { content?: Array<{ type: string; text?: string }> },
  );
  record("ctx_search", /sandbox|FTS5|BM25/i.test(search), search.slice(0, 180).replace(/\n/g, " "));

  const batch = textOf(
    (await send("tools/call", {
      name: "ctx_batch_execute",
      arguments: {
        commands: [
          { label: "Lines", command: `wc -l ${JSON.stringify(logPath).slice(1, -1)}` },
          { label: "Errors", command: `grep -c ERROR ${JSON.stringify(logPath).slice(1, -1)}` },
        ],
        queries: ["How many ERROR lines?", "How many total lines?"],
      },
    })) as { content?: Array<{ type: string; text?: string }> },
  );
  record("ctx_batch_execute", /ERROR|Lines|errors/i.test(batch), batch.slice(0, 200).replace(/\n/g, " "));

  const stats = textOf(
    (await send("tools/call", { name: "ctx_stats", arguments: {} })) as {
      content?: Array<{ type: string; text?: string }>;
    },
  );
  record("ctx_stats", /saved|reduction|%/i.test(stats), stats.split("\n").slice(0, 5).join(" | "));

  const passed = rows.filter((r) => r.ok).length;
  const payload = {
    at: new Date().toISOString(),
    package: "context-mode@1.0.169",
    passed,
    total: rows.length,
    ok: passed === rows.length,
    reductionPct: reduction,
    rows,
  };
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));

  console.log("\n========== SUMMARY ==========");
  console.log(`Passed ${passed}/${rows.length}`);
  console.log(`Wrote ${outPath}`);
  if (passed !== rows.length) {
    process.exitCode = 1;
  } else {
    console.log("Verdict: context-mode works. Safe to install locally as an agent MCP.");
  }
} catch (err) {
  console.error("FATAL", err);
  process.exitCode = 1;
} finally {
  child.kill();
}
