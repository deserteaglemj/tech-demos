# Upstream WeKnora install notes

Validated against [Tencent/WeKnora](https://github.com/Tencent/WeKnora) **v0.8.2**.

## What we ran

```bash
git clone --depth 1 --branch v0.8.2 https://github.com/Tencent/WeKnora.git
cd WeKnora
cp .env.example .env
# Set DB_USER, DB_PASSWORD, DB_NAME, REDIS_PASSWORD,
# JWT_SECRET=$(openssl rand -hex 32), SYSTEM_AES_KEY=$(openssl rand -hex 16)
# FRONTEND_PORT=3080, WEKNORA_VERSION=v0.8.2, LANGFUSE_ENABLED=false
docker compose pull
docker compose up -d
```

### Environment quirk (this VM)

Docker **bridge networking blocked container↔container TCP** (DNS resolved; `connect` timed out). Workaround used here:

- Publish postgres `5432`, redis `6379`, docreader `50051` to the host
- Run the `app` service with `network_mode: host` and point `DB_HOST` / `REDIS_ADDR` / `DOCREADER_ADDR` at `127.0.0.1`
- Frontend stays on bridge with `APP_HOST=host.docker.internal` and `extra_hosts: host.docker.internal:host-gateway`

After that:

| Service | URL |
|---------|-----|
| Web UI | http://127.0.0.1:3080 |
| API health | http://127.0.0.1:8080/health → `{"status":"ok"}` |

## Functional check

- Registration + login worked (test user created)
- Onboarding tour, Knowledge Bases, Chat, Agents (4 templates), Artifacts, Toolbox, Model settings all reachable
- **Chat/RAG/Agent execution needs an LLM** (OpenAI-compatible API or Ollama). Without keys, model management shows “no available models”; UI otherwise demos cleanly.

## Playground vs upstream

`apps/weknora-playground` is a Bun mock of the three modes for demos without Docker/LLM. Prefer upstream Compose when you have Docker bridge networking and model credentials.
