/**
 * Research Papers Search Example
 *
 * This example demonstrates how to configure the Exa web search tool
 * for academic and research paper searches. It shows how to:
 * - Use the "research paper" category to focus on academic content
 * - Filter by specific academic domains (arXiv, PubMed, etc.)
 * - Use neural search for semantic understanding
 * - Get highlights and summaries from papers
 *
 * Prerequisites:
 * - Set EXA_API_KEY environment variable
 * - Set OPENAI_API_KEY environment variable
 */

import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { createExaWebSearchTool } from "../dist/index.js";

async function main() {
  // ============================================================
  // Example 1: Research paper category search
  // ============================================================
  console.log("=== Example 1: Research Paper Category ===\n");

  const { text: paperResult } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt:
      "What are the latest research findings on transformer architectures in deep learning?",
    tools: {
      webSearch: createExaWebSearchTool({
        // Focus search on research papers specifically
        category: "research paper",
        // Neural search provides better semantic understanding for academic queries
        type: "neural",
        numResults: 10,
        contents: {
          // Get more text content from papers
          text: { maxCharacters: 5000 },
          // Get AI-generated summaries of each paper
          summary: true,
          // Extract key highlights from the content
          highlights: {
            numSentences: 3,
            highlightsPerUrl: 3,
          },
        },
      }),
    },
    stopWhen: stepCountIs(3),
  });

  console.log("Question: Latest research on transformer architectures");
  console.log("\nAnswer:", paperResult);

  // ============================================================
  // Example 2: Domain-filtered academic search
  // ============================================================
  console.log("\n\n=== Example 2: Academic Domains Filter ===\n");

  const { text: domainResult } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "Find recent papers on large language model alignment techniques",
    tools: {
      webSearch: createExaWebSearchTool({
        category: "research paper",
        type: "neural",
        numResults: 8,
        // Restrict to specific academic sources
        includeDomains: [
          "arxiv.org", // Preprints
          "openreview.net", // ML/AI conferences
          "proceedings.neurips.cc", // NeurIPS papers
          "aclanthology.org", // NLP papers
        ],
        contents: {
          text: { maxCharacters: 4000 },
          summary: true,
          highlights: true,
        },
      }),
    },
    stopWhen: stepCountIs(3),
  });

  console.log("Question: Papers on LLM alignment techniques");
  console.log("\nAnswer:", domainResult);

  // ============================================================
  // Example 3: Date-filtered research search
  // ============================================================
  console.log("\n\n=== Example 3: Recent Papers Only ===\n");

  // Calculate date 6 months ago for filtering
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { text: recentResult } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "What are the most recent advances in multimodal AI models?",
    tools: {
      webSearch: createExaWebSearchTool({
        category: "research paper",
        type: "neural",
        numResults: 10,
        // Only get papers published in the last 6 months
        startPublishedDate: sixMonthsAgo.toISOString(),
        contents: {
          text: { maxCharacters: 3000 },
          summary: true,
        },
      }),
    },
    stopWhen: stepCountIs(3),
  });

  console.log("Question: Recent advances in multimodal AI (last 6 months)");
  console.log("\nAnswer:", recentResult);

  // ============================================================
  // Example 4: Medical/Life Sciences research
  // ============================================================
  console.log("\n\n=== Example 4: Life Sciences Research ===\n");

  const { text: medicalResult } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt:
      "What are the recent breakthroughs in CRISPR gene editing for treating genetic diseases?",
    tools: {
      webSearch: createExaWebSearchTool({
        category: "research paper",
        type: "neural",
        numResults: 8,
        // Focus on medical/life sciences sources
        includeDomains: [
          "pubmed.ncbi.nlm.nih.gov",
          "nature.com",
          "cell.com",
          "science.org",
          "biorxiv.org",
        ],
        contents: {
          text: { maxCharacters: 4000 },
          summary: true,
          highlights: {
            numSentences: 2,
            highlightsPerUrl: 4,
            // Direct highlights to focus on findings
            query: "key findings and results",
          },
        },
      }),
    },
    stopWhen: stepCountIs(3),
  });

  console.log("Question: CRISPR breakthroughs for genetic diseases");
  console.log("\nAnswer:", medicalResult);

  // ============================================================
  // Example 5: Deep search for comprehensive research
  // ============================================================
  console.log("\n\n=== Example 5: Deep Search Mode ===\n");

  const { text: deepResult } = await generateText({
    model: openai("gpt-4o"),
    prompt:
      "Provide a comprehensive overview of current approaches to AI safety and alignment research",
    tools: {
      webSearch: createExaWebSearchTool({
        category: "research paper",
        // Deep search performs comprehensive analysis with query expansion
        type: "deep",
        numResults: 15,
        // Additional queries help expand the search scope
        additionalQueries: [
          "AI alignment research papers",
          "machine learning safety techniques",
          "RLHF reinforcement learning human feedback",
        ],
        contents: {
          text: { maxCharacters: 6000 },
          summary: true,
          highlights: {
            numSentences: 4,
            highlightsPerUrl: 5,
          },
        },
      }),
    },
    stopWhen: stepCountIs(5),
  });

  console.log("Question: Comprehensive overview of AI safety research");
  console.log("\nAnswer:", deepResult);
}

main().catch(console.error);
