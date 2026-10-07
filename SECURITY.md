# Security

This repository ships no API keys. The LLM Wiki Playground answers questions in mock mode by default, using only the local wiki text, so it needs no key.

## Keys and `.env` files

- Never commit `.env` files. Keep real values in `.env` or `.env.local`, which are git-ignored. The tracked `.env.example` holds no secrets.
- `VITE_OPENAI_API_KEY` is optional and meant only for local use on your own machine.
- Do not deploy the optional browser LLM path with a real key. The browser sends the key with every request, and Vite bakes `VITE_*` values into the built JavaScript, so anyone using a deployed copy could read it. Mock mode is the supported public path.

## Reporting a problem

Open an issue at [github.com/deserteaglemj/tech-demos/issues](https://github.com/deserteaglemj/tech-demos/issues). Please don't paste real keys or other secrets into an issue.
