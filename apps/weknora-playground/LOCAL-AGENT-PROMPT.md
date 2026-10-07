# Prompt for the local agent

Paste the block below as the first message. The agent should be pointed at this repo (`deserteaglemj/tech-demos`, branch `cursor/weknora-playground-d390` or `main` after merge).

---

You are auditing one product, WeKnora, for this machine and for every AI agent installed on it. Success is a go / no-go per agent, with the file or config path that justifies it. A paragraph of enthusiasm is a failed answer.

## How to work

1. Read the repo before you invent a use. Open these files in order and quote the lines you rely on:
   - `apps/weknora-playground/public/rag-brief.html` (the measurement)
   - `apps/weknora-playground/INSTALL.md` (how v0.8.2 was actually started)
   - `apps/weknora-playground/README.md`
   - `AGENTS.md` (what this repo’s cloud agents are already told to do)
2. Treat the evidence packet below as the test record. If the HTML brief disagrees with this packet, trust the brief and say so.
3. Then inspect this device. Do not assume the cloud VM where the test ran is this computer. Check what is installed here.
4. Separate three claims and score each one:
   - Retrieval: can an agent fetch a filed passage quickly?
   - Answering: can WeKnora’s own model say the fact correctly?
   - Memory: does a stored note change the next session’s answer?
5. If you cannot find a config file, say “not installed” for that agent. Do not recommend a setup you did not see a place to attach.

## Evidence packet (measured 7 Oct 2026)

Product under test: Tencent WeKnora **v0.8.2**, Docker services app + ParadeDB + Redis + docreader + UI. Health check `GET http://127.0.0.1:8080/health` returned `{"status":"ok"}`. UI was on port 3080. Models were local Ollama: embedding `nomic-embed-text` (768 dimensions), chat `qwen2.5:0.5b`.

Corpus, 11 documents, all reached parse status `completed` after the install fix below:

- Public READMEs for the owner’s GitHub repos: habla-spanish, orbitdiff, mstudios-react, hermes-agent, logo-creation-skill, betterbrand-breath-test, tech-demos.
- A profile card: GitHub login `deserteaglemj`, account created 2024-12-11, 7 public repos.
- Files that already exist in this workspace: `AGENTS.md`, `tracking/seen-bookmarks.json`.
- A September 2026 digest pasted from the owner’s primary Google Calendar. WeKnora did not read Calendar or GitHub by itself.

Method:

- Ingest via `POST /api/v1/knowledge-bases/:id/knowledge/manual`.
- Score retrieval with `POST /api/v1/knowledge-bases/:id/hybrid-search`, 5 repeats after the index was warm. A hit means every expected string was inside the returned chunks.
- Cursor baseline was `rg -F` over the open `tech-demos` workspace, skipping `node_modules` and `dist`.
- Answers used real `POST /api/v1/knowledge-chat/:session_id` streaming, not the Bun mock UI in `src/`.
- Memory used `PUT /api/v1/tenants/kv/memory-config` then `POST /api/v1/memory/items`, then a new session.

Results you must not soften:

