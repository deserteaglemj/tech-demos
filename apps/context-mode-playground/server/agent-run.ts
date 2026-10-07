import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ContextModeClient } from "./mcp-client.ts";
import { bytesOf, estimateTokens } from "./tokens.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logPath = path.join(root, "fixtures", "access.log");

export type TranscriptTurn =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string }
  | { role: "tool"; name: string; detail: string; result: string; tokens: number; bytes: number };

export type AgentPathResult = {
  label: string;
  mode: "without" | "with";
  transcript: TranscriptTurn[];
  contextTokens: number;
  contextBytes: number;
  answer: string;
};

export type AgentRunResult = {
  task: string;
  without: AgentPathResult;
  with: AgentPathResult;
  savedTokens: number;
  reductionPct: number;
  stats: string;
};

const TASK =
  "How many ERROR lines are in fixtures/access.log? List each ERROR line and summarize the failure modes.";

function toolCode(): string {
  return `const fs = require('fs');
const lines = fs.readFileSync(${JSON.stringify(logPath)}, 'utf8').trim().split('\\n');
const errors = lines.filter((l) => /\\bERROR\\b/.test(l));
console.log('errors=' + errors.length + ' of ' + lines.length + ' lines');
const modes = {};
for (const line of errors) {
  const m = line.match(/error="([^"]+)"/) || line.match(/status=(\\d+)/);
  const key = m ? m[1] : 'unknown';
  modes[key] = (modes[key] || 0) + 1;
}
console.log('failure_modes=' + JSON.stringify(modes));
errors.forEach((l) => console.log(l));`;
}

function answerFromErrors(rawLog: string): string {
  const lines = rawLog.trim().split("\n");
  const errors = lines.filter((l) => /\bERROR\b/.test(l));
  const modes: Record<string, number> = {};
  for (const line of errors) {
    const m = line.match(/error="([^"]+)"/) || line.match(/status=(\d+)/);
    const key = m ? m[1] : "unknown";
    modes[key] = (modes[key] || 0) + 1;
  }
  const modeText = Object.entries(modes)
    .map(([k, v]) => `${k}×${v}`)
    .join(", ");
  return `Found ${errors.length} ERROR lines out of ${lines.length}. Failure modes: ${modeText}.`;
}

export async function runAgentComparison(client: ContextModeClient): Promise<AgentRunResult> {
  const rawLog = await fs.readFile(logPath, "utf8");
  const answer = answerFromErrors(rawLog);

  // —— WITHOUT context-mode: agent Reads the whole file into context ——
  const withoutToolResult = rawLog;
  const withoutToolTokens = estimateTokens(withoutToolResult);
  const without: AgentPathResult = {
    label: "Normal agent (Read)",
    mode: "without",
    transcript: [
      { role: "user", text: TASK },
      {
        role: "assistant",
        text: "I'll read the access log with the Read tool, then count ERROR lines.",
      },
      {
        role: "tool",
        name: "Read",
        detail: "fixtures/access.log",
        result: withoutToolResult,
        tokens: withoutToolTokens,
        bytes: bytesOf(withoutToolResult),
      },
      { role: "assistant", text: answer },
    ],
    contextTokens: withoutToolTokens,
    contextBytes: bytesOf(withoutToolResult),
    answer,
  };

  // —— WITH context-mode: agent uses ctx_execute; only stdout enters context ——
  const mcp = await client.callTool("ctx_execute", {
    language: "javascript",
    code: toolCode(),
    intent: "ERROR lines and failure modes",
  });
  const sandboxed = client.textOf(mcp);
  // What actually enters the agent context is the MCP tool return (stdout summary),
  // not the raw log. Prefer the printed summary body when present.
  const stdoutOnly = sandboxed.includes("```")
    ? sandboxed.replace(/^[\s\S]*?```[a-z]*\n[\s\S]*?\n```\n*/m, "").trim() || sandboxed
    : sandboxed;
  const withToolTokens = estimateTokens(stdoutOnly);

  const withPath: AgentPathResult = {
    label: "Agent + context-mode (ctx_execute)",
    mode: "with",
    transcript: [
      { role: "user", text: TASK },
      {
        role: "assistant",
        text: "I'll filter the log inside ctx_execute so the raw file never enters context — only the printed summary will.",
      },
      {
        role: "tool",
        name: "ctx_execute",
        detail: "language=javascript · intent=ERROR lines and failure modes",
        result: stdoutOnly,
        tokens: withToolTokens,
        bytes: bytesOf(stdoutOnly),
      },
      { role: "assistant", text: answer },
    ],
    contextTokens: withToolTokens,
    contextBytes: bytesOf(stdoutOnly),
    answer,
  };

  const savedTokens = Math.max(0, without.contextTokens - withPath.contextTokens);
  const reductionPct =
    without.contextTokens === 0 ? 0 : (savedTokens / without.contextTokens) * 100;

  const stats = client.textOf(await client.callTool("ctx_stats", {}));

  return {
    task: TASK,
    without,
    with: withPath,
    savedTokens,
    reductionPct,
    stats,
  };
}
