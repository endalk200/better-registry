/**
 * News Search Example
 *
 * This example demonstrates how to configure the Exa web search tool
 * for news article searches. It shows how to:
 * - Use the "news" category for current events
 * - Apply date filters to get recent content
 * - Configure content extraction for news articles
 * - Filter by specific news domains
 *
 * Prerequisites:
 * - Set EXA_API_KEY environment variable
 * - Set OPENAI_API_KEY environment variable
 *
 * Install dependencies:
 *   npm install @ai-registry/exa ai @ai-sdk/openai
 *
 * Run:
 *   npx tsx examples/news-search.ts
 */

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
// When running locally: imports from built dist/
// When copying to your project: change to "@ai-registry/exa"
import { createExaWebSearchTool } from "../dist/index.js";

async function main() {
  // ============================================================
  // Example 1: Recent news search
  // ============================================================
  console.log("=== Example 1: Recent News (Last 7 Days) ===\n");

  // Calculate date for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { text: recentNews } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "What are the major tech industry news from this week?",
    tools: {
      webSearch: createExaWebSearchTool({
        // Focus on news articles
        category: "news",
        // Only get content from the last 7 days
        startPublishedDate: sevenDaysAgo.toISOString(),
        numResults: 10,
        contents: {
          // News articles typically need less text than research papers
          text: { maxCharacters: 2000 },
          // Get quick highlights for key points
          highlights: {
            numSentences: 2,
            highlightsPerUrl: 2,
          },
        },
      }),
    },
    maxSteps: 3,
  });

  console.log("Question: Major tech news this week");
  console.log("\nAnswer:", recentNews);

  // ============================================================
  // Example 2: Breaking news (last 24 hours)
  // ============================================================
  console.log("\n\n=== Example 2: Breaking News (Last 24 Hours) ===\n");

  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const { text: breakingNews } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "What is the latest breaking news in the AI industry?",
    tools: {
      webSearch: createExaWebSearchTool({
        category: "news",
        // Only content from the last 24 hours
        startPublishedDate: oneDayAgo.toISOString(),
        numResults: 8,
        // Use livecrawl to ensure freshest content
        contents: {
          text: { maxCharacters: 1500 },
          highlights: true,
          // Always fetch fresh content for breaking news
          livecrawl: "always",
        },
      }),
    },
    maxSteps: 3,
  });

  console.log("Question: Breaking AI industry news");
  console.log("\nAnswer:", breakingNews);

  // ============================================================
  // Example 3: News from specific sources
  // ============================================================
  console.log("\n\n=== Example 3: Trusted News Sources ===\n");

  const { text: trustedNews } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "What are the latest developments in climate change policy?",
    tools: {
      webSearch: createExaWebSearchTool({
        category: "news",
        numResults: 10,
        // Only include trusted news sources
        includeDomains: [
          "reuters.com",
          "apnews.com",
          "bbc.com",
          "nytimes.com",
          "theguardian.com",
          "washingtonpost.com",
        ],
        // Last 30 days
        startPublishedDate: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        contents: {
          text: { maxCharacters: 3000 },
          summary: true,
        },
      }),
    },
    maxSteps: 3,
  });

  console.log("Question: Climate change policy developments");
  console.log("\nAnswer:", trustedNews);

  // ============================================================
  // Example 4: Financial news
  // ============================================================
  console.log("\n\n=== Example 4: Financial News ===\n");

  const { text: financeNews } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt:
      "What are the major stock market movements and financial news today?",
    tools: {
      webSearch: createExaWebSearchTool({
        category: "news",
        numResults: 10,
        // Focus on financial news sources
        includeDomains: [
          "bloomberg.com",
          "cnbc.com",
          "ft.com",
          "wsj.com",
          "marketwatch.com",
          "seekingalpha.com",
        ],
        // Include financial-related text
        includeText: ["stock", "market"],
        startPublishedDate: new Date(
          Date.now() - 1 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        contents: {
          text: { maxCharacters: 2500 },
          highlights: {
            numSentences: 2,
            highlightsPerUrl: 3,
          },
          // Get fresh financial data
          livecrawl: "always",
        },
      }),
    },
    maxSteps: 3,
  });

  console.log("Question: Stock market and financial news");
  console.log("\nAnswer:", financeNews);

  // ============================================================
  // Example 5: News excluding certain domains
  // ============================================================
  console.log("\n\n=== Example 5: Exclude Certain Sources ===\n");

  const { text: filteredNews } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "What are the latest developments in renewable energy?",
    tools: {
      webSearch: createExaWebSearchTool({
        category: "news",
        numResults: 10,
        // Exclude opinion-heavy or aggregator sites
        excludeDomains: [
          "reddit.com",
          "twitter.com",
          "facebook.com",
          "medium.com",
        ],
        // Exclude clickbait-style content
        excludeText: ["you won't believe", "shocking"],
        startPublishedDate: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        contents: {
          text: { maxCharacters: 2000 },
          summary: true,
        },
      }),
    },
    maxSteps: 3,
  });

  console.log("Question: Renewable energy developments (filtered sources)");
  console.log("\nAnswer:", filteredNews);

  // ============================================================
  // Example 6: Localized news
  // ============================================================
  console.log("\n\n=== Example 6: Location-Based News ===\n");

  const { text: localNews } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "What are the recent technology startup news from Europe?",
    tools: {
      webSearch: createExaWebSearchTool({
        category: "news",
        numResults: 10,
        // Focus search on a specific region
        userLocation: "DE", // Germany - helps get European results
        includeText: ["Europe", "European"],
        startPublishedDate: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        contents: {
          text: { maxCharacters: 2000 },
          highlights: true,
        },
      }),
    },
    maxSteps: 3,
  });

  console.log("Question: European tech startup news");
  console.log("\nAnswer:", localNews);
}

main().catch(console.error);
