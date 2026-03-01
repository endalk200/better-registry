import { Suspense } from "react";
import { RegistryCatalog } from "@/components/registry/registry-catalog";

export default function RegistryPage() {
  return (
    <Suspense>
      <RegistryCatalog />
    </Suspense>
  );
}
