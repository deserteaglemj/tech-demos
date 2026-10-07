import { useEffect, useRef, useState } from "react";
import {
  EmailOutreachComposer,
  GitHubPRComposer,
  LinkedInComposer,
  TwitterThreadComposer,
  type ComposerStatus,
  type EmailDraftData,
  type GitHubPRData,
  type LinkedInPostData,
  type TwitterThreadData,
} from "agentcomposerui";
import {
  CHANNELS,
  type ChannelId,
  revisedFor,
  seedFor,
} from "./data/drafts";

type LogItem = {
  id: string;
  at: string;
  channel: ChannelId;
  kind: "stream" | "approve" | "reject" | "revise" | "edit";
  detail: string;
};

type ChannelState = {
  status: ComposerStatus;
  linkedin: LinkedInPostData;
  twitter: TwitterThreadData;
  email: EmailDraftData;
  github: GitHubPRData;
  lastFeedback?: string;
};

function emptyState(): ChannelState {
  return {
    status: "idle",
    linkedin: seedFor("linkedin") as LinkedInPostData,
    twitter: seedFor("twitter") as TwitterThreadData,
    email: seedFor("email") as EmailDraftData,
    github: seedFor("github") as GitHubPRData,
  };
}

function stamp() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function App() {
  const [channel, setChannel] = useState<ChannelId>("linkedin");
  const [states, setStates] = useState<Record<ChannelId, ChannelState>>({
    linkedin: emptyState(),
    twitter: emptyState(),
    email: emptyState(),
    github: emptyState(),
  });
  const [log, setLog] = useState<LogItem[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const current = states[channel];

  function pushLog(
    kind: LogItem["kind"],
    detail: string,
    target: ChannelId = channel,
  ) {
    setLog((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        at: stamp(),
        channel: target,
        kind,
        detail,
      },
      ...prev,
    ].slice(0, 24));
  }

  function patchChannel(id: ChannelId, patch: Partial<ChannelState>) {
    setStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  }

  function runMockAgent(target: ChannelId = channel, revised = false) {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];

    const payload = revised ? revisedFor(target) : seedFor(target);
    patchChannel(target, { status: "streaming" });
    pushLog(
      revised ? "revise" : "stream",
      revised
        ? "Mock agent revising draft from feedback…"
        : "Mock agent streaming a structured draft…",
      target,
    );

    const t1 = window.setTimeout(() => {
      patchChannel(target, {
        status: "reviewing",
        ...(target === "linkedin" ? { linkedin: payload as LinkedInPostData } : {}),
        ...(target === "twitter" ? { twitter: payload as TwitterThreadData } : {}),
        ...(target === "email" ? { email: payload as EmailDraftData } : {}),
        ...(target === "github" ? { github: payload as GitHubPRData } : {}),
      });
      pushLog("stream", "Draft ready for human review.", target);
    }, 1100);
    timers.current.push(t1);
  }

  async function onApprove() {
    patchChannel(channel, { status: "approved" });
    pushLog("approve", "Draft approved — mock publish queued.");
  }

  async function onReject(feedback: string) {
    patchChannel(channel, { status: "rejected", lastFeedback: feedback });
    pushLog(
      "reject",
      feedback.trim()
        ? `Rejected: “${feedback.trim()}”`
        : "Rejected without feedback — requesting a tighter revision.",
    );
    const t = window.setTimeout(() => runMockAgent(channel, true), 650);
    timers.current.push(t);
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="rise mb-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="mono mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[var(--accent-ink)]">
            tech-demos · weekday playground
          </p>
          <h1 className="brand text-[clamp(2.6rem,7vw,4.4rem)] font-extrabold leading-[0.92] text-[var(--ink)]">
            AgentComposerUI
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--ink-soft)]">
            Human-in-the-loop composer cards for agent drafts. Run a mock agent,
            review the structured output, approve or send it back.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => runMockAgent()}
              disabled={current.status === "streaming"}
              className="rounded-xl bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-[var(--accent-hot)] transition hover:-translate-y-0.5 hover:bg-[var(--ink-soft)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {current.status === "streaming" ? "Streaming…" : "Run mock agent"}
            </button>
            <a
              className="rounded-xl border border-[var(--ink)]/15 bg-white/60 px-4 py-3 text-sm font-medium text-[var(--ink)] backdrop-blur transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              href="https://github.com/theajmalrazaq/agentcomposerui"
              target="_blank"
              rel="noreferrer"
            >
              Package source
            </a>
          </div>
        </div>

        <aside className="rise rise-delay-1 rounded-2xl border border-[var(--ink)]/10 bg-[var(--ink)] p-5 text-[var(--paper)] shadow-[var(--shadow)]">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--accent-hot)]">
            <span className="pulse-dot inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent-hot)]" />
            Live HITL loop
          </div>
          <ol className="space-y-2 text-sm leading-relaxed text-[var(--mist)]">
            <li>1. Pick a channel</li>
            <li>2. Stream a mock draft (no API key)</li>
            <li>3. Edit, approve, or reject with feedback</li>
            <li>4. Watch the revision land</li>
          </ol>
          <div className="mono mt-4 rounded-lg bg-white/5 px-3 py-2 text-xs text-[var(--accent-hot)]">
            status: {current.status}
          </div>
        </aside>
      </header>

      <nav
        className="rise rise-delay-2 mb-5 flex flex-wrap gap-2"
        aria-label="Composer channels"
      >
        {CHANNELS.map((item) => {
          const active = item.id === channel;
          const st = states[item.id].status;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setChannel(item.id)}
              className={`min-w-[9.5rem] flex-1 rounded-2xl border px-4 py-3 text-left transition ${
                active
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] shadow-[var(--shadow)]"
                  : "border-[var(--ink)]/10 bg-white/70 text-[var(--ink)] hover:border-[var(--accent)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{item.label}</span>
                <span
                  className={`mono text-[10px] uppercase tracking-wide ${
                    active ? "text-[var(--accent-hot)]" : "text-[var(--ink-soft)]/70"
                  }`}
                >
                  {st}
                </span>
              </div>
              <p
                className={`mt-1 text-xs ${
                  active ? "text-[var(--mist)]" : "text-[var(--ink-soft)]"
                }`}
              >
                {item.blurb}
              </p>
            </button>
          );
        })}
      </nav>

      {current.status === "streaming" && (
        <div className="stream-track rise mb-4 h-1.5 rounded-full bg-[var(--paper-deep)]" />
      )}

      <div className="rise rise-delay-3 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section className="min-w-0 rounded-[1.4rem] border border-[var(--ink)]/10 bg-white/80 p-3 shadow-[var(--shadow)] backdrop-blur sm:p-4">
          {current.status === "idle" ? (
            <IdlePane onRun={() => runMockAgent()} channel={channel} />
          ) : (
            <ComposerPane
              channel={channel}
              state={current}
              onApprove={onApprove}
              onReject={onReject}
              onLinkedInChange={(data) => {
                patchChannel("linkedin", { linkedin: data });
              }}
              onTwitterChange={(data) => {
                patchChannel("twitter", { twitter: data });
              }}
              onEmailChange={(data) => {
                patchChannel("email", { email: data });
              }}
              onGithubChange={(data) => {
                patchChannel("github", { github: data });
              }}
            />
          )}
        </section>

        <aside className="rounded-[1.4rem] border border-[var(--ink)]/10 bg-[var(--paper-deep)]/80 p-4 backdrop-blur">
          <h2 className="brand text-xl font-bold">Activity</h2>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            Mock agent events for this session.
          </p>
          <ul className="mt-4 space-y-3">
            {log.length === 0 && (
              <li className="rounded-xl border border-dashed border-[var(--ink)]/15 bg-white/50 px-3 py-4 text-sm text-[var(--ink-soft)]">
                Nothing yet. Run the mock agent to start the loop.
              </li>
            )}
            {log.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-[var(--ink)]/8 bg-white/70 px-3 py-2.5"
              >
                <div className="mono flex items-center justify-between gap-2 text-[10px] uppercase tracking-wide text-[var(--ink-soft)]">
                  <span>{item.at}</span>
                  <span>{item.channel}</span>
                </div>
                <p className="mt-1 text-sm leading-snug text-[var(--ink)]">
                  <span className="mr-2 font-semibold text-[var(--accent)]">
                    {item.kind}
                  </span>
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function IdlePane({
  onRun,
  channel,
}: {
  onRun: () => void;
  channel: ChannelId;
}) {
  const label = CHANNELS.find((c) => c.id === channel)?.label ?? channel;
  return (
    <div className="flex min-h-[28rem] flex-col items-start justify-center gap-4 px-4 py-10 sm:px-8">
      <p className="mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
        waiting for agent
      </p>
      <h2 className="brand max-w-lg text-3xl font-bold leading-tight sm:text-4xl">
        Stream a {label} draft into the composer
      </h2>
      <p className="max-w-md text-[var(--ink-soft)]">
        No API key required. The mock agent fills structured fields, then hands
        control to you for edit / approve / reject.
      </p>
      <button
        type="button"
        onClick={onRun}
        className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-ink)]"
      >
        Stream {label} draft
      </button>
    </div>
  );
}

function ComposerPane({
  channel,
  state,
  onApprove,
  onReject,
  onLinkedInChange,
  onTwitterChange,
  onEmailChange,
  onGithubChange,
}: {
  channel: ChannelId;
  state: ChannelState;
  onApprove: () => void | Promise<void>;
  onReject: (feedback: string) => void | Promise<void>;
  onLinkedInChange: (data: LinkedInPostData) => void;
  onTwitterChange: (data: TwitterThreadData) => void;
  onEmailChange: (data: EmailDraftData) => void;
  onGithubChange: (data: GitHubPRData) => void;
}) {
  if (channel === "linkedin") {
    return (
      <LinkedInComposer
        data={state.linkedin}
        status={state.status}
        onChange={onLinkedInChange}
        onApprove={onApprove}
        onReject={onReject}
        author={{ name: "Nova Hart", title: "Growth Ops · Northwind" }}
        approveLabel="Approve & queue"
        rejectLabel="Request changes"
      />
    );
  }

  if (channel === "twitter") {
    return (
      <TwitterThreadComposer
        data={state.twitter}
        status={state.status}
        onChange={onTwitterChange}
        onApprove={onApprove}
        onReject={onReject}
        author={{ name: "Nova Hart", handle: "novahart" }}
        approveLabel="Approve thread"
        rejectLabel="Request changes"
      />
    );
  }

  if (channel === "email") {
    return (
      <EmailOutreachComposer
        data={state.email}
        status={state.status}
        onChange={onEmailChange}
        onApprove={onApprove}
        onReject={onReject}
        senderName="Nova Hart"
        senderEmail="nova@northwind.studio"
        approveLabel="Approve email"
        rejectLabel="Request changes"
      />
    );
  }

  return (
    <GitHubPRComposer
      data={state.github}
      status={state.status}
      onChange={onGithubChange}
      onApprove={onApprove}
      onReject={onReject}
      approveLabel="Approve PR draft"
      rejectLabel="Request changes"
    />
  );
}
