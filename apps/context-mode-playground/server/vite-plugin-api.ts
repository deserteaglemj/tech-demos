import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin, Connect } from "vite";
import type { ServerResponse } from "node:http";
import { getClient } from "./mcp-client.ts";
import { runAgentComparison } from "./agent-run.ts";
import { bytesOf } from "./tokens.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = path.join(root, "fixtures");

async function readBody(req: Connect.IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export function contextModeApiPlugin(): Plugin {
  return {
    name: "context-mode-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();

        const client = getClient();
        const url = new URL(req.url, "http://localhost");

        try {
          if (req.method === "GET" && url.pathname === "/api/health") {
            return sendJson(res, 200, { ok: true, package: "context-mode@1.0.169" });
          }

          if (req.method === "GET" && url.pathname === "/api/fixtures") {
            const log = await fs.readFile(path.join(fixturesDir, "access.log"), "utf8");
            return sendJson(res, 200, {
              log: {
                path: "fixtures/access.log",
                bytes: bytesOf(log),
                lineCount: log.split("\n").filter(Boolean).length,
              },
            });
          }

          if (req.method === "POST" && url.pathname === "/api/agent-run") {
            await readBody(req);
            const result = await runAgentComparison(client);
            return sendJson(res, 200, result);
          }

          return sendJson(res, 404, { error: "not found" });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return sendJson(res, 500, { error: message });
        }
      });
    },
  };
}
