# God's Eye View — monorepo demo

Vendored demo of [bilawalsidhu/gods-eye-view](https://github.com/bilawalsidhu/gods-eye-view): a Cesium-based live globe with keyless flights, satellites, earthquakes, and more.

Upstream marketing GIFs under `docs/media/` are omitted here to keep the sticky monorepo small. Full docs remain on the upstream README.

## Requirements

- **Bun** (install + scripts)
- **Node.js 24.14+ or 26.x** on `PATH` for Vite / doctor (upstream engines)

## Run

```bash
cd apps/gods-eye-view
bun install
bun run doctor
bun run dev
```

Open **http://localhost:4173**. Start keyless (Esri World Imagery / OSM fallback). Pick a first-run mission (Live Contacts, Space Missions, Environmental, or Explore Manually).

Optional keys (Cesium ion, Google Maps, OpenAI) go in the in-app **POWER UP** panel — not required for this demo.

## License

MIT — see `LICENSE` and `THIRD_PARTY_NOTICES.md`.
