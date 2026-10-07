import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin, Connect } from "vite";
import type { ServerResponse } from "node:http";
import { getClient } from "./mcp-client.ts";

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

function bytesOf(text: string): number {
  return Buffer.byteLength(text, "utf8");
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
            const logPath = path.join(fixturesDir, "access.log");
            const docsDir = path.join(fixturesDir, "docs");
            const log = await fs.readFile(logPath, "utf8");
            const docNames = (await fs.readdir(docsDir)).filter((f) => f.endsWith(".md"));
            const docs = await Promise.all(
              docNames.map(async (name) => ({
                name,
                bytes: bytesOf(await fs.readFile(path.join(docsDir, name), "utf8")),
              })),
            );
            return sendJson(res, 200, {
              log: {
                path: "fixtures/access.log",
                bytes: bytesOf(log),
                preview: log.split("\n").slice(0, 12).join("\n"),
                lineCount: log.split("\n").filter(Boolean).length,
              },
              docs,
            });
          }

          if (req.method === "GET" && url.pathname === "/api/doctor") {
            const result = await client.callTool("ctx_doctor", {});
            return sendJson(res, 200, { text: client.textOf(result), raw: result });
          }

          if (req.method === "GET" && url.pathname === "/api/stats") {
            const result = await client.callTool("ctx_stats", {});
            return sendJson(res, 200, { text: client.textOf(result), raw: result });
          }

          if (req.method === "POST" && url.pathname === "/api/compare") {
            const body = JSON.parse((await readBody(req)) || "{}") as {
              scenario?: string;
            };
            const scenario = body.scenario ?? "errors";
            const logPath = path.join(fixturesDir, "access.log");
            const raw = await fs.readFile(logPath, "utf8");

            const code =
              scenario === "status"
                ? `const fs = require('fs');
const lines = fs.readFileSync(${JSON.stringify(logPath)}, 'utf8').trim().split('\\n');
const counts = {};
for (const line of lines) {
  const m = line.match(/status=(\\d+)/);
  if (!m) continue;
  counts[m[1]] = (counts[m[1]] || 0) + 1;
}
console.log('status histogram');
Object.entries(counts).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => console.log(k + ': ' + v));
console.log('total_lines=' + lines.length);`
                : `const fs = require('fs');
const lines = fs.readFileSync(${JSON.stringify(logPath)}, 'utf8').trim().split('\\n');
const errors = lines.filter((l) => /\\bERROR\\b/.test(l));
console.log('errors=' + errors.length + ' of ' + lines.length + ' lines');
errors.forEach((l) => console.log(l));`;

            const result = await client.callTool("ctx_execute", {
              language: "javascript",
              code,
              intent: scenario === "status" ? "status code histogram" : "ERROR lines only",
            });
            const sandboxed = client.textOf(result);
            const rawBytes = bytesOf(raw);
            const keptBytes = bytesOf(sandboxed);
            const savedBytes = Math.max(0, rawBytes - keptBytes);
            const reduction = rawBytes === 0 ? 0 : (savedBytes / rawBytes) * 100;

            return sendJson(res, 200, {
              scenario,
              rawPreview: raw.split("\n").slice(0, 18).join("\n"),
              rawBytes,
              sandboxed,
              keptBytes,
              savedBytes,
              reduction,
              stats: client.textOf(await client.callTool("ctx_stats", {})),
            });
          }

          if (req.method === "POST" && url.pathname === "/api/index") {
            const docsDir = path.join(fixturesDir, "docs");
            const files = (await fs.readdir(docsDir)).filter((f) => f.endsWith(".md"));
            const result = await client.callTool("ctx_index", {
              path: docsDir,
              source: "fixture:docs",
              extensions: [".md"],
              maxDepth: 1,
            });
            return sendJson(res, 200, {
              indexed: files.length,
              text: client.textOf(result),
            });
          }

          if (req.method === "POST" && url.pathname === "/api/search") {
            const body = JSON.parse((await readBody(req)) || "{}") as { query?: string };
            const query = (body.query ?? "").trim();
            if (!query) return sendJson(res, 400, { error: "query required" });
            const result = await client.callTool("ctx_search", {
              queries: [query],
              limit: 5,
            });
            return sendJson(res, 200, { text: client.textOf(result), raw: result });
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
