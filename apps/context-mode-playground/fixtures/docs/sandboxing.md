# Sandboxed execution

Context Mode runs agent tool work inside an isolated subprocess. Only stdout
enters the conversation context. Raw logs, API payloads, and file dumps stay
inside the sandbox.

## Why it matters

A Playwright snapshot can cost tens of kilobytes. Twenty GitHub issues can blow
past 50 KB. After half an hour of exploratory work, a large fraction of the
window is tool noise — not decisions.

## Pattern

Write a short script that filters, aggregates, or counts. Print only the answer.
Prefer `ctx_execute` over dumping `Read` / `Bash` output into the chat.
