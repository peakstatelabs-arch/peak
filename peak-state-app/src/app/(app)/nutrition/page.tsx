import { PageHeader } from "@/components/PageHeader";
import { NutritionClient } from "./Client";

export const metadata = { title: "Nutrition — Peak State Labs" };

export default function NutritionPage() {
  return (
    <>
      <PageHeader title="Nutrition" description="Macros, meal plans, and peptide synergy tips." />
      <NutritionClient />
    </>
  );
}
