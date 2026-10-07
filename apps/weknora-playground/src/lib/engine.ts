import documents from '../data/documents.json'
import wikiData from '../data/wiki.json'

export type Document = (typeof documents)[number]
export type WikiPage = (typeof wikiData.pages)[number]
export type Mode = 'library' | 'rag' | 'agent' | 'wiki'

export const DOCS: Document[] = documents
export const WIKI_PAGES: WikiPage[] = wikiData.pages
export const WIKI_EDGES: [string, string][] = wikiData.edges as [string, string][]

export type Citation = { docId: string; title: string; snippet: string; score: number }
export type AgentStep = { tool: string; detail: string; status: 'running' | 'done' }

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fff+/.-]+/i)
    .filter((t) => t.length > 1)
}

export function searchDocs(query: string, limit = 3): Citation[] {
  const terms = tokenize(query)
  if (!terms.length) return []

  const scored = DOCS.map((doc) => {
    const hay = `${doc.title} ${doc.tags.join(' ')} ${doc.body}`.toLowerCase()
    let score = 0
    for (const t of terms) {
      if (hay.includes(t)) score += t.length > 4 ? 2 : 1
      if (doc.title.toLowerCase().includes(t)) score += 2
    }
    const idx = hay.indexOf(terms[0] ?? '')
    const start = Math.max(0, idx - 40)
    const snippet = doc.body.slice(start, start + 160).replace(/\s+/g, ' ').trim()
    return { docId: doc.id, title: doc.title, snippet: snippet || doc.body.slice(0, 160), score }
  })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit)
}

export function answerRag(query: string): { answer: string; citations: Citation[] } {
  const citations = searchDocs(query, 3)
  if (!citations.length) {
    return {
      answer:
        'No matching chunks in the seed knowledge base. Try asking about RAG, Agent, Wiki, or deployment.',
      citations: [],
    }
  }

  const top = citations[0]
  const related = citations
    .slice(1)
    .map((c) => c.title)
    .join(', ')

  const answer = [
    `Based on the knowledge base, here’s a grounded answer to “${query.trim()}”:`,
    '',
    top.snippet,
    '',
    related
      ? `Also relevant: ${related}. Switch to Agent mode for a multi-step tool trace, or Wiki mode for the distilled graph.`
      : 'Open the cited document in Library for the full source.',
  ].join('\n')

  return { answer, citations }
}

export async function runAgent(
  query: string,
  onStep: (step: AgentStep) => void,
): Promise<{ answer: string; citations: Citation[]; steps: AgentStep[] }> {
  const steps: AgentStep[] = []
  const push = async (tool: string, detail: string, ms = 420) => {
    const step: AgentStep = { tool, detail, status: 'running' }
    steps.push(step)
    onStep({ ...step })
    await new Promise((r) => setTimeout(r, ms))
    step.status = 'done'
    onStep({ ...step })
  }

  await push('search_knowledge', `Hybrid search for: ${query.slice(0, 80)}`)
  const citations = searchDocs(query, 3)
  await push(
    'read_document',
    citations[0] ? `Opened “${citations[0].title}” and extracted key passages` : 'No documents matched',
  )
  await push('synthesize', 'Compose answer from retrieved context + tool results')

  const { answer } = answerRag(query)
  const agentAnswer = [
    'Agent finished a 3-step plan (search → read → synthesize).',
    '',
    answer,
  ].join('\n')

  return { answer: agentAnswer, citations, steps }
}

export function foldersFromDocs(): { name: string; docs: Document[] }[] {
  const map = new Map<string, Document[]>()
  for (const doc of DOCS) {
    const list = map.get(doc.folder) ?? []
    list.push(doc)
    map.set(doc.folder, list)
  }
  return [...map.entries()].map(([name, docs]) => ({ name, docs }))
}
