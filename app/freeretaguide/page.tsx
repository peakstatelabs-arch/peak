import type { Metadata } from "next";
import { RetaRoadmap } from "./RetaRoadmap";

export const metadata: Metadata = {
  title: "The 20-Pound Reta Roadmap — Peak State Labs",
  description:
    "The 4 phases of losing 20 pounds, and what should change as your body changes. Find your phase, run the Plateau Checklist, and track your weekly Scorecard.",
  robots: { index: false, follow: false },
};

export default function FreeRetaGuidePage() {
  return <RetaRoadmap />;
}
