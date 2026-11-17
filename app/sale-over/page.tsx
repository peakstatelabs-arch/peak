import type { Metadata } from "next";
import { SaleOverForm } from "./SaleOverForm";

export const metadata: Metadata = {
  title: "The Sale Is Over — Peak State Labs",
  description: "Get first access to our next members-only sale.",
  robots: { index: false },
};

// Served (via middleware) in place of every sale page once the sale ends.
export default function SaleOverPage() {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      <div className="mx-auto max-w-md px-4 py-16 sm:py-24 text-center">
        <img src="/logo.png" alt="Peak State Labs" className="mx-auto h-12 w-12 rounded-xl" />
        <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.25em] text-[var(--accent)]">
          Black Friday &amp; Cyber Monday
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">
          This sale is over.
        </h1>
        <p className="mt-4 text-lg text-white/75">
          But our next <strong className="text-white">members-only sale</strong>{" "}
          is coming soon — and it won&rsquo;t be announced publicly. Get on the
          list to be the first to know.
        </p>
        <div className="mt-8">
          <SaleOverForm />
        </div>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full page load so middleware serves the sale page */}
        <a
          href="/"
          className="mt-8 inline-block text-sm font-semibold text-white/60 underline underline-offset-4 hover:text-white"
        >
          Continue to the regular site →
        </a>
      </div>
    </div>
  );
}
