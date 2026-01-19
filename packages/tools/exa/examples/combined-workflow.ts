/**
 * Combined Workflow Example: Search + Fetch Contents
 *
 * This example demonstrates how to use both createExaWebSearchTool and createExaWebContentsTool
 * together for powerful research workflows. It shows:
 * - Using both tools in a single agent/conversation
 * - When to use search vs fetch contents
 * - Multi-step research patterns
 * - Building research assistants
 *
 * Workflow pattern:
 * 1. Use createExaWebSearchTool to discover relevant URLs
 * 2. Use createExaWebContentsTool to get detailed content from specific URLs
 *
 * Prerequisites:
 * - Set EXA_API_KEY environment variable
 * - Set OPENAI_API_KEY environment variable
 *
 * Install dependencies:
 *   npm install @ai-registry/exa ai @ai-sdk/openai
 *
 * Run:
 *   npx tsx examples/combined-workflow.ts
 */

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
// When running locally: imports from built dist/
// When copying to your project: change to "@ai-registry/exa"
import {
  createExaWebSearchTool,
  createExaWebContentsTool,
} from "../dist/index.js";

async function main() {
  // ============================================================
  // Example 1: Research workflow - discover then deep-dive
  // ============================================================
  console.log("=== Example 1: Research Workflow ===\n");

  // The model has both tools and can decide which to use
  const { text: researchResult } = await generateText({
    model: openai("gpt-4o"),
    // Complex prompt that might require both searching and fetching
    prompt: `Research the latest advancements in WebAssembly (Wasm).
      1. First, search for recent articles and documentation about WebAssembly developments
      2. Then, fetch the full content from the most relevant official documentation
      3. Provide a comprehensive summary with specific technical details`,
    tools: {
      // Search tool for discovering content
      webSearch: createExaWebSearchTool({
        numResults: 5,
        type: "auto",
        contents: {
          text: { maxCharacters: 2000 },
          summary: true,
        },
      }),
      // Contents tool for deep-diving into specific URLs
      webContents: createExaWebContentsTool({
        contents: {
          text: { maxCharacters: 8000 },
          summary: true,
        },
      }),
    },
    // Allow multiple steps for the research workflow
    maxSteps: 5,
  });

  console.log("Task: WebAssembly research workflow");
  console.log("\nResult:", researchResult);

  // ============================================================
  // Example 2: Documentation analysis
  // ============================================================
  console.log("\n\n=== Example 2: Documentation Analysis ===\n");

  const { text: docsResult } = await generateText({
    model: openai("gpt-4o"),
    prompt: `I want to understand how to implement authentication in Next.js.
      Search for the official Next.js authentication documentation, then fetch
      and analyze the relevant pages to create a step-by-step implementation guide.`,
    tools: {
      webSearch: createExaWebSearchTool({
        numResults: 5,
        includeDomains: ["nextjs.org", "vercel.com"],
        contents: {
          text: { maxCharacters: 3000 },
        },
      }),
      webContents: createExaWebContentsTool({
        contents: {
          text: { maxCharacters: 10000 },
          summary: true,
          subpages: 2,
          subpageTarget: ["authentication", "auth", "middleware"],
        },
      }),
    },
    maxSteps: 5,
  });

  console.log("Task: Next.js authentication documentation analysis");
  console.log("\nResult:", docsResult);

  // ============================================================
  // Example 3: Competitive analysis
  // ============================================================
  console.log("\n\n=== Example 3: Competitive Analysis ===\n");

  const { text: competitiveResult } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Compare the features and pricing of popular vector databases.
      Search for information about Pinecone, Weaviate, and Qdrant, then
      fetch their pricing pages to create a comparison table.`,
    tools: {
      webSearch: createExaWebSearchTool({
        numResults: 6,
        type: "auto",
        contents: {
          text: { maxCharacters: 2500 },
          highlights: {
            numSentences: 2,
            highlightsPerUrl: 3,
            query: "features and pricing",
          },
        },
      }),
      webContents: createExaWebContentsTool({
        contents: {
          text: { maxCharacters: 6000 },
          summary: true,
          livecrawl: "always", // Get fresh pricing info
        },
      }),
    },
    maxSteps: 6,
  });

  console.log("Task: Vector database comparison");
  console.log("\nResult:", competitiveResult);

  // ============================================================
  // Example 4: News + Source verification
  // ============================================================
  console.log(
    "\n\n=== Example 4: News Research with Source Verification ===\n",
  );

  const { text: newsResult } = await generateText({
    model: openai("gpt-4o"),
    prompt: `What are the recent developments in quantum computing?
      Search for news from the past week, then verify the information
      by fetching content from the original sources or official announcements.`,
    tools: {
      webSearch: createExaWebSearchTool({
        category: "news",
        numResults: 5,
        startPublishedDate: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        contents: {
          text: { maxCharacters: 2000 },
          highlights: true,
        },
      }),
      webContents: createExaWebContentsTool({
        contents: {
          text: { maxCharacters: 5000 },
          livecrawl: "always",
          extras: {
            links: 5, // Get related links for further verification
          },
        },
      }),
    },
    maxSteps: 5,
  });

  console.log("Task: Quantum computing news with verification");
  console.log("\nResult:", newsResult);

  // ============================================================
  // Example 5: Technical tutorial creation
  // ============================================================
  console.log("\n\n=== Example 5: Technical Tutorial Creation ===\n");

  const { text: tutorialResult } = await generateText({
    model: openai("gpt-4o"),
    system: `You are a technical writer creating developer tutorials.
      When researching, use web search to find authoritative sources,
      then fetch their full content to extract accurate code examples
      and best practices.`,
    prompt: `Create a tutorial on how to set up a TypeScript monorepo with Turborepo.
      Research the official documentation and best practices, then create
      a step-by-step guide with code examples.`,
    tools: {
      webSearch: createExaWebSearchTool({
        numResults: 5,
        includeDomains: [
          "turbo.build",
          "github.com",
          "typescript-eslint.io",
          "docs.npmjs.com",
        ],
        type: "auto",
        contents: {
          text: { maxCharacters: 3000 },
          summary: true,
        },
      }),
      webContents: createExaWebContentsTool({
        contents: {
          text: { maxCharacters: 8000 },
          summary: true,
          subpages: 2,
        },
      }),
    },
    maxSteps: 6,
  });

  console.log("Task: Turborepo monorepo tutorial");
  console.log("\nResult:", tutorialResult);

  // ============================================================
  // Example 6: API exploration
  // ============================================================
  console.log("\n\n=== Example 6: API Documentation Exploration ===\n");

  const { text: apiResult } = await generateText({
    model: openai("gpt-4o"),
    prompt: `I want to use the GitHub API to list all repositories for a user.
      Search for the relevant API documentation, then fetch the specific
      endpoint documentation and provide example code using fetch.`,
    tools: {
      webSearch: createExaWebSearchTool({
        numResults: 5,
        includeDomains: ["docs.github.com", "api.github.com"],
        includeText: ["REST API", "repositories"],
        contents: {
          text: { maxCharacters: 2500 },
        },
      }),
      webContents: createExaWebContentsTool({
        contents: {
          text: { maxCharacters: 6000 },
          highlights: {
            numSentences: 2,
            highlightsPerUrl: 5,
            query: "endpoint parameters and response",
          },
        },
      }),
    },
    maxSteps: 4,
  });

  console.log("Task: GitHub API exploration");
  console.log("\nResult:", apiResult);

  // ============================================================
  // Example 7: Research with context generation
  // ============================================================
  console.log("\n\n=== Example 7: Research with Context ===\n");

  const { text: contextResult } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Research the current state of Rust for web development.
      Find information about frameworks like Actix, Axum, and Rocket,
      and compare their performance and developer experience.`,
    tools: {
      webSearch: createExaWebSearchTool({
        numResults: 8,
        type: "neural", // Better for conceptual searches
        contents: {
          text: { maxCharacters: 3000 },
          summary: true,
          // Get a combined context of all results
          context: { maxCharacters: 15000 },
        },
      }),
      webContents: createExaWebContentsTool({
        contents: {
          text: { maxCharacters: 5000 },
          summary: true,
        },
      }),
    },
    maxSteps: 5,
  });

  console.log("Task: Rust web development research");
  console.log("\nResult:", contextResult);
}

main().catch(console.error);
