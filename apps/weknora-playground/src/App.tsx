import { useEffect, useMemo, useState } from 'react'
import {
  DOCS,
  WIKI_EDGES,
  WIKI_PAGES,
  answerRag,
  foldersFromDocs,
  runAgent,
  type AgentStep,
  type Citation,
  type Document,
  type Mode,
  type WikiPage,
} from './lib/engine'
import './App.css'

type Msg = { role: 'user' | 'assistant'; text: string; citations?: Citation[] }

const SAMPLE_QUESTIONS = [
  'What are WeKnora’s three core modes?',
  'How do I deploy with Docker Compose?',
  'When should I use the ReAct Agent?',
]

export default function App() {
  const [mode, setMode] = useState<Mode>('library')
  const [selected, setSelected] = useState<Document>(DOCS[0])
  const [wikiPage, setWikiPage] = useState<WikiPage>(WIKI_PAGES[0])
  const [query, setQuery] = useState(SAMPLE_QUESTIONS[0])
  const [messages, setMessages] = useState<Msg[]>([])
  const [steps, setSteps] = useState<AgentStep[]>([])
  const [busy, setBusy] = useState(false)
  const folders = useMemo(() => foldersFromDocs(), [])

  useEffect(() => {
    document.documentElement.dataset.mode = mode
  }, [mode])

  async function ask() {
    const q = query.trim()
    if (!q || busy) return
    setBusy(true)
    setMessages((m) => [...m, { role: 'user', text: q }])

    if (mode === 'agent') {
      setSteps([])
      const result = await runAgent(q, (step) => {
        setSteps((prev) => {
          const i = prev.findIndex((s) => s.tool === step.tool)
          if (i === -1) return [...prev, step]
          const next = [...prev]
          next[i] = step
          return next
        })
      })
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: result.answer, citations: result.citations },
      ])
    } else {
      await new Promise((r) => setTimeout(r, 280))
      const result = answerRag(q)
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: result.answer, citations: result.citations },
      ])
    }
    setBusy(false)
  }

  return (
    <div className="shell">
      <aside className="rail">
        <div className="brand">
          <span className="mark" aria-hidden />
          <div>
            <strong>WeKnora</strong>
            <em>playground</em>
          </div>
        </div>
        <nav className="modes">
          {(
            [
              ['library', 'Library'],
              ['rag', 'RAG Q&A'],
              ['agent', 'Agent'],
              ['wiki', 'Wiki'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={mode === id ? 'active' : undefined}
              onClick={() => setMode(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <p className="aside-note">
          Mock retrieval over a seeded knowledge base — no API key required. Mirrors
          upstream{' '}
          <a href="https://github.com/Tencent/WeKnora" target="_blank" rel="noreferrer">
            Tencent/WeKnora
          </a>{' '}
          modes.
        </p>
      </aside>

      <main className="stage">
        <header className="hero-bar">
          <h1>
            {mode === 'library' && 'Knowledge library'}
            {mode === 'rag' && 'RAG Quick Q&A'}
            {mode === 'agent' && 'ReAct Agent'}
            {mode === 'wiki' && 'Wiki + knowledge graph'}
          </h1>
          <p>
            {mode === 'library' &&
              'Browse seeded documents the way WeKnora keeps folder trees after upload.'}
            {mode === 'rag' &&
              'Ask a question; answers cite the highest-scoring local chunks.'}
            {mode === 'agent' &&
              'Watch a multi-step tool trace: search → read → synthesize.'}
            {mode === 'wiki' &&
              'Distilled topic pages with links — click a node in the graph.'}
          </p>
        </header>

        {mode === 'library' && (
          <section className="panel split">
            <div className="tree">
              {folders.map((folder) => (
                <div key={folder.name} className="folder">
                  <h3>{folder.name}</h3>
                  <ul>
                    {folder.docs.map((doc) => (
                      <li key={doc.id}>
                        <button
                          type="button"
                          className={selected.id === doc.id ? 'active' : undefined}
                          onClick={() => setSelected(doc)}
                        >
                          {doc.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <article className="doc">
              <header>
                <h2>{selected.title}</h2>
                <div className="tags">
                  {selected.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </header>
              {selected.body.split('\n').map((line, i) =>
                line.trim() ? <p key={i}>{line}</p> : <br key={i} />,
              )}
            </article>
          </section>
        )}

        {(mode === 'rag' || mode === 'agent') && (
          <section className="panel chat-panel">
            {mode === 'agent' && steps.length > 0 && (
              <ol className="trace">
                {steps.map((s) => (
                  <li key={s.tool} data-status={s.status}>
                    <code>{s.tool}</code>
                    <span>{s.detail}</span>
                  </li>
                ))}
              </ol>
            )}
            <div className="messages">
              {messages.length === 0 && (
                <div className="empty">
                  <p>Try a sample question:</p>
                  <div className="samples">
                    {SAMPLE_QUESTIONS.map((q) => (
                      <button key={q} type="button" onClick={() => setQuery(q)}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`bubble ${m.role}`}>
                  <p>{m.text}</p>
                  {m.citations && m.citations.length > 0 && (
                    <ul className="cites">
                      {m.citations.map((c) => (
                        <li key={c.docId}>
                          <strong>{c.title}</strong>
                          <span>{c.snippet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <form
              className="composer"
              onSubmit={(e) => {
                e.preventDefault()
                void ask()
              }}
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask the knowledge base…"
                aria-label="Question"
              />
              <button type="submit" disabled={busy}>
                {busy ? 'Working…' : mode === 'agent' ? 'Run agent' : 'Ask'}
              </button>
            </form>
          </section>
        )}

        {mode === 'wiki' && (
          <section className="panel split wiki">
            <div className="wiki-list">
              {WIKI_PAGES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={wikiPage.id === p.id ? 'active' : undefined}
                  onClick={() => setWikiPage(p)}
                >
                  {p.title}
                </button>
              ))}
            </div>
            <article className="doc">
              <h2>{wikiPage.title}</h2>
              <p>{wikiPage.summary}</p>
              <h3>Linked pages</h3>
              <ul className="links">
                {wikiPage.links.map((id) => {
                  const page = WIKI_PAGES.find((p) => p.id === id)
                  if (!page) return null
                  return (
                    <li key={id}>
                      <button type="button" onClick={() => setWikiPage(page)}>
                        {page.title}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </article>
            <svg className="graph" viewBox="0 0 360 280" role="img" aria-label="Knowledge graph">
              {WIKI_EDGES.map(([a, b], i) => {
                const pa = nodePos(a)
                const pb = nodePos(b)
                return (
                  <line
                    key={i}
                    x1={pa.x}
                    y1={pa.y}
                    x2={pb.x}
                    y2={pb.y}
                    className="edge"
                  />
                )
              })}
              {WIKI_PAGES.map((p) => {
                const { x, y } = nodePos(p.id)
                const active = p.id === wikiPage.id
                return (
                  <g
                    key={p.id}
                    className={active ? 'node active' : 'node'}
                    onClick={() => setWikiPage(p)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx={x} cy={y} r={active ? 18 : 14} />
                    <text x={x} y={y + 32} textAnchor="middle">
                      {p.title.split(' ')[0]}
                    </text>
                  </g>
                )
              })}
            </svg>
          </section>
        )}
      </main>
    </div>
  )
}

function nodePos(id: string): { x: number; y: number } {
  const i = Math.max(
    0,
    WIKI_PAGES.findIndex((p) => p.id === id),
  )
  const angle = (i / WIKI_PAGES.length) * Math.PI * 2 - Math.PI / 2
  return {
    x: 180 + Math.cos(angle) * 110,
    y: 130 + Math.sin(angle) * 90,
  }
}
