import { createAgentUIStreamResponse, type Agent } from "ai";
import { getAgentById } from "@/playground.agents";

export const runtime = "nodejs";
export const maxDuration = 60;

function generateMessageId(fallbackSuffix: string): string {
  // `crypto.randomUUID` is available in Node.js runtimes, but keep a safe fallback.
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // ignore
  }

  return `msg_${Date.now()}_${fallbackSuffix}`;
}

/**
 * The playground UI may send different message shapes depending on AI SDK version.
 * `createAgentUIStreamResponse` expects "UI messages" that always include `id: string`.
 */
function normalizeUIMessages(messages: unknown) {
  if (!Array.isArray(messages)) return [];

  return messages.map((m, idx) => {
    const msg = (m ?? {}) as Record<string, unknown>;

    const id =
      typeof msg.id === "string" ? msg.id : generateMessageId(String(idx));

    const role = typeof msg.role === "string" ? msg.role : "user";

    const parts = Array.isArray(msg.parts)
      ? msg.parts
      : typeof msg.content === "string" && msg.content.length > 0
        ? [{ type: "text", text: msg.content }]
        : [];

    const content =
      typeof msg.content === "string"
        ? msg.content
        : Array.isArray(parts)
          ? parts
              .filter(
                (p): p is { type: "text"; text: string } =>
                  Boolean(p) &&
                  typeof p === "object" &&
                  (p as { type?: unknown }).type === "text" &&
                  typeof (p as { text?: unknown }).text === "string"
              )
              .map((p) => p.text)
              .join("")
          : "";

    return {
      ...msg,
      id,
      role,
      content,
      parts,
    };
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const { messages } = await request.json();
    const uiMessages = normalizeUIMessages(messages);

    // Find the agent in the registry
    const agentDef = getAgentById(agentId);

    if (!agentDef) {
      return new Response(
        JSON.stringify({ error: `Agent not found: ${agentId}` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create the agent instance
    const agent = agentDef.createAgent();

    // Return the agent UI stream response, attaching v6 usage + finish reason info
    // as message metadata (called on start + finish events).
    return await createAgentUIStreamResponse({
      agent: agent as unknown as Agent,
      uiMessages,
      messageMetadata: ({ part }) => {
        if (part.type === "finish") {
          return {
            usage: part.totalUsage,
            finishReason: part.finishReason,
            rawFinishReason: part.rawFinishReason,
          };
        }
      },
    });
  } catch (error) {
    console.error("Agent execution error:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
