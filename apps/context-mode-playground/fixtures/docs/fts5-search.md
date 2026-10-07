# FTS5 knowledge base

Indexed markdown is stored in SQLite FTS5 with BM25 ranking and Porter stemming.
Search returns relevant snippets, not whole documents.

## Ranking

Reciprocal Rank Fusion merges porter stemming and trigram substring strategies
so partial tokens like `useEff` still find `useEffect`.

## Tools

- `ctx_index` — chunk and store content
- `ctx_search` — retrieve matching sections
- `ctx_fetch_and_index` — fetch a URL, convert to markdown, then index
