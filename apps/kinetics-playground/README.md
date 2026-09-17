# Kinetics Playground

A live playground of spring-physics UI micro-interactions, inspired by [kinetics.colorion.co](https://kinetics.colorion.co).

Every demo is driven by a real numeric spring integrator (`src/lib/useSpring.ts`) — semi-implicit Euler integration over `requestAnimationFrame`, not a fixed-duration CSS transition. One global **Stiffness / Damping / Mass** control panel feeds all 8 demos at once, so dragging a knob reshapes the motion everywhere in real time.

## Run it

```bash
bun install
bun run dev
```

Open the printed local URL (defaults to `http://localhost:5173`).

## What's inside

8 interactions, each with a "View code" toggle exposing copy-ready **React**, **CSS**, and **AI prompt** snippets that interpolate the current stiffness/damping/mass values:

1. **Magnetic Button** — cursor pulls it toward the pointer inside a dead zone
2. **Toast Overshoot** — slides up, overshoots, settles
3. **Gliding Tabs** — pill indicator measures + glides to the active tab
4. **Rubber-band Slider** — stretches past the ends while dragging, snaps back on release
5. **Like Burst** — heart pop + radial particle burst
6. **Hold to Confirm** — press-and-hold progress ring; release early and it springs back
7. **Elastic Counter** — digit bumps and overshoots on every increment
8. **Drag to Dismiss** — drag a card past a threshold to fling it off, or let it spring back

## Stack

- Bun (package manager + scripts)
- Vite + React 19 + TypeScript
- Plain CSS with custom properties — no animation library; the spring math is ~70 lines in `src/lib/useSpring.ts`

## Scripts

- `bun run dev` — start the Vite dev server
- `bun run build` — typecheck + production build
- `bun run preview` — preview the production build
- `bun run lint` — oxlint
