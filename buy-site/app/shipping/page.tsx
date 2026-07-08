import type { Metadata } from "next";
import { PolicyPage } from "@/app/components/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping Policy — Peak State Skincare",
  description: "Shipping Policy for Peak State Skincare.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      intro="What to expect once your order is placed."
      updated="July 8, 2026"
    >
      <h2>Processing Time</h2>
      <p>
        Orders are processed within 1–2 business days of purchase. Orders
        placed on weekends or holidays are processed the next business day.
      </p>

      <h2>Shipping Cost</h2>
      <p>We offer free shipping on all orders, with no minimum required.</p>

      <h2>Delivery Estimates</h2>
      <p>
        Once shipped, most orders arrive within 3–7 business days. We
        currently ship worldwide; international orders may take longer to
        arrive depending on destination and customs processing. Any customs
        fees, import duties, or taxes applied by your country are the
        responsibility of the customer.
      </p>

      <h2>Order Tracking</h2>
      <p>
        You&rsquo;ll receive a confirmation email with tracking information as
        soon as your order ships.
      </p>

      <h2>Questions</h2>
      <p>
        If your order hasn&rsquo;t arrived within the estimated window, or you
        have any other shipping questions, email us at{" "}
        <a href="mailto:paigespierce@gmail.com">paigespierce@gmail.com</a> and
        we&rsquo;ll look into it.
      </p>
    </PolicyPage>
  );
}
