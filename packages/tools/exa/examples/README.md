# Exa Tools Examples

Example scripts demonstrating how to use `@ai-registry/exa` with the Vercel AI SDK.

## Prerequisites

1. **Build the package first:**

   ```bash
   pnpm build
   ```

2. **Set environment variables:**
   ```bash
   export EXA_API_KEY="your-exa-api-key"
   export OPENAI_API_KEY="your-openai-api-key"
   ```

## Running Examples

From the `packages/tools/exa` directory:

```bash
# Run any example directly
pnpm example:basic      # Basic web search
pnpm example:research   # Research paper search
pnpm example:news       # News search with date filtering
pnpm example:contents   # Fetch content from URLs
pnpm example:combined   # Combined search + contents workflow
pnpm example:core       # SDK-agnostic core functions

# Or run any example file directly
pnpm example examples/basic-search.ts
```

## Examples Overview

| Example                | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `basic-search.ts`      | Simple web search - basic usage, result counts, API keys    |
| `research-papers.ts`   | Academic search - categories, domains, neural search        |
| `news-search.ts`       | News search - date filtering, trusted sources, localization |
| `fetch-contents.ts`    | URL content fetching - text, summaries, livecrawl           |
| `combined-workflow.ts` | Using both tools together for research workflows            |
| `core-usage.ts`        | Direct core function usage without AI SDK wrappers          |

## Using in Your Own Project

When copying these examples to your project, update the imports:

```typescript
// Change from local imports:
import { exaWebSearch } from "../dist/index.js";

// To package imports:
import { exaWebSearch } from "@ai-registry/exa";
```
