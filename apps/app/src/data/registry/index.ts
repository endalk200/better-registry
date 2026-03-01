import { exaSearch } from "./tools/exa-search";
import {
  firecrawlScrape,
  tavilySearch,
  e2bSandbox,
  browserbaseBrowse,
  resendEmail,
} from "./tools/coming-soon";
import {
  researchAgent,
  codingAgent,
  dataAgent,
} from "./agents/coming-soon";
import type { RegistryItem } from "./types";

export type {
  RegistryItem,
  RegistryIconName,
  CodeExample,
  ApiProp,
  ConfigOption,
} from "./types";

export const registryItems: RegistryItem[] = [
  exaSearch,
  firecrawlScrape,
  tavilySearch,
  e2bSandbox,
  browserbaseBrowse,
  resendEmail,
  researchAgent,
  codingAgent,
  dataAgent,
];

export function getRegistryItem(
  type: string,
  slug: string,
): RegistryItem | undefined {
  return registryItems.find(
    (item) =>
      (item.type === type || item.type + "s" === type) &&
      item.slug === slug,
  );
}

export function getItemBySlug(slug: string): RegistryItem | undefined {
  return registryItems.find((item) => item.slug === slug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const item of registryItems) {
    for (const tag of item.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}
