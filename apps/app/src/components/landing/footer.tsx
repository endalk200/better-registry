export function Footer() {
  return (
    <footer className="bg-white border-t-3 border-black py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top section: 4-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Column 1: Brand */}
          <div>
            <div className="text-base sm:text-lg">
              <span className="text-accent mr-1">■</span>
              <span className="font-sans">better</span>
              <span className="text-accent">-</span>
              <span className="font-black">registry</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">The shadcn for AI.</p>
            <p className="text-xs text-gray-400 mt-1">
              Open source. MIT license.
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3 sm:mb-4">
              Product
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="#tools"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Tools
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Agents
                <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 ml-2 border border-gray-200">
                  SOON
                </span>
              </a>
              <a
                href="/playground"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Playground
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Documentation
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                CLI Reference
              </a>
            </div>
          </div>

          {/* Column 3: Community */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3 sm:mb-4">
              Community
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com"
                className="text-sm text-gray-600 hover:text-black transition-colors inline-flex items-center gap-1.5"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Twitter / X
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Discord
                <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 ml-2 border border-gray-200">
                  SOON
                </span>
              </a>
            </div>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3 sm:mb-4">
              Legal
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                MIT License
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t-2 border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm font-mono text-gray-400">
            © 2025 better-registry
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-black flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="GitHub"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-black flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="Twitter"
            >
              <span className="font-bold text-sm">X</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
