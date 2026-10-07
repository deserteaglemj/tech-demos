import path from "node:path";
import { fileURLToPath } from "node:url";
import { ContextModeClient } from "../server/mcp-client.ts";
import { runAgentComparison } from "../server/agent-run.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const client = new ContextModeClient(path.join(root, ".context-mode-smoke"));

try {
  const result = await runAgentComparison(client);
  if (result.with.contextTokens >= result.without.contextTokens) {
    throw new Error(
      `expected with-tokens < without-tokens, got ${result.with.contextTokens} vs ${result.without.contextTokens}`,
    );
  }
  if (result.reductionPct < 50) {
    throw new Error(`expected ≥50% reduction, got ${result.reductionPct.toFixed(1)}%`);
  }
  console.log("smoke ok — agent token comparison");
  console.log(`- without: ${result.without.contextTokens} tokens`);
  console.log(`- with:    ${result.with.contextTokens} tokens`);
  console.log(`- saved:   ${result.savedTokens} (${result.reductionPct.toFixed(1)}%)`);
} finally {
  await client.close();
}
