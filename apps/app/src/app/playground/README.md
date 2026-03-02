# Playground

The playground is designed for local development and model behavior checks.

## Local-Only Intent

- Playground chat is hard-locked to localhost (`localhost`, `127.0.0.1`, `::1`).
- In deployed environments, `/api/chat` returns `403` by design.

## Environment Requirements

- `OPENAI_API_KEY` for OpenAI models.
- `OPENROUTER_API_KEY` for OpenRouter models.

## Supported Providers and Models

- `openai`
  - `gpt-4o`
  - `gpt-4o-mini`
- `openrouter`
  - `anthropic/claude-sonnet-4`
  - `google/gemini-2.0-flash`
  - `meta-llama/llama-3.1-70b-instruct`

## Known Constraints

- Playground currently supports plain chat streaming only (no tools/agent loop).
- Request shape and model/provider pairs are strict and validated at runtime.
- Endpoint access is intentionally local-only, not internet-facing.
