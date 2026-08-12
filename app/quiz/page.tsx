import type { Metadata } from "next";
import { CartProvider } from "@/app/singles/cart/CartContext";
import { CartDrawer } from "@/app/singles/cart/CartDrawer";
import { QuizExperience } from "./QuizExperience";

export const metadata: Metadata = {
  title: "Find Your Protocol — Peak State Labs",
  description:
    "Answer a few quick questions and get a personalized peptide protocol built around your goals, experience and timeline.",
  robots: { index: false, follow: false },
};

export default function QuizPage() {
  // The results view reuses the singles cart (add-ons + drawer + Stripe
  // checkout), so the whole quiz lives under the CartProvider.
  return (
    <CartProvider>
      <QuizExperience />
      <CartDrawer />
    </CartProvider>
  );
}
