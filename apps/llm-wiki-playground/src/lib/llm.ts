import type { RetrievalResult } from "./retrieval";

/**
 * Optional real-LLM path. Only active when VITE_OPENAI_API_KEY is set in
 * .env (see .env.example / README.md). Completely unused in the default
 * mock mode — no key, no network call, ever.
 */
export function isLlmConfigured(): boolean {
  return Boolean(import.meta.env.VITE_OPENAI_API_KEY);
}

export async function askLlm(question: string, retrieval: RetrievalResult): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error("VITE_OPENAI_API_KEY is not set — LLM mode is unavailable.");
  }
  const model = (import.meta.env.VITE_OPENAI_MODEL as string) || "gpt-4o-mini";
  const baseUrl = (import.meta.env.VITE_OPENAI_BASE_URL as string) || "https://api.openai.com/v1";

  const context = retrieval.sources
    .map((s) => `### ${s.title}\n${s.sentences.join(" ")}`)
    .join("\n\n");

  const systemPrompt =
    "You are the Ask-the-Wiki assistant for a small local LLM wiki. Answer the " +
    "user's question using ONLY the provided wiki context. Be concise (2-4 " +
    "sentences). If the context doesn't cover the question, say so plainly.";

  const userPrompt = context
    ? `Wiki context:\n\n${context}\n\nQuestion: ${question}`
    : `No matching wiki context was found. Question: ${question}`;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`LLM request failed (${response.status}): ${text.slice(0, 200)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("LLM response did not contain any content.");
  }
  return content.trim();
}
