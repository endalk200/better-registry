import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { createExaWebSearchTool } from "../dist/index.js";

async function main() {
  console.log("=== Example 1: Basic Search ===\n");

  const { text: basicResult, toolResults: basicToolResults } =
    await generateText({
      model: openai("gpt-5-chat-latest"),
      prompt: "What are the latest developments in quantum computing?",
      tools: {
        // Default configuration: uses EXA_API_KEY from env, returns 10 results
        webSearch: createExaWebSearchTool(),
      },
      stopWhen: stepCountIs(3),
    });

  console.log(
    "Question: What are the latest developments in quantum computing?",
  );
  console.log("\nAnswer:", basicResult);
  console.log("\nTool calls made:", basicToolResults?.length ?? 0);

  // ============================================================
  // Example 2: Configure number of results
  // ============================================================
  console.log("\n\n=== Example 2: Custom Number of Results ===\n");

  const { text: customResult } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "Find the top 3 most popular JavaScript frameworks in 2024",
    tools: {
      // Limit to 3 results for faster, more focused responses
      webSearch: createExaWebSearchTool({
        numResults: 3,
      }),
    },
    stopWhen: stepCountIs(3),
  });

  console.log("Question: Top 3 JavaScript frameworks in 2024");
  console.log("\nAnswer:", customResult);

  console.log("\n\n=== Example 3: Explicit API Key ===\n");

  // You can pass the API key directly instead of using env variables
  // This is useful for multi-tenant applications or testing
  const { text: explicitKeyResult } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "What is the current price of Bitcoin?",
    tools: {
      webSearch: createExaWebSearchTool({
        // Explicitly pass API key (defaults to process.env.EXA_API_KEY)
        apiKey: process.env.EXA_API_KEY,
        numResults: 5,
      }),
    },
    stopWhen: stepCountIs(3),
  });

  console.log("Question: Current Bitcoin price");
  console.log("\nAnswer:", explicitKeyResult);

  console.log("\n\n=== Example 4: Custom Tool Description ===\n");

  // Customize the tool description to guide the model's behavior
  const { text: customDescResult } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "What are the best practices for React performance optimization?",
    tools: {
      webSearch: createExaWebSearchTool(
        { numResults: 5 },
        // Custom description helps the model understand when to use this tool
        {
          description:
            "Search for technical documentation, blog posts, and tutorials about programming and software development.",
        },
      ),
    },
    stopWhen: stepCountIs(3),
  });

  console.log("Question: React performance optimization best practices");
  console.log("\nAnswer:", customDescResult);
}

main().catch(console.error);
