# Shared agent prompt

Both “guides” received this exact brief. Nothing else differed except the framework skill/docs each chat was told to follow.

---

**Prompt**

> Create a 6-second product launch sting for **Lumen Desk**, a focus lamp for late-night makers.
>
> Specs: 1280×720, 30fps, no audio for this bake-off.
> Mood: late desk, warm amber accent `#E8A04A` on near-black `#0B0C0A`.
> Beats:
> 1. Soft amber glow / lamp motif appears
> 2. Brand **LUMEN DESK** lands as the hero
> 3. Tagline: *Light that stays with you*
> 4. End card CTA: **Shop the lamp**
>
> Keep it demable in one sitting. Prefer crisp type and simple motion over clutter.

---

## Guide A — HyperFrames

System note given to that chat:

> You are authoring with **HyperFrames**. Write a single `index.html` composition: `class="clip"` + `data-start` / `data-duration` / `data-track-index`, paused GSAP timeline registered on `window.__timelines`, no React, no bundler.

## Guide B — Remotion

System note given to that chat:

> You are authoring with **Remotion**. Write a React composition using `useCurrentFrame`, `interpolate`, and `AbsoluteFill`. Frame math at 30fps. Registerable in a Remotion Player.

---

Outputs live in:

- HyperFrames → `public/hyperframes/index.html`
- Remotion → `src/remotion/LumenDesk.tsx`
