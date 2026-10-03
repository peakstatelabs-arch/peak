import Link from "next/link";
import type { Metadata } from "next";
import { LEGAL_ENTITY, LegalContact, LegalPage } from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Peak State Labs",
  description:
    "How Peak State Labs collects, uses, and protects customer information, including mobile numbers and SMS opt-in information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      badge="POLICIES"
      title="Privacy Policy"
      intro="What information we collect, how we use it, and how we protect it."
      updated="October 3, 2026"
    >
      <p>
        This Privacy Policy explains how {LEGAL_ENTITY.name} (&ldquo;Peak State
        Labs,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) handles information
        when you visit our website, place an order, or join our post-purchase
        SMS support program.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>
          <strong>Order information:</strong> your name, email address, phone
          number, and shipping and billing address when you check out.
          Payments are processed by Stripe or PayPal; we do not see or store
          your full card number.
        </li>
        <li>
          <strong>Information you submit:</strong> details you enter in forms
          on our site, such as your name, email address, phone number, or
          (for creator applications) social media handles and answers.
        </li>
        <li>
          <strong>SMS opt-in information:</strong> if you opt in to text
          support, your mobile number, the date and time you opted in, the
          page you opted in from, and the consent language you agreed to.
        </li>
        <li>
          <strong>Device and usage information:</strong> your IP address,
          browser type, and the pages you view, collected through cookies and
          analytics tools.
        </li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process, ship, and deliver your order.</li>
        <li>To send order confirmations and shipping updates.</li>
        <li>To answer your questions and provide customer support.</li>
        <li>
          To send post-purchase support text messages, only if you opt in
          (see our <Link href="/sms-terms">SMS Terms</Link>).
        </li>
        <li>To send emails you have signed up for.</li>
        <li>To keep our site secure, prevent fraud, and improve how it works.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>SMS and Mobile Information</h2>
      <p>
        We use your mobile number and SMS opt-in information only to send the
        post-purchase support messages described in our{" "}
        <Link href="/sms-terms">SMS Terms</Link> and to respond to your replies.
      </p>
      <p className="font-semibold text-[var(--primary)]">
        Mobile phone numbers and SMS opt-in information are not sold, rented,
        or shared with third parties or affiliates for marketing or
        promotional purposes.
      </p>
      <p>
        Text messaging originator opt-in data and consent will not be shared
        with any third parties, except the SMS service provider we use to
        deliver our messages (TextMagic), which may use it only to deliver
        those messages on our behalf.
      </p>

      <h2>How We Share Information</h2>
      <p>
        We do not sell your personal information. We share it only with
        service providers that help us run our business, and only as needed
        for them to do so:
      </p>
      <ul>
        <li>Payment processors (Stripe, PayPal)</li>
        <li>Shipping carriers, to deliver your order</li>
        <li>Website hosting and analytics providers</li>
        <li>
          Tools we use to store records and send email and text messages
        </li>
      </ul>
      <p>
        We may also disclose information when required by law or to protect
        our rights, our customers, or others.
      </p>

      <h2>Cookies and Analytics</h2>
      <p>
        Our site uses cookies and similar technologies to remember your
        preferences and to understand how visitors use the site. You can block
        or delete cookies in your browser settings; some features may not
        work as intended without them.
      </p>

      <h2>Data Retention and Security</h2>
      <p>
        We keep your information only as long as needed for the purposes
        above, or as required by law. We use reasonable safeguards to protect
        it, but no method of transmission or storage is completely secure.
      </p>

      <h2>Your Choices</h2>
      <ul>
        <li>
          <strong>Text messages:</strong> reply STOP to any message to opt
          out.
        </li>
        <li>
          <strong>Email:</strong> use the unsubscribe link in any email.
        </li>
        <li>
          <strong>Access or deletion:</strong> email us to request a copy of,
          correction to, or deletion of your personal information.
        </li>
      </ul>

      <h2>Children&rsquo;s Privacy</h2>
      <p>
        Our site and products are not intended for anyone under 18, and we do
        not knowingly collect information from children.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Changes take effect when
        posted on this page, with the date above updated.
      </p>

      <h2>Contact Us</h2>
      <p>Questions about this policy or your information? Contact us:</p>
      <LegalContact />
    </LegalPage>
  );
}
