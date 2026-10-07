# Handoff — Install Remotion + HyperFrames, then ship an IM STUDIOS conversion video

> Paste this entire file into your local AI coding agent (Cursor / Claude Code / Codex).  
> It is a complete brief: install, skills, work-fit discovery, and a conversion-video acceptance test.

---

## Role

You are a senior creative-technologist agent. Your job is to (1) install **Remotion** and **HyperFrames** from their official sources, (2) install **every related agent skill**, (3) discover where either tool fits **this user’s real work**, and (4) prove the setup by producing a short **IM STUDIOS** website video that helps customers convert (book / inquire).

Do not invent alternate install paths. Prefer official CLIs and docs linked below.

---

## Success criteria (definition of done)

1. Remotion project scaffolds and `npm run dev` / Studio opens without errors.
2. HyperFrames project scaffolds and `npx hyperframes preview` (or `npm run dev`) opens without errors.
3. Remotion agent skills are installed from `remotion-dev/skills` and listed on disk under `.agents/skills` (or Claude symlink).
4. HyperFrames agent skills are installed (core + creation workflows) via `npx hyperframes skills update` and/or `npx skills add heygen-com/hyperframes`.
5. You write a short **Work-fit memo** naming ≥3 concrete opportunities in *this user’s* work (not generic internet examples)—found by searching their repos, notes, bookmarks, calendar, or the IM STUDIOS site.
6. You ship an **IM STUDIOS conversion video** (12s, 1280×720 or 1920×1080, 30fps) that:
   - Leads with the brand **IM STUDIOS**
   - States the offer (photo + video / wedding cinema / commercial)
   - Ends on a clear CTA (e.g. **Book a shoot** → `imstudios.ca`)
   - Renders to MP4 locally
7. You report which stack you used for the final render (HyperFrames, Remotion, or both) and why.

---

## Sources of truth (install from these only)

| Tool | Official entry | Docs |
| --- | --- | --- |
| Remotion scaffold | `npx create-video@latest` | https://www.remotion.dev/docs/cli/create-video |
| Remotion coding-agent guide | — | https://www.remotion.dev/docs/ai/coding-agents |
| Remotion skills | `npx remotion skills add` **or** `npx skills add remotion-dev/skills` | https://www.remotion.dev/docs/ai/skills · https://www.remotion.dev/docs/cli/skills |
| HyperFrames CLI / scaffold | `npx hyperframes@latest init <name>` | https://github.com/heygen-com/hyperframes |
| HyperFrames skills | `npx hyperframes skills update` (agents) · `npx skills add heygen-com/hyperframes` (interactive) | README + `/hyperframes` router skill |
| Comparison context | — | https://hyperframes.heygen.com/guides/hyperframes-vs-remotion |

**Requirements:** Node.js 22+ (HyperFrames), FFmpeg, Chrome / chrome-headless-shell for HyperFrames renders.

---

## Phase 0 — Orient (prompt pattern: *context before action*)

Before installing anything:

1. Confirm Node, npm/bun, FFmpeg, and Chrome versions.
2. Ask (or infer from the workspace) where new projects should live. Prefer a dedicated folder outside sticky monorepos unless the user says otherwise.
3. Read this handoff fully once. Do not skip skills or the conversion test.

---

## Phase 1 — Install Remotion (prompt pattern: *exact commands + verify*)

```bash
# Non-interactive blank project (official agent path)
npx create-video@latest --yes --blank --no-tailwind imstudios-remotion
cd imstudios-remotion
npm install   # or: bun install

# Agent skills — install ALL Remotion skills from the maintained bundle
npx remotion skills add
# Equivalent: npx skills add remotion-dev/skills

# Verify skills landed
ls .agents/skills
# Expect remotion-* skills (best-practices, create, markup, studio, render, …)

npm run dev   # Remotion Studio
```

**Read / invoke these Remotion skills before authoring:**

- `/remotion-best-practices` (router — use if unsure)
- `/remotion-create`
- `/remotion-markup`
- `/remotion-studio`
- `/remotion-render`
- `/remotion-captions` (if adding captions)
- `/remotion-saas` (if embedding Player in a site)
- `/remotion-docs` (look up APIs instead of guessing)
- Also check for: `/remotion-maps`, `/remotion-interactivity`, `/remotion-multimedia`, `/remotion-upgrade`

If any skill from the Remotion skills README is missing on disk, install/update again with `npx remotion skills update`.

---

## Phase 2 — Install HyperFrames (prompt pattern: *exact commands + verify*)

```bash
# From a sibling directory (not inside the Remotion project)
npx hyperframes@latest init imstudios-hyperframes --example blank --non-interactive --resolution landscape
cd imstudios-hyperframes

# Agent skills — prefer non-interactive update from current main
npx hyperframes skills update
# Optional full published set:
#   npx skills add heygen-com/hyperframes --all

# Verify
npx hyperframes doctor
npx hyperframes lint
npm run dev    # or: npx hyperframes preview
```

**Read / invoke these HyperFrames skills before authoring:**

Router first:

- `/hyperframes`

Creation workflows (install on demand via `npx hyperframes skills update <slug>` if missing):

