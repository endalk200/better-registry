# Playground Chat Architecture

## Ownership Boundaries

- `src/lib/playground/chat-contract.ts`
  - Shared request/metadata schemas
  - Provider/model allowlists
  - Request limits and error contract primitives
- `src/app/playground/hooks/use-playground-chat.ts`
  - UI transport setup (`DefaultChatTransport`)
  - Always injects current `provider`/`model` for submit and regenerate
  - Exposes UI-safe operations (`submit`, `stop`, `regenerateLast`)
- `src/app/api/chat/route.ts`
  - Enforces runtime contract validation and payload limits
  - Applies strict local-only access guard and provider credential checks
  - Streams model output and emits message metadata

## Contract Direction

- UI and API both import from `src/lib/playground/chat-contract.ts`.
- Route handlers must not depend on page-local files.
- Provider/model support changes should be updated in the shared contract first.
