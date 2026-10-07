import { FINDINGS, OPENRIG_COMMANDS, PAPERCLIP_COMMANDS } from "../data/findings";

const STATUS_LABEL: Record<string, string> = {
  pass: "PASS",
  warn: "WARN",
  fail: "FAIL",
  skip: "SKIP",
  info: "INFO",
};

export function Findings() {
  const openrig = FINDINGS.filter((f) => f.system === "openrig");
  const paperclip = FINDINGS.filter((f) => f.system === "paperclip");

  return (
    <section className="findings" id="findings">
      <div className="section-head">
        <p className="eyebrow">This environment</p>
        <h2>Install · test · demo evidence</h2>
        <p>Captured from real CLI runs—not marketing copy.</p>
      </div>

      <div className="findings__grid">
        <FindingsColumn title="OpenRig" items={openrig} commands={OPENRIG_COMMANDS} tone="teal" />
        <FindingsColumn
          title="Paperclip"
          items={paperclip}
          commands={PAPERCLIP_COMMANDS}
          tone="copper"
        />
      </div>
    </section>
  );
}

function FindingsColumn({
  title,
  items,
  commands,
  tone,
}: {
  title: string;
  items: typeof FINDINGS;
  commands: string[];
  tone: "teal" | "copper";
}) {
  return (
    <div className={`findings__col findings__col--${tone}`}>
      <h3>{title}</h3>
      <ul className="check-list">
        {items.map((item) => (
          <li key={item.id} className={`check check--${item.status}`}>
            <span className="check__badge">{STATUS_LABEL[item.status]}</span>
            <div>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
      <pre className="cmd-block">
        <code>{commands.join("\n")}</code>
      </pre>
    </div>
  );
}
