import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteCopy } from "@/content/siteCopy";
import { DisclaimerModal } from "@/app/components/DisclaimerModal";
import { FloatingCTA } from "@/app/components/FloatingCTA";
import { PostHogInit } from "@/app/components/PostHogInit";
import { IdentityFromUrl } from "@/app/components/IdentityFromUrl";
import { GlobalSaleBar } from "@/app/components/SaleUrgency";
import { headers } from "next/headers";
import { getSaleStatus } from "@/app/lib/salePhaseServer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  fallback: ["ui-monospace", "SFMono-Regular", "SF Mono", "Menlo", "Consolas", "monospace"],
});

export const metadata: Metadata = {
  title: `${siteCopy.brand.trademark} — ${siteCopy.brand.tagline}`,
  description: siteCopy.hero.subheadline,
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // During the sale every page uses the dark sale theme (not the separate
  // Structured Peptides site served from its own domain).
  const host = (await headers()).get("host") ?? "";
  const dark = (await getSaleStatus()).live && !host.includes("structuredpeptides");
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
          }}
        />
        <script async src="https://r.wdfl.co/rw.js" data-rewardful="e13aa2" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${dark ? "bf-dark" : ""}`}
      >
        <PostHogInit />
        <IdentityFromUrl />
        <DisclaimerModal />
        <GlobalSaleBar />
        {children}
        <FloatingCTA />
      </body>
    </html>
  );
}
