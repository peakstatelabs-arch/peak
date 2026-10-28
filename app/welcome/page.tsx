import type { Metadata } from "next";
import { WelcomeQuiz } from "./WelcomeQuiz";

// Post-signup landing for the "test" arm of the welcome-quiz experiment (see
// app/lib/welcomeExperiment.ts). Only reachable from the signup success
// screens, so it stays out of search.
export const metadata: Metadata = {
  title: "Welcome — Peak State Labs",
  description: "One quick question so we can show you the right protocol.",
  robots: { index: false, follow: false },
};

export default function WelcomePage() {
  return <WelcomeQuiz />;
}
