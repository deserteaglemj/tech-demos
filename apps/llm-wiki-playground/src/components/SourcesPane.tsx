import { filings, filingsFor, sourceFiles } from "../lib/wiki";
import type { SourceFile } from "../lib/types";

interface SourcesPaneProps {
  selectedPath: string | null;
  activePath: string | null;
  replaying: boolean;
  onSelect: (path: string) => void;
  onReplay: () => void;
  onOpenWiki: (slug: string) => void;
}

export function SourcesPane({
  selectedPath,
  activePath,
  replaying,
  onSelect,
  onReplay,
  onOpenWiki,
}: SourcesPaneProps) {
  const selected = sourceFiles.find((file) => file.path === selectedPath) ?? null;
  const folders = [...new Set(sourceFiles.map((file) => file.folder))].sort();

  return (
    <section className="window" aria-label="Source directory">
      <header className="window-bar">
        <span className="window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <h2>~/sources</h2>
        <button type="button" className="text-button" onClick={onReplay} disabled={replaying}>
          {replaying ? "Filing…" : "Replay filing"}
        </button>
      </header>
      <div className="window-body source-body">
        <div className="file-tree" role="tree" aria-label="Raw files">
          {folders.map((folder) => (
            <div key={folder} className="folder">
              <div className="folder-name">{folder}/</div>
              <ul>
                {sourceFiles
                  .filter((file) => file.folder === folder)
                  .map((file) => (
                    <li key={file.path}>
                      <button
                        type="button"
                        className={`file-row ${file.path === selectedPath ? "selected" : ""} ${file.path === activePath ? "filing" : ""}`}
                        onClick={() => onSelect(file.path)}
                      >
                        {file.path.slice(folder.length + 1)}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        {selected ? <SourcePreview file={selected} onOpenWiki={onOpenWiki} /> : null}
      </div>
      <footer className="window-foot">
        {sourceFiles.length} raw files · {filings.length} filings into the wiki
      </footer>
    </section>
  );
}

function SourcePreview({
  file,
  onOpenWiki,
}: {
  file: SourceFile;
  onOpenWiki: (slug: string) => void;
}) {
  const filed = filingsFor(file.path);
  return (
    <article className="source-preview">
      <p className="path-label">{file.path}</p>
      <h3>{file.title}</h3>
      <p className="source-text">{file.body}</p>
      <p className="filed-label">Agent filed this into</p>
      <div className="chip-row">
        {filed.map((page) => (
          <button key={page.slug} type="button" className="chip" onClick={() => onOpenWiki(page.slug)}>
            {page.title}
          </button>
        ))}
      </div>
    </article>
  );
}
