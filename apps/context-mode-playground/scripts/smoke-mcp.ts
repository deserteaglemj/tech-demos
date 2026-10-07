import { ContextModeClient } from "../server/mcp-client.ts";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logPath = path.join(root, "fixtures", "access.log");

const client = new ContextModeClient(path.join(root, ".context-mode-smoke"));

try {
  const doctor = await client.callTool("ctx_doctor", {});
  const doctorText = client.textOf(doctor);
  if (!/PASS|FTS5|v1\.0/.test(doctorText)) {
    throw new Error("doctor output unexpected:\n" + doctorText);
  }

  const exec = await client.callTool("ctx_execute", {
    language: "javascript",
    code: `const fs=require('fs');const n=fs.readFileSync(${JSON.stringify(logPath)},'utf8').split('\\n').filter(l=>/ERROR/.test(l)).length;console.log('errors='+n);`,
  });
  const execText = client.textOf(exec);
  if (!/errors=\d+/.test(execText)) {
    throw new Error("execute output unexpected:\n" + execText);
  }

  const indexed = await client.callTool("ctx_index", {
    path: path.join(root, "fixtures", "docs"),
    source: "smoke:docs",
    extensions: [".md"],
  });
  const search = await client.callTool("ctx_search", {
    queries: ["sandbox FTS5"],
    limit: 3,
  });

  console.log("smoke ok");
  console.log("- doctor chars:", doctorText.length);
  console.log("- execute:", execText.trim().split("\n").slice(-1)[0]);
  console.log("- index:", client.textOf(indexed).slice(0, 120).replace(/\n/g, " "));
  console.log("- search chars:", client.textOf(search).length);
} finally {
  await client.close();
}
