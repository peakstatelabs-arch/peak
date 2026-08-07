import type { Metadata } from "next";
import { TransitionGuide } from "./TransitionGuide";

export const metadata: Metadata = {
  title: "The Tirzepatide → Retatrutide Transition Guide — Peak State Labs",
  description:
    "A guided, step-by-step walkthrough for switching from Tirzepatide to Retatrutide with confidence. Understand the difference, follow the roadmap, know what to expect, and track what actually matters.",
};

export default function TransitionGuidePage() {
  return <TransitionGuide />;
}
