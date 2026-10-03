import Link from "next/link";
import type { Metadata } from "next";
import { LegalContact, LegalPage } from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "SMS Terms — Peak State Labs",
  description:
    "Terms for the Peak State Labs post-purchase SMS support program.",
};

export default function SmsTermsPage() {
  return (
    <LegalPage
      badge="POLICIES"
      title="SMS Terms"
      intro="Terms for the Peak State Labs post-purchase SMS support program."
      updated="October 3, 2026"
    >
      <h2>The Program</h2>
      <p>
        Peak State Labs sends post-purchase text messages to customers who opt
        in to support by text. Messages may include:
      </p>
      <ul>
        <li>Product instructions</li>
        <li>Order-related check-ins</li>
        <li>Delivery and support follow-up</li>
        <li>Customer support and replies to your questions</li>
      </ul>
      <p>This program is for customer support only.</p>

      <h2>How You Opt In</h2>
      <p>
        After you place an order, you can opt in by tapping &ldquo;Yes —
        Text Me Support&rdquo; on your order confirmation page. We text the
        mobile number you provided at checkout (or the number you enter on
        that page).
      </p>
      <p>
        <strong>Consent is not a condition of purchase.</strong> You do not
        need to opt in to buy from us or to receive your order.
      </p>

      <h2>Message Frequency and Rates</h2>
      <ul>
        <li>Message frequency varies.</li>
        <li>Message and data rates may apply.</li>
      </ul>

      <h2>Opting Out</h2>
      <p>
        Reply <strong>STOP</strong> to any message to opt out at any time.
        You will receive one final message confirming you have been
        unsubscribed, and no further messages after that.
      </p>

      <h2>Help</h2>
      <p>
        Reply <strong>HELP</strong> to any message for help, or contact our
        support team using the details below.
      </p>

      <h2>Carriers</h2>
      <p>Carriers are not liable for delayed or undelivered messages.</p>

      <h2>Privacy</h2>
      <p>
        Your mobile number and SMS opt-in information are not sold, rented, or
        shared with third parties or affiliates for marketing or promotional
        purposes. See our <Link href="/privacy">Privacy Policy</Link> for details.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. Changes take effect when
        posted on this page.
      </p>

      <h2>Customer Support</h2>
      <LegalContact />
    </LegalPage>
  );
}
