export interface CodeExample {
  title: string;
  language: string;
  filename: string;
  sdk: "ai-sdk" | "tanstack-ai" | "core";
  code: string;
}

export interface ApiProp {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface ConfigOption {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export type RegistryIconName =
  | "search"
  | "globe"
  | "terminal"
  | "monitor"
  | "mail"
  | "bot"
  | "code"
  | "layers";

export interface RegistryItem {
  slug: string;
  name: string;
  packageName: string;
  type: "tool" | "agent";
  status: "available" | "coming-soon";
  description: string;
  longDescription: string;
  icon: RegistryIconName;
  tags: string[];
  installCommand: string;
  sdkSupport: ("ai-sdk" | "tanstack-ai")[];
  version?: string;
  features: string[];
  quickStart: CodeExample[];
  apiReference: ApiProp[];
  configuration?: ConfigOption[];
  relatedItems?: string[];
}
