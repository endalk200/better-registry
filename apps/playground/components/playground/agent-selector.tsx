"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AgentMetadata } from "@/lib/agent-types";
import {
  Robot,
  MagnifyingGlass,
  Newspaper,
  Code,
  Flask,
  Atom,
  type IconProps,
} from "@phosphor-icons/react";

interface AgentSelectorProps {
  agents: AgentMetadata[];
  selectedAgent: AgentMetadata | null;
  onSelectAgent: (agent: AgentMetadata) => void;
}

type IconComponent = React.ComponentType<IconProps>;

const DefaultIcon: IconComponent = Robot;

const categoryIcons: Record<string, IconComponent> = {
  Retrieval: MagnifyingGlass,
};

const tagIcons: Record<string, IconComponent> = {
  research: Flask,
  academic: Atom,
  news: Newspaper,
  technical: Code,
  code: Code,
};

function getAgentIcon(agent: AgentMetadata): IconComponent {
  // Check tags first for more specific icons
  for (const tag of agent.tags) {
    const icon = tagIcons[tag];
    if (icon) {
      return icon;
    }
  }
  // Fall back to category icon or default
  return categoryIcons[agent.category] ?? DefaultIcon;
}

export function AgentSelector({
  agents,
  selectedAgent,
  onSelectAgent,
}: AgentSelectorProps) {
  // Group agents by category
  const agentsByCategory = agents.reduce<Record<string, AgentMetadata[]>>(
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
    {},
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">Agents</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select an agent to run
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {Object.entries(agentsByCategory).map(
            ([category, categoryAgents]) => {
              const CategoryIcon = categoryIcons[category] ?? DefaultIcon;
              return (
                <div key={category}>
                  <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <CategoryIcon className="size-3.5" />
                    {category}
                  </div>
                  <div className="space-y-1">
                    {categoryAgents.map((agent) => {
                      const AgentIcon = getAgentIcon(agent);
                      const isSelected = selectedAgent?.id === agent.id;
                      return (
                        <button
                          key={agent.id}
                          onClick={() => onSelectAgent(agent)}
                          className={cn(
                            "w-full text-left px-3 py-2.5 transition-colors",
                            "hover:bg-muted/50",
                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                            isSelected && "bg-muted ring-1 ring-primary/20",
                          )}
                        >
                          <div className="flex items-start gap-2.5">
                            <div
                              className={cn(
                                "mt-0.5 rounded-sm p-1.5",
                                isSelected
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              <AgentIcon className="size-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={cn(
                                    "text-xs font-medium truncate",
                                    isSelected && "text-primary",
                                  )}
                                >
                                  {agent.name}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 h-4 shrink-0"
                                >
                                  {agent.model}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                                {agent.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            },
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
