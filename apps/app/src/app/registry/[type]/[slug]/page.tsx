import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { registryItems } from "@/data/registry";
import { RegistryDetailContent } from "@/components/registry/registry-detail-content";

interface PageProps {
  params: Promise<{ type: string; slug: string }>;
}

export async function generateStaticParams() {
  return registryItems
    .filter((item) => item.status === "available")
    .map((item) => ({
      type: item.type + "s",
      slug: item.slug,
    }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { type, slug } = await params;
  const singularType = type.replace(/s$/, "");
  const item = registryItems.find(
    (i) => i.type === singularType && i.slug === slug,
  );

  if (!item) {
    return { title: "Not Found | better-registry" };
  }

  return {
    title: `${item.name} — ${item.type} | better-registry`,
    description: item.description,
    openGraph: {
      title: `${item.name} — ${item.type} | better-registry`,
      description: item.description,
    },
  };
}

export default async function RegistryDetailPage({ params }: PageProps) {
  const { type, slug } = await params;
  const singularType = type.replace(/s$/, "");
  const item = registryItems.find(
    (i) => i.type === singularType && i.slug === slug,
  );

  if (!item || item.status !== "available") {
    notFound();
  }

  return <RegistryDetailContent item={item} />;
}
