import "server-only";

import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import {
  createRetrievalAgent,
  RetrievalAgentPresets,
  type RetrievalAgentConfig,
} from "@ai-registry/retrieval-agent";
import type { ToolLoopAgent } from "ai";

// Helper to cast the openai model to the expected type
// This is needed due to version differences between @ai-sdk/openai and ai package
function getModel(modelName: string): RetrievalAgentConfig["model"] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return openai(modelName) as any;
}

/**
 * Input schema for running an agent - shared across all agents
 */
export const agentInputSchema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .describe("The query or prompt to send to the agent"),
  context: z
    .string()
    .optional()
    .describe("Optional additional context for the agent"),
});

export type AgentInput = z.infer<typeof agentInputSchema>;

/**
 * Agent definition type for the registry
 */
export interface AgentDefinition {
  /** Unique identifier for the agent */
  id: string;
  /** Display name */
  name: string;
  /** Short description of what the agent does */
  description: string;
  /** Category/group for the agent */
  category: string;
  /** The model being used */
  model: string;
  /** Tags for filtering */
  tags: string[];
  /** Input schema for the run form */
  inputSchema: z.ZodObject<z.ZodRawShape>;
  /** Factory function to create the agent (server-only) */
  createAgent: () => ToolLoopAgent<unknown>;
}

/**
 * Agent registry - add new agents here
 *
 * To add a new agent:
 * 1. Import the agent factory from its package
 * 2. Add a new entry to this array with:
 *    - Unique id (e.g., "my-agent.variant")
 *    - Display name and description
 *    - Category and tags for organization
 *    - Model name for display
 *    - Input schema (use agentInputSchema or extend it)
 *    - createAgent factory function
 */
export const agentRegistry: AgentDefinition[] = [
  // ============================================
  // RETRIEVAL AGENTS
  // ============================================
  {
    id: "retrieval.research",
    name: "Research Agent",
    description:
      "General-purpose research with comprehensive web sources. Returns markdown-formatted responses with citations.",
    category: "Retrieval",
    model: "gpt-4o",
    tags: ["research", "web-search", "markdown"],
    inputSchema: agentInputSchema,
    createAgent: () => RetrievalAgentPresets.research(getModel("gpt-4o")),
  },
  {
    id: "retrieval.academic",
    name: "Academic Research Agent",
    description:
      "Focused on peer-reviewed sources and scientific publications. Returns structured JSON with sources and confidence levels.",
    category: "Retrieval",
    model: "gpt-4o",
    tags: ["academic", "research", "structured", "scientific"],
    inputSchema: agentInputSchema,
    createAgent: () => RetrievalAgentPresets.academic(getModel("gpt-4o")),
  },
  {
    id: "retrieval.news",
    name: "News Agent",
    description:
      "Current events and news from reputable sources. Focuses on articles from the last 7 days.",
    category: "Retrieval",
    model: "gpt-4o",
    tags: ["news", "current-events", "markdown"],
    inputSchema: agentInputSchema,
    createAgent: () => RetrievalAgentPresets.news(getModel("gpt-4o")),
  },
  {
    id: "retrieval.technical",
    name: "Technical Documentation Agent",
    description:
      "Searches official documentation, GitHub, and Stack Overflow. Optimized for technical queries and code examples.",
    category: "Retrieval",
    model: "gpt-4o",
    tags: ["technical", "documentation", "code", "markdown"],
    inputSchema: agentInputSchema,
    createAgent: () => RetrievalAgentPresets.technical(getModel("gpt-4o")),
  },
  {
    id: "retrieval.custom",
    name: "Custom Retrieval Agent",
    description:
      "A basic retrieval agent with default settings. Good starting point for custom configurations.",
    category: "Retrieval",
    model: "gpt-4o-mini",
    tags: ["retrieval", "web-search", "basic"],
    inputSchema: agentInputSchema,
    createAgent: () =>
      createRetrievalAgent({
        model: getModel("gpt-4o-mini"),
        outputFormat: "markdown",
        temperature: 0.3,
        stopCondition: { maxSteps: 5 },
      }),
  },
];

/**
 * Get an agent definition by ID
 */
export function getAgentById(id: string): AgentDefinition | undefined {
  return agentRegistry.find((agent) => agent.id === id);
}

/**
 * Get all agent definitions grouped by category
 */
export function getAgentsByCategory(): Record<string, AgentDefinition[]> {
  return agentRegistry.reduce<Record<string, AgentDefinition[]>>(
    (acc, agent) => {
      const category = agent.category;
      const existing = acc[category];
      if (existing) {
        existing.push(agent);
      } else {
        acc[category] = [agent];
      }
      return acc;
    },
    {}
  );
}

/**
 * Get agent metadata for client-side display (without the createAgent function)
 */
export type AgentMetadata = Omit<
  AgentDefinition,
  "createAgent" | "inputSchema"
> & {
  inputSchemaShape: Record<
    string,
    { type: string; description?: string; optional?: boolean }
  >;
};

export function getAgentMetadataList(): AgentMetadata[] {
  return agentRegistry.map(({ createAgent, inputSchema, ...rest }) => ({
    ...rest,
    inputSchemaShape: Object.fromEntries(
      Object.entries(inputSchema.shape).map(([key, value]) => {
        const zodValue = value as z.ZodTypeAny;
        const isOptional = zodValue.isOptional();
        const innerType = isOptional
          ? (zodValue as z.ZodOptional<z.ZodTypeAny>)._def.innerType
          : zodValue;
        return [
          key,
          {
            type:
              innerType._def.typeName === "ZodString" ? "string" : "unknown",
            description: innerType._def.description,
            optional: isOptional,
          },
        ];
      })
    ),
  }));
}
