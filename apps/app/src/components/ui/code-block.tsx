"use client";

import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
  accent?: boolean;
  className?: string;
}

function highlightCode(code: string): string {
  let highlighted = code;

  // Comments
  highlighted = highlighted.replace(
    /(\/\/.*$)/gm,
    '<span class="text-gray-500 italic">$1</span>',
  );

  // Strings (double-quoted and single-quoted, backtick)
  highlighted = highlighted.replace(
    /(&quot;[^&]*?&quot;|"[^"]*?"|'[^']*?'|`[^`]*?`)/g,
    '<span class="text-gray-400">$1</span>',
  );

  // Keywords
  highlighted = highlighted.replace(
    /\b(import|from|export|const|let|var|async|await|function|return|type|interface|new|for|of|if|else)\b/g,
    '<span class="text-accent">$1</span>',
  );

  // Types and decorators
  highlighted = highlighted.replace(
    /\b([A-Z][a-zA-Z0-9]*)\b/g,
    '<span class="text-accent-light">$1</span>',
  );

  return highlighted;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function CodeBlock({
  code,
  filename,
  language = "typescript",
  accent = true,
  className = "",
}: CodeBlockProps) {
  const { copied, copy } = useCopyToClipboard();

  const escaped = escapeHtml(code);
  const highlighted = highlightCode(escaped);

  return (
    <div
      className={`bg-gray-950 ${accent ? "border-l-4 border-l-accent" : ""} border-brutal overflow-hidden ${className}`}
    >
      {/* Top bar */}
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center gap-3">
            {filename && (
              <span className="text-sm font-mono text-gray-400">
                {filename}
              </span>
            )}
            {language && !filename && (
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                {language}
              </span>
            )}
          </div>
          <button
            onClick={() => copy(code)}
            className="p-1.5 text-gray-500 hover:text-accent transition-colors cursor-pointer"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-accent" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed text-gray-200">
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      </div>
    </div>
  );
}
