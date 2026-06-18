import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Metabolic Type Quiz — Peak State Labs" };

export default function QuizPage() {
  return (
    <>
      <Link href="/nutrition" className="text-sm text-fg-muted hover:text-fg">← Nutrition</Link>
      <PageHeader
        title="Metabolic Type Quiz"
        description="Tunes your macros, meal plan, and coach answers to how your body burns fuel."
      />
      <section className="card">
        <div className="chip-accent text-[10px] mb-2 inline-block">Coming soon</div>
        <h3 className="font-semibold mb-2">Quiz is being wired in</h3>
        <p className="text-sm text-fg-muted leading-relaxed">
          Drew is finalizing the Peak State metabolic type questions and per-type guidance.
          Once shared, the quiz will live here and your result will personalize the
          AI meal plan and coach responses across the portal.
        </p>
        <Link href="/nutrition" className="btn-primary text-sm mt-4 inline-block">
          Back to Nutrition
        </Link>
      </section>
    </>
  );
}