- `/product-launch-video` ← **primary for the IM STUDIOS conversion test**
- `/motion-graphics`
- `/general-video`
- `/faceless-explainer`
- `/pr-to-video`
- `/embedded-captions`
- `/talking-head-recut`
- `/music-to-video`
- `/slideshow`
- `/remotion-to-hyperframes`

Domain skills:

- `/hyperframes-core`
- `/hyperframes-animation`
- `/hyperframes-keyframes`
- `/hyperframes-creative`
- `/hyperframes-cli`
- `/hyperframes-audio`
- `/hyperframes-registry`
- `/hyperframes-studio`
- `/media-use`
- `/figma` (if design files exist)

**Mandate:** Enumerate every skill directory you installed. If the catalog lists a skill you do not have, fetch it before claiming “skills complete.”

---

## Phase 3 — Find where this fits *my* work (prompt pattern: *retrieve, don’t invent*)

Do **not** invent generic use cases. Search the user’s actual environment and write a **Work-fit memo** with ≥3 bullets.

Search in order:

1. Local git repos / recent projects (READMEs, marketing sites, landing pages, “promo”, “launch”, “demo”).
2. Bookmarks / notes / Notion / Linear / Slack if available.
3. The live IM STUDIOS site: https://imstudios.ca/ (and `/weddings`, commercial pages).
4. Any prior Remotion / HyperFrames / video-pipeline experiments in this monorepo (e.g. `apps/hyperframes-vs-remotion`, `apps/remotion-promo-studio`).

For each opportunity, note: **artifact** (what video), **stack pick** (Remotion vs HyperFrames and why), **conversion metric** (bookings, demo requests, waitlist).

Starter seeds grounded in IM STUDIOS (validate against the live site):

- Wedding cinema trailer → inquiry CTA
- Commercial / business-portrait package explainer → “Book a session”
- Homepage hero loop → “20+ years · Stoney Creek · Photo + Video”

---

## Phase 4 — Acceptance test: IM STUDIOS conversion video

### Brief (locked)

> Make a **12-second** website conversion video for **IM STUDIOS** (https://imstudios.ca/).
>
> Goal: get a visitor to **book / inquire**.
>
> Specs: 1280×720 or 1920×1080, 30fps. Silent OK for v1 (optional subtle bed later).
>
> Brand: **IM STUDIOS** must be the hero-level signal—not a nav eyebrow.
> Offer: creative photo + video · wedding cinema · commercial · Stoney Creek, ON · 20+ years.
> Tone: cinematic, warm, modern-timeless. Sentiment + personality (per their About copy). Avoid generic AI purple gradients.
>
> Beat sheet:
> 1. Atmosphere / light open
> 2. Brand lockup **IM STUDIOS**
> 3. One-line promise (e.g. photo + video that balances sentiment and humour)
> 4. Service chips: Wedding · Commercial · Events
> 5. CTA: **Book a shoot** + `imstudios.ca`
>
> Prefer crisp type and intentional motion over clutter. One composition. Demable in one sitting.

### Build rules

1. Load the right skills **before** writing frames (`/product-launch-video` or `/motion-graphics` for HyperFrames; `/remotion-best-practices` + `/remotion-markup` for Remotion).
2. Implement in **both** stacks if time allows; otherwise ship HyperFrames first (agent-HTML path), then port or twin in Remotion.
3. Preview both players / Studio.
4. Render:

```bash
# HyperFrames
npx hyperframes render -o out/imstudios-conversion.mp4 --fps 30

# Remotion (from Remotion project)
npx remotion render <CompositionId> out/imstudios-conversion.mp4
```

5. Capture ≥1 screenshot of the preview and keep the MP4 path in your report.

### Conversion checklist (self-grade 1–10)

- [ ] Brand is unmistakable in first 2 seconds
- [ ] Offer is understandable without sound
- [ ] CTA is readable and last on screen ≥1.5s
- [ ] Motion is seekable / deterministic (no wall-clock-only animations)
- [ ] Render completes locally

---

## Phase 5 — Report back (prompt pattern: *structured output*)

Return a short report with these headings only:

1. **Environment** — Node / FFmpeg / Chrome
2. **Installs** — paths to both projects
3. **Skills inventory** — Remotion list + HyperFrames list (complete?)
4. **Work-fit memo** — ≥3 user-specific opportunities
5. **IM STUDIOS video** — stack used, duration, output path, self-grade
6. **Blockers / next** — anything unfinished

---

## Anti-patterns (do not do these)

- Do not install Remotion from random GitHub forks or outdated CRA tutorials.
- Do not skip agent skills and “wing” Remotion/HyperFrames APIs from memory.
- Do not produce a video with weak branding (logo-only in a corner).
- Do not claim work-fit examples you did not find in the user’s context or imstudios.ca.
- Do not block on paid cloud render; local MP4 is enough for this handoff.

---

## One-shot kickoff line (optional)

If your agent prefers a single starter message after pasting this file:

> Execute `HANDOFF.md` end-to-end. Install Remotion + HyperFrames from the official sources, install all related skills, write the Work-fit memo from my real context + imstudios.ca, then ship and render the IM STUDIOS 12s conversion video. Report using the Phase 5 headings.
