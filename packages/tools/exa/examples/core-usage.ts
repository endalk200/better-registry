/**
 * Core Functions Usage Example (SDK-Agnostic)
 *
 * This example demonstrates how to use the core SDK-agnostic functions
 * directly, without the AI SDK adapter. This is useful when:
 * - You want to use Exa with a different AI SDK
 * - You're building custom integrations
 * - You need direct access to the API without tool wrappers
 * - You're writing backend services that call Exa directly
 *
 * The core functions provide the same functionality as the AI SDK tools
 * but return raw results that you can process however you need.
 */

// Import from the /core subpath for SDK-agnostic functions
// When running locally: imports from built dist/
// When copying to your project: change to "@ai-registry/exa/core" and "@ai-registry/exa"
import { webSearch, webContents } from "../dist/core/index.js";
import type { ExaApiResponse, ExaContentsResponse } from "../dist/index.js";

async function main() {
  // ============================================================
  // Example 1: Basic web search
  // ============================================================
  console.log("=== Example 1: Basic Web Search ===\n");

  // Call webSearch directly - no AI SDK required
  const searchResults: ExaApiResponse = await webSearch(
    { query: "TypeScript 5.0 new features" },
    {
      // API key can be passed or read from EXA_API_KEY env
      apiKey: process.env.EXA_API_KEY,
      numResults: 5,
      type: "auto",
      contents: {
        text: { maxCharacters: 2000 },
        summary: true,
      },
    },
  );

  console.log("Search Results:");
  console.log(`Request ID: ${searchResults.requestId}`);
  console.log(`Number of results: ${searchResults.results.length}`);
  console.log("\nResults:");
  searchResults.results.forEach((result, i) => {
    console.log(`\n${i + 1}. ${result.title}`);
    console.log(`   URL: ${result.url}`);
    if (result.summary) {
      console.log(`   Summary: ${result.summary.substring(0, 150)}...`);
    }
  });

  // ============================================================
  // Example 2: Research paper search
  // ============================================================
  console.log("\n\n=== Example 2: Research Paper Search ===\n");

  const paperResults = await webSearch(
    { query: "attention mechanisms in neural networks" },
    {
      category: "research paper",
      type: "neural",
      numResults: 3,
      includeDomains: ["arxiv.org"],
      contents: {
        text: { maxCharacters: 3000 },
        highlights: {
          numSentences: 2,
          highlightsPerUrl: 3,
        },
      },
    },
  );

  console.log("Research Paper Results:");
  paperResults.results.forEach((result, i) => {
    console.log(`\n${i + 1}. ${result.title}`);
    console.log(`   URL: ${result.url}`);
    console.log(`   Published: ${result.publishedDate || "Unknown"}`);
    if (result.highlights && result.highlights.length > 0) {
      console.log("   Key highlights:");
      result.highlights.slice(0, 2).forEach((h, j) => {
        console.log(`     ${j + 1}. ${h.substring(0, 100)}...`);
      });
    }
  });

  // ============================================================
  // Example 3: Fetch contents from URLs
  // ============================================================
  console.log("\n\n=== Example 3: Fetch Web Contents ===\n");

  // Get full content from specific URLs
  const contentsResult: ExaContentsResponse = await webContents(
    {
      urls: [
        "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html",
        "https://react.dev/learn",
      ],
    },
    {
      contents: {
        text: { maxCharacters: 5000 },
        summary: true,
      },
    },
  );

  console.log("Contents Results:");
  console.log(`Request ID: ${contentsResult.requestId}`);
  contentsResult.results.forEach((result, i) => {
    console.log(`\n${i + 1}. ${result.title}`);
    console.log(`   URL: ${result.url}`);
    if (result.summary) {
      console.log(`   Summary: ${result.summary.substring(0, 200)}...`);
    }
    if (result.text) {
      console.log(`   Text length: ${result.text.length} characters`);
    }
  });

  // Check for any errors in fetching
  if (contentsResult.statuses) {
    const errors = contentsResult.statuses.filter((s) => s.status === "error");
    if (errors.length > 0) {
      console.log("\nFetch errors:");
      errors.forEach((e) => {
        console.log(`  - ${e.id}: ${e.error?.tag}`);
      });
    }
  }

  // ============================================================
  // Example 4: Advanced search with date filtering
  // ============================================================
  console.log("\n\n=== Example 4: Date-Filtered Search ===\n");

  // Get content from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentResults = await webSearch(
    { query: "AI regulation policy" },
    {
      category: "news",
      numResults: 5,
      startPublishedDate: thirtyDaysAgo.toISOString(),
      includeDomains: ["reuters.com", "bbc.com", "nytimes.com"],
      contents: {
        text: { maxCharacters: 1500 },
        livecrawl: "fallback",
      },
    },
  );

  console.log("Recent News Results:");
  recentResults.results.forEach((result, i) => {
    console.log(`\n${i + 1}. ${result.title}`);
    console.log(`   Published: ${result.publishedDate || "Unknown"}`);
    console.log(`   URL: ${result.url}`);
  });

  // ============================================================
  // Example 5: Using response data for custom processing
  // ============================================================
  console.log("\n\n=== Example 5: Custom Processing ===\n");

  const techResults = await webSearch(
    { query: "best practices for React hooks" },
    {
      numResults: 10,
      includeDomains: ["react.dev", "blog.logrocket.com", "dev.to"],
      contents: {
        text: { maxCharacters: 2000 },
        extras: {
          links: 5,
        },
      },
    },
  );

  // Process results programmatically
  const processedResults = techResults.results.map((result) => ({
    title: result.title,
    url: result.url,
    domain: new URL(result.url).hostname,
    hasText: Boolean(result.text),
    textLength: result.text?.length || 0,
    relatedLinks: result.extras?.links?.slice(0, 3) || [],
  }));

  console.log("Processed Results:");
  console.log(JSON.stringify(processedResults, null, 2));

  // Aggregate statistics
  const stats = {
    totalResults: processedResults.length,
    totalTextCharacters: processedResults.reduce(
      (sum, r) => sum + r.textLength,
      0,
    ),
    domainBreakdown: processedResults.reduce(
      (acc, r) => {
        acc[r.domain] = (acc[r.domain] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  };

  console.log("\nStatistics:");
  console.log(JSON.stringify(stats, null, 2));

  // ============================================================
  // Example 6: Error handling
  // ============================================================
  console.log("\n\n=== Example 6: Error Handling ===\n");

  try {
    // This will throw MissingApiKeyError if no API key is provided
    await webSearch(
      { query: "test" },
      { apiKey: undefined }, // Force no API key
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Caught expected error: ${error.name}`);
      console.log(`Message: ${error.message}`);
    }
  }

  // Handle content fetch errors gracefully
  const mixedContents = await webContents(
    {
      urls: [
        "https://www.google.com", // Should work
        "https://this-domain-does-not-exist-12345.com", // Should fail
      ],
    },
    {
      contents: {
        text: { maxCharacters: 1000 },
        livecrawl: "fallback",
        livecrawlTimeout: 5000,
      },
    },
  );

  console.log("\nMixed content results:");
  console.log(`Successful: ${mixedContents.results.length} results`);
  if (mixedContents.statuses) {
    mixedContents.statuses.forEach((status) => {
      console.log(`  ${status.id}: ${status.status}`);
      if (status.error) {
        console.log(`    Error: ${status.error.tag}`);
      }
    });
  }

  // ============================================================
  // Example 7: Deep search with additional queries
  // ============================================================
  console.log("\n\n=== Example 7: Deep Search ===\n");

  const deepResults = await webSearch(
    { query: "machine learning model deployment best practices" },
    {
      type: "deep",
      numResults: 8,
      // Additional queries help expand the search
      additionalQueries: [
        "MLOps deployment strategies",
        "production ML pipeline",
        "model serving infrastructure",
      ],
      contents: {
        text: { maxCharacters: 2500 },
        summary: true,
        // Get combined context of all results
        context: { maxCharacters: 10000 },
      },
    },
  );

  console.log("Deep Search Results:");
  console.log(`Search type used: ${deepResults.searchType}`);
  console.log(`Results count: ${deepResults.results.length}`);

  // The context field contains a combined, LLM-friendly summary
  if (deepResults.context) {
    console.log(`\nCombined context (first 500 chars):`);
    console.log(deepResults.context.substring(0, 500) + "...");
  }

  // Cost information (if available)
  if (deepResults.costDollars?.total) {
    console.log(
      `\nEstimated cost: $${deepResults.costDollars.total.toFixed(4)}`,
    );
  }
}

main().catch(console.error);
