import type { Metadata } from "next";
import { PolicyPage } from "@/app/components/PolicyPage";

export const metadata: Metadata = {
  title: "Return Policy — Peak State Skincare",
  description: "Return and refund policy for Peak State Skincare.",
};

export default function ReturnPolicyPage() {
  return (
    <PolicyPage
      title="Return Policy"
      intro="Please review this policy before placing an order."
      updated="July 8, 2026"
    >
      <h2>Unopened Products</h2>
      <p>
        Unopened, unused products may be returned within 14 days of delivery
        for a full refund. Please contact us before sending anything back so
        we can authorize the return.
      </p>

      <h2>Opened Products</h2>
      <p>
        Because these are cosmetic products, opened, used, or tampered items
        are final sale and not eligible for return, refund, or exchange.
      </p>

      <h2>Damaged or Defective Items</h2>
      <p>
        If your order arrives damaged or defective, contact us within 7 days
        of delivery and we&rsquo;ll arrange a replacement or refund at no cost
        to you.
      </p>

      <h2>Return Shipping</h2>
      <p>
        For approved returns of unopened products, the customer is
        responsible for return shipping costs unless the item was damaged,
        defective, or shipped in error.
      </p>

      <h2>Refunds</h2>
      <p>
        Once we receive and inspect your return, approved refunds are issued
        to your original payment method within 5–7 business days.
      </p>

      <h2>Contact</h2>
      <p>
        To start a return or ask a question, email{" "}
        <a href="mailto:paigespierce@gmail.com">paigespierce@gmail.com</a>.
      </p>
    </PolicyPage>
  );
}
