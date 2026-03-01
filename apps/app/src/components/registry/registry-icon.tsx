import {
  Search,
  Globe,
  Terminal,
  Monitor,
  Mail,
  Bot,
  Code,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { RegistryIconName } from "@/data/registry/types";

const iconMap: Record<RegistryIconName, LucideIcon> = {
  search: Search,
  globe: Globe,
  terminal: Terminal,
  monitor: Monitor,
  mail: Mail,
  bot: Bot,
  code: Code,
  layers: Layers,
};

interface RegistryIconProps {
  name: RegistryIconName;
  className?: string;
}

export function RegistryIcon({ name, className }: RegistryIconProps) {
  const Icon = iconMap[name];
  return <Icon className={className} />;
}

export function getIcon(name: RegistryIconName): LucideIcon {
  return iconMap[name];
}
