# PLAN — kinetics-playground

## Goal
Ship a live playground of 8 spring-physics micro-interactions with real-time stiffness/damping/mass knobs and copy-ready CSS + React snippets.

## Source
- Tech: Kinetics — spring-physics motion for web interfaces (https://kinetics.colorion.co)
- Bookmark: https://x.com/tranmautritam/status/2076963534307790926

## MVP scope (in)
- Vite + React + TypeScript app under `apps/kinetics-playground/`
- One shared `useSpring` hook (real numeric spring integration via requestAnimationFrame — not fake CSS transitions) driven by a single global **Stiffness / Damping / Mass** control panel plus quick presets (Snappy / Bouncy / Gentle / Stiff)
- 8 interactive demos, each wired to the live spring config:
  1. Magnetic Button — cursor pulls it inside a dead zone
  2. Toast Overshoot — slides up, overshoots, settles
  3. Gliding Tabs — pill indicator measures + glides to the active tab
  4. Rubber-band Slider — stretches past the ends, snaps back
  5. Like Burst — heart pop + radial particle burst
  6. Hold-to-Confirm — press-and-hold ring, springs back if released early
  7. Elastic Counter — digit bumps/overshoots on increment
  8. Drag-to-Dismiss Card — drag past a threshold flings off, otherwise springs back
- Each demo card shows a live "spring(stiffness, damping)" readout and CSS + React copy-ready snippets (values interpolate live with the knobs) with a one-click copy button
- Dark theme matching the source (near-black bg, `#FF8A00` accent)

## Out of scope
- Per-demo independent spring overrides (all demos share the one global control for simplicity)
- Cursor trail, drag-to-reorder, form/star-rating demos (kept the set to 8 named archetypes)
- Backend, persistence, auth, multi-user
- Automated visual regression tests

## Stack
- Bun (package manager + scripts)
- Vite + React 18 + TypeScript, no animation library (hand-rolled spring integrator)
- Plain CSS with custom properties for theme
- Run: `cd apps/kinetics-playground && bun install && bun run dev`

## File sketch
- `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- `src/main.tsx`, `src/App.tsx`, `src/index.css`
- `src/lib/useSpring.ts`, `src/lib/springMath.ts`, `src/lib/clipboard.ts`
- `src/components/ControlPanel.tsx`, `src/components/DemoCard.tsx`, `src/components/CodeSnippet.tsx`
- `src/components/demos/{MagneticButton,ToastOvershoot,GlidingTabs,RubberSlider,LikeBurst,HoldToConfirm,ElasticCounter,DragToDismiss}.tsx`
- `README.md`

## Acceptance criteria
- [x] `bun install && bun run dev` starts the Vite dev server without errors
- [x] 8 interactive spring demos render and respond to pointer/keyboard input
- [x] Global stiffness/damping/mass knobs visibly change the motion feel live across all demos
- [x] Each demo has copy-ready CSS + React snippets with a working copy button
- [x] README documents how to run
- [x] PR includes ≥1 screenshot of the running playground
- [x] PR includes ≥1 video of the interactions in motion

## Validation
Capture screenshot + video from the running app and attach both to the PR. Not optional.