- Warm hybrid search: **11/11** required facts found. Median **58.7 ms** (the brief rounds the headline to 59 ms).
- Keyword-only search (vectors disabled): also **11/11**, median **19.8 ms**. On this 11-document set, embeddings did not raise accuracy.
- Workspace ripgrep: **2/11**. It hit only the two facts already in the repo (`claude-sonnet-5` in `AGENTS.md`, `kinetics-playground` in the bookmarks file), median **5.5 ms**, about 11× faster than WeKnora.
- The other 9 facts (other repos, profile date, calendar: Mstudios Sync, Delta **DL 609**, Murph Captains at The Goodtime Hotel starting 2:45pm) were misses for workspace search and hits for WeKnora.
- A live GitHub walk that listed repos and downloaded READMEs until it found the Spanish app took **352 ms**. One known README download took **76 ms**. WeKnora was faster only because the files were already ingested.
- First searches while embeddings were still running took **11.0 s** and **27.0 s**. Steady state is the sub-75 ms number, not those.
- Full answers from `qwen2.5:0.5b`: **0/3** contained the fact. Time-to-first-byte was about **110 ms**; totals were **115.5 s**, **12.9 s**, and **6.7 s**. Retrieval had already returned the right passage.
- Same-chat memory failed. The user said the October demo code name was **Harborline**. The next turn answered **sv-agentation-playground**, a slug from the bookmarks file. 4.6 s to store, 6.9 s to answer.
- Cross-chat memory: the personal switch alone left `effective: false` and `POST /memory/items` returned “memory is disabled.” After the workspace config was enabled, the preference was stored and `use_count` went from 0 to 1, so the note was attached to the next turn. The 0.5B answer still did not repeat it. Write mode was `explicit_only`. Notion memory for this account was empty, so Cursor had no competing long-term note.
- Install blocker: WeKnora rewrites `127.0.0.1` to `host.docker.internal` and blocks it until `SSRF_WHITELIST_EXTRA` includes that host. Ollama had to listen on `0.0.0.0` because the rewritten address is the Docker bridge `172.17.0.1`. Until then every document failed and search returned nothing.
- This VM’s Docker bridge also dropped container-to-container TCP. The app ran with `network_mode: host`. Do not copy that workaround unless you reproduce the same failure here.
- `apps/weknora-playground/src/` is a mock UI with no retrieval. Ignore it when you judge value.

## What to inspect on this device

Search the filesystem and the process list. Report each item as found path, or “not present.”

- Docker and a running WeKnora compose project (containers, `docker compose ps`, ports 80/3080/8080).
- Ollama or any other OpenAI-compatible server, and whether WeKnora can reach it without the SSRF rewrite failure above.
- MCP client configs. Check at least:
  - Cursor: `~/.cursor/mcp.json`, project `.cursor/mcp.json`
  - Claude Desktop / Claude Code: `~/Library/Application Support/Claude/`, `~/.claude.json`, `~/.claude/`
  - Any `mcp.json` under the home directory
- Other agents actually installed, including anything named in the owner’s repos (`hermes-agent`, logo-creation skill, Cursor cloud agents, Codex, Continue, Cline, Aider, Open WebUI). Look in `~/`, `/opt`, `/usr/local`, and running processes.
- Existing memory stores: Cursor memories, Claude project memory, Notion “memory”, local sqlite indexes. Note which ones are empty.
- Whether one WeKnora HTTP endpoint or MCP server is already shared, or whether each agent would need its own copy.

WeKnora’s cross-agent path is its MCP server and its HTTP API (`/api/v1/knowledge-bases/:id/hybrid-search`), not its built-in chat. Confirm the MCP port and tool names from the WeKnora version installed here (upstream docs call the tool surface `search_knowledge` / `read_document` / `list_documents`). If that binary is not on this machine, say the integration is possible and not yet present.

## Decision rubric

Use WeKnora for an agent only if all of these are true:

- The fact is not already in the repo that agent has open (otherwise local search is faster and as accurate).
- Someone will keep a knowledge base updated. A stale snapshot is worse than a live GitHub or Calendar connector the agent already has.
- The agent can call WeKnora as a tool and still answer with its own model. Do not route the final sentence through `qwen2.5:0.5b`.
- The same base URL and API key can be added to every MCP client you found. One server, many clients. A second WeKnora stack per agent is not “works across all agents.”

Memory is a separate switch. Count it as working only if a new session’s answer contains the stored sentence. A row in `/memory/items` with `use_count >= 1` is necessary and was not sufficient in this test.

## Output

Write this and stop. No new demo app.

1. **Device inventory** — table: component, path or “not present”, relevant version.
2. **Per-agent verdict** — for every agent you found: `use as retrieval tool` / `do not add` / `already covered by a live connector`. One sentence each, tied to a file you opened.
3. **Shared-server plan** — if more than one agent should use it, the single MCP or HTTP config snippet (redact secrets) and the list of clients that can point at it. If none can, say so.
4. **What not to migrate** — repo search, live GitHub, live Calendar, and in-thread chat memory, unless you found a concrete gap.
5. **Open risk** — the 0/3 answer failure and the Harborline hallucination, and whether this machine’s chat model is any stronger than `qwen2.5:0.5b`.
