import { PlaygroundShell } from "@/components/playground/playground-shell";

export default function PlaygroundPage() {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold tracking-tight">
            AI Registry Playground
          </h1>
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">
            v0.1.0
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <a
            href="https://github.com/endalk200/ai-registry"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="/docs"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </a>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <PlaygroundShell />
      </main>
    </div>
  );
}
