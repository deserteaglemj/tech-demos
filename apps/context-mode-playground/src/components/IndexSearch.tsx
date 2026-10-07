import { useState } from "react";
import { api } from "../lib/api";

export function IndexSearch() {
  const [query, setQuery] = useState("BM25 stemming sandbox");
  const [busyIndex, setBusyIndex] = useState(false);
  const [busySearch, setBusySearch] = useState(false);
  const [indexText, setIndexText] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function indexDocs() {
    setBusyIndex(true);
    setError(null);
    try {
      const res = await api.index();
      setIndexText(`Indexed ${res.indexed} fixture docs.\n\n${res.text}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyIndex(false);
    }
  }

  async function search() {
    setBusySearch(true);
    setError(null);
    try {
      const res = await api.search(query);
      setSearchText(res.text || "(no matches)");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusySearch(false);
    }
  }

  return (
    <section className="panel" style={{ animationDelay: "0.18s" }}>
      <h2>Index + search</h2>
      <p className="sub">
        Index <code>fixtures/docs</code> into FTS5, then retrieve snippets with{" "}
        <code>ctx_search</code> — raw markdown never fills the chat.
      </p>
      <div className="controls">
        <button type="button" className="btn ghost" onClick={indexDocs} disabled={busyIndex}>
          {busyIndex ? "Indexing…" : "Index fixtures"}
        </button>
      </div>
      <div className="search-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search indexed knowledge"
          onKeyDown={(e) => {
            if (e.key === "Enter") void search();
          }}
        />
        <button type="button" className="btn" onClick={search} disabled={busySearch || !query.trim()}>
          {busySearch ? "Searching…" : "Search"}
        </button>
      </div>
      {error ? <p className="hint" style={{ color: "var(--danger)" }}>{error}</p> : null}
      {indexText ? <pre className="search-box">{indexText}</pre> : null}
      {searchText ? <pre className="search-box">{searchText}</pre> : null}
    </section>
  );
}
