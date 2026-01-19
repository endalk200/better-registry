/**
 * Fetch Web Contents Example
 *
 * This example demonstrates how to use the createExaWebContentsTool tool
 * to fetch full page contents from known URLs. It shows how to:
 * - Fetch content from specific URLs (when you already know the URLs)
 * - Configure text extraction options
 * - Get AI-generated summaries
 * - Use livecrawl for fresh content
 *
 * Use createExaWebContentsTool when:
 * - You already have URLs and want their content
 * - You need to analyze specific pages
 * - You want to summarize articles or documentation
 *
 * Use exaWebSearch when:
 * - You need to discover URLs by searching
 * - You want to find relevant content on a topic
 *
 * Prerequisites:
 * - Set EXA_API_KEY environment variable
 * - Set OPENAI_API_KEY environment variable
 *
 * Install dependencies:
 *   npm install @ai-registry/exa ai @ai-sdk/openai
 *
 * Run:
 *   npx tsx examples/fetch-contents.ts
 */

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
// When running locally: imports from built dist/
// When copying to your project: change to "@ai-registry/exa"
import { createExaWebContentsTool } from "../dist/index.js";

async function main() {
  // ============================================================
  // Example 1: Basic content fetching
  // ============================================================
  console.log("=== Example 1: Basic Content Fetching ===\n");

  const { text: basicResult } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt:
      "Summarize the main points from the Vercel AI SDK documentation homepage at https://sdk.vercel.ai/docs",
    tools: {
      // createExaWebContentsTool fetches content from URLs the model provides
      webContents: createExaWebContentsTool(),
    },
    maxSteps: 3,
  });

  console.log("Task: Summarize Vercel AI SDK docs");
  console.log("\nResult:", basicResult);

  // ============================================================
  // Example 2: Fetch with custom text options
  // ============================================================
  console.log("\n\n=== Example 2: Custom Text Options ===\n");

  const { text: customTextResult } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt:
      "Get the full text from https://openai.com/research and explain their current research focus areas",
    tools: {
      webContents: createExaWebContentsTool({
        contents: {
          // Get more text content (default is 3000)
          text: { maxCharacters: 8000 },
        },
      }),
    },
    maxSteps: 3,
  });

  console.log("Task: Analyze OpenAI research page");
  console.log("\nResult:", customTextResult);

  // ============================================================
  // Example 3: Get summaries automatically
  // ============================================================
  console.log("\n\n=== Example 3: AI-Generated Summaries ===\n");

  const { text: summaryResult } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt:
      "Fetch and compare the content from these two URLs: https://react.dev and https://vuejs.org. What are the main differences in their documentation approach?",
    tools: {
      webContents: createExaWebContentsTool({
        contents: {
          text: { maxCharacters: 5000 },
          // Let Exa generate a summary for each page
          summary: true,
        },
      }),
    },
    maxSteps: 3,
  });

  console.log("Task: Compare React and Vue documentation");
  console.log("\nResult:", summaryResult);

  // ============================================================
  // Example 4: Always livecrawl for fresh content
  // ============================================================
  console.log("\n\n=== Example 4: Fresh Content with Livecrawl ===\n");

  const { text: liveResult } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt:
      "What is the current status on https://status.openai.com? Is there any ongoing incident?",
    tools: {
      webContents: createExaWebContentsTool({
        contents: {
          text: { maxCharacters: 3000 },
          // Always fetch fresh content - important for status pages
          livecrawl: "always",
          // Set a timeout for livecrawl
          livecrawlTimeout: 10000,
        },
      }),
    },
    maxSteps: 3,
  });

  console.log("Task: Check OpenAI status page");
  console.log("\nResult:", liveResult);

  // ============================================================
  // Example 5: Get highlights from content
  // ============================================================
  console.log("\n\n=== Example 5: Extract Highlights ===\n");

  const { text: highlightsResult } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt:
      "What are the key features mentioned on https://www.anthropic.com/claude? Extract the most important capabilities.",
    tools: {
      webContents: createExaWebContentsTool({
        contents: {
          text: { maxCharacters: 4000 },
          // Get LLM-identified highlights
          highlights: {
            numSentences: 3,
            highlightsPerUrl: 5,
            // Focus highlights on specific content
            query: "key features and capabilities",
          },
        },
      }),
    },
    maxSteps: 3,
  });

  console.log("Task: Extract key features from Anthropic Claude page");
  console.log("\nResult:", highlightsResult);

  // ============================================================
  // Example 6: Fetch with subpages
  // ============================================================
  console.log("\n\n=== Example 6: Crawl Subpages ===\n");

  const { text: subpagesResult } = await generateText({
    model: openai("gpt-4o"),
    prompt:
      "Analyze the pricing structure from https://stripe.com/pricing including any related pricing pages",
    tools: {
      webContents: createExaWebContentsTool({
        contents: {
          text: { maxCharacters: 6000 },
          summary: true,
          // Also crawl subpages from the main URL
          subpages: 3,
          // Target specific types of subpages
          subpageTarget: ["pricing", "plans", "features"],
        },
      }),
    },
    maxSteps: 3,
  });

  console.log("Task: Analyze Stripe pricing with subpages");
  console.log("\nResult:", subpagesResult);

  // ============================================================
  // Example 7: Get extra information (links, images)
  // ============================================================
  console.log("\n\n=== Example 7: Extract Links and Images ===\n");

  const { text: extrasResult } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt:
      "Get the main content from https://github.com/vercel/ai and list the important links and resources mentioned",
    tools: {
      webContents: createExaWebContentsTool({
        contents: {
          text: { maxCharacters: 4000 },
          // Extract additional metadata
          extras: {
            links: 10, // Get up to 10 links from the page
            imageLinks: 5, // Get up to 5 image links
          },
        },
      }),
    },
    maxSteps: 3,
  });

  console.log("Task: Analyze Vercel AI SDK GitHub repo");
  console.log("\nResult:", extrasResult);

  // ============================================================
  // Example 8: Custom tool description
  // ============================================================
  console.log("\n\n=== Example 8: Custom Tool Description ===\n");

  const { text: customDescResult } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt:
      "Read the API documentation at https://docs.exa.ai and explain how to use their search endpoint",
    tools: {
      webContents: createExaWebContentsTool(
        {
          contents: {
            text: { maxCharacters: 6000 },
            summary: true,
            highlights: {
              numSentences: 2,
              highlightsPerUrl: 4,
              query: "API endpoints and parameters",
            },
          },
        },
        // Custom description helps the model understand this tool's purpose
        {
          description:
            "Fetch and read technical documentation pages. Use this to extract API specifications, code examples, and usage instructions from documentation URLs.",
        },
      ),
    },
    maxSteps: 3,
  });

  console.log("Task: Explain Exa API documentation");
  console.log("\nResult:", customDescResult);
}

main().catch(console.error);
