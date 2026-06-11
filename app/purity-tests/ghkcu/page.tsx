import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { siteCopy } from "@/content/siteCopy";

export const metadata: Metadata = {
  title: "GHK-Cu 50mg Purity Test — Peak State Labs",
  description:
    "Third-party purity test documentation for GHK-Cu 50mg by Peak State Labs.",
};

const IMAGES = [
  "/GHKCU%20Lab%20Report/1.png",
  "/GHKCU%20Lab%20Report/2.png",
];

export default function GHKCuPurityTestPage() {
  return (
    <div className="min-h-screen bg-[var(--muted)] text-[var(--primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
        <Container className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-bold text-lg">
            <img
              src="/logo.png"
              alt="Peak State Labs Logo"
              className="h-7 w-7 rounded-lg"
            />
            <span className="hidden sm:inline">{siteCopy.brand.name}</span>
          </a>
          <a
            href="/"
            className="text-sm font-medium text-[var(--primary)]/70 hover:text-[var(--primary)] transition-colors"
          >
            ← Back to POWER CUT™
          </a>
        </Container>
      </header>

      <main className="py-10 sm:py-14">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Title block */}
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-xs sm:text-sm font-bold tracking-wider text-[var(--accent-dark)] uppercase">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                <span>Purity Test · Verified</span>
              </div>
              <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight">
                GHK-Cu 50mg Lab Report
              </h1>
              <p className="mt-3 text-base sm:text-lg text-[var(--primary)]/70 max-w-2xl mx-auto leading-relaxed">
                Third-party purity documentation for GHK-Cu 50mg. Both pages are
                displayed below.
              </p>
            </div>

            {/* Side-by-side images */}
            <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
              {IMAGES.map((src, i) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-3xl bg-white border border-[var(--border)] shadow-sm overflow-hidden card-hover"
                >
                  <div className="p-3 sm:p-4 bg-white">
                    <img
                      src={src}
                      alt={`GHK-Cu 50mg Purity Test page ${i + 1}`}
                      className="w-full h-auto rounded-xl"
                    />
                  </div>
                  <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--muted)]/60 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)]">
                        Page {i + 1} of {IMAGES.length}
                      </p>
                      <p className="text-sm font-semibold text-[var(--primary)] mt-0.5">
                        GHK-Cu 50mg
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]/60 group-hover:text-[var(--accent-dark)] transition-colors">
                      Open full size
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <p className="mt-10 text-center text-xs text-[var(--primary)]/50">
              Documentation provided for research purposes only. Not for human
              consumption.
            </p>
          </div>
        </Container>
      </main>
    </div>
  );
}
