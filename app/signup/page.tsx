import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { siteCopy } from "@/content/siteCopy";
import { SignupLanding, type SignupReview } from "./SignupLanding";
import { reviews } from "@/content/reviews";

export const metadata: Metadata = {
  title: `Peak State Labs — Get 10% Off`,
  description:
    "Create a free account and get 10% off your order. Materials are supplied strictly for laboratory research and non-human use.",
  // Campaign landing page (ads, email, SMS) — keep it out of search results.
  robots: { index: false, follow: false },
};

// The one review on the page — shown as a card (text only, no screenshot).
const featured = reviews.find((r) => r.id === "anon-208");
const review: SignupReview | null = featured?.quote
  ? {
      name: featured.name,
      initial: featured.initial,
      quote: featured.quote,
      stats: featured.stats ?? [],
    }
  : null;

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--primary)]">
      <SignupLanding review={review} />

      {/* Footer */}
      <footer className="bg-[var(--primary)] text-white">
        <Container className="py-12">
          <div className="text-center pb-8 border-b border-white/10">
            <p className="text-sm text-white/60">
              {siteCopy.footer.productDisclaimer}
            </p>
          </div>
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
              &copy; {new Date().getFullYear()} {siteCopy.footer.copyrightName}.
              All rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
