/** Rough LLM token estimate (~4 chars / token). Good enough for demos. */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.max(1, Math.ceil(Buffer.byteLength(text, "utf8") / 4));
}

export function bytesOf(text: string): number {
  return Buffer.byteLength(text, "utf8");
}
