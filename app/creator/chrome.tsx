import { Container } from "@/app/components/Container";
import { siteCopy } from "@/content/siteCopy";

/**
 * Minimal, standalone header for the Creator Program funnel. Most visitors land
 * here straight from TikTok, so we keep it distraction-free — just the brand.
 * The logo links back to the main store.
 */
export function CreatorHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
      <Container className="flex h-16 items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-[var(--primary)]"
        >
          <img
            src="/logo.png"
            alt="Peak State Labs Logo"
            className="h-7 w-7 rounded-lg"
          />
          <span>{siteCopy.brand.name}</span>
        </a>
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-dark)]">
          Creator Program
        </span>
      </Container>
    </header>
  );
}

export function CreatorFooter() {
  return (
    <footer className="bg-[var(--primary)] text-white">
      <Container className="py-12">
        <div className="py-8 border-b border-white/10">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 font-bold text-lg">
              <img
                src="/logo.png"
                alt="Peak State Labs Logo"
                className="h-7 w-7 rounded-lg"
              />
              <span>{siteCopy.brand.name}</span>
            </div>
          </div>
        </div>
        <div className="pt-8">
          <p className="text-xs text-white/50 leading-relaxed max-w-4xl mx-auto text-center">
            {siteCopy.footer.disclaimer}
          </p>
          <p className="text-xs text-white/40 text-center mt-6">
            &copy; {new Date().getFullYear()} {siteCopy.footer.copyrightName}. All
            rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
