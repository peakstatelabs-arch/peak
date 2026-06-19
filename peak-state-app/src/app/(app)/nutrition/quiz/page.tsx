import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { QuizClient } from "./QuizClient";

export const metadata = { title: "Metabolic Type Quiz — Peak State Labs" };

export default function QuizPage() {
  return (
    <>
      <Link href="/nutrition" className="text-sm text-fg-muted hover:text-fg">← Nutrition</Link>
      <PageHeader
        title="Metabolic Type Quiz"
        description="Answer how you actually feel — not how you think you should eat. ~2 minutes."
      />
      <QuizClient />
    </>
  );
}
