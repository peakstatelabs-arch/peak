import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { ThankYouContent } from "./ThankYouContent";

export const metadata: Metadata = {
  title: "Thank You — Peak State Skincare",
  description: "Your Peak State Skincare order is confirmed.",
};

export default function ThankYouPage() {
  return (
    <div>
      <SiteHeader />
      <main>
        <section className="thank-you-section">
          <div className="container thank-you">
            <Suspense fallback={null}>
              <ThankYouContent />
            </Suspense>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
