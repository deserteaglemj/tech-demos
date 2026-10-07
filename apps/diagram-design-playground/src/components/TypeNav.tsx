import { DIAGRAMS, type DiagramId } from "../lib/types";

type Props = {
  active: DiagramId;
  onChange: (id: DiagramId) => void;
};

export function TypeNav({ active, onChange }: Props) {
  return (
    <nav className="type-nav" aria-label="Diagram types">
      {DIAGRAMS.map((diagram) => (
        <button
          key={diagram.id}
          type="button"
          className={diagram.id === active ? "type-btn is-active" : "type-btn"}
          onClick={() => onChange(diagram.id)}
        >
          <span className="type-btn-label">{diagram.label}</span>
          <span className="type-btn-blurb">{diagram.blurb}</span>
        </button>
      ))}
    </nav>
  );
}
