/**
 * SDK adapters for Exa tools.
 */

// AI SDK adapter
export {
  createExaWebSearchTool,
  createExaWebContentsTool,
  type ExaToolOptions,
  type WebSearchOptions,
  type WebContentsOptions,
} from "./ai-sdk.js";

// TanStack AI adapter
export {
  createTanstackExaWebSearchTool,
  createTanstackExaWebContentsTool,
} from "./tanstack-ai.js";
