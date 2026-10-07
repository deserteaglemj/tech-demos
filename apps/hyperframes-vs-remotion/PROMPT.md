# Shared conversion brief (bake-off)

Both guides received this exact brief. Full local-agent install + skills instructions live in **`HANDOFF.md`**.

---

**Prompt**

> Make a 12-second website conversion video for **IM STUDIOS** (https://imstudios.ca/).
>
> Goal: get a visitor to **book / inquire**.
>
> Specs: 1280×720, 30fps. Silent OK for v1.
> Brand: **IM STUDIOS** must be the hero-level signal—not a nav eyebrow.
> Offer: creative photo + video · wedding cinema · commercial · Stoney Creek, ON · 20+ years.
> Tone: cinematic, warm, modern-timeless. Sentiment + personality. Avoid generic AI purple gradients.
>
> Beat sheet:
> 1. Atmosphere / light open
> 2. Brand lockup **IM STUDIOS**
> 3. One-line promise (photo + video that balances sentiment and humour)
> 4. Service chips: Wedding · Commercial · Events
> 5. CTA: **Book a shoot** + `imstudios.ca`

---

## Guide A — HyperFrames

> Load `/product-launch-video` + `/hyperframes-core`. Write a single HTML composition with `class="clip"`, data timing attrs, paused GSAP on `window.__timelines`.

## Guide B — Remotion

> Load `/remotion-best-practices` + `/remotion-markup`. Write a React composition with `useCurrentFrame`, `interpolate`/`spring`, and `AbsoluteFill` at 30fps.

Outputs:

- HyperFrames → `public/hyperframes/index.html`
- Remotion → `src/remotion/ImStudiosConversion.tsx`
