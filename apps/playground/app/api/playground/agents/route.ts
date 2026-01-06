import { getAgentMetadataList } from "@/playground.agents";

export const runtime = "nodejs";

/**
 * GET /api/playground/agents
 * Returns the list of available agents with their metadata
 */
export async function GET() {
  const agents = getAgentMetadataList();
  return Response.json(agents);
}
