import type { Metadata } from "next";
import { PolicyPage } from "@/app/components/PolicyPage";

export const metadata: Metadata = {
  title: "Terms of Service — Peak State Skincare",
  description: "Terms of Service for Peak State Skincare.",
};

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Service"
      intro="Please read these terms carefully before using this site or purchasing any products."
      updated="July 8, 2026"
    >
      <h2>Acceptance of Terms</h2>
      <p>
        By accessing this site or placing an order, you agree to be bound by
        these Terms of Service. If you do not agree, please do not use this
        site or purchase our products.
      </p>

      <h2>Eligibility</h2>
      <p>
        You must be at least 18 years old, or the age of majority in your
        jurisdiction, to make a purchase on this site.
      </p>

      <h2>Product Information &amp; Disclaimer</h2>
      <p>
        Our products are cosmetic skincare formulas. Statements about our
        products have not been evaluated by the Food and Drug Administration,
        and our products are not intended to diagnose, treat, cure, or
        prevent any disease. Individual results may vary. Nothing on this
        site should be taken as medical advice — consult a licensed
        healthcare professional with any questions about a skin condition or
        before starting a new skincare routine.
      </p>

      <h2>Orders &amp; Payment</h2>
      <p>
        We reserve the right to refuse or cancel any order for any reason,
        including suspected fraud, errors in pricing or product information,
        or issues with availability. Prices are subject to change without
        notice.
      </p>

      <h2>Shipping &amp; Returns</h2>
      <p>
        Orders are subject to our{" "}
        <a href="/shipping">Shipping Policy</a> and{" "}
        <a href="/returns">Return Policy</a>.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content on this site — including text, graphics, logos, and
        product names — is the property of Peak State Skincare and may not be
        used or reproduced without permission.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Peak State Skincare is not
        liable for any indirect, incidental, or consequential damages arising
        from your use of this site or our products.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these Terms of Service from time to time. Continued use
        of this site after changes are posted constitutes acceptance of the
        updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href="mailto:paigespierce@gmail.com">paigespierce@gmail.com</a>.
      </p>
    </PolicyPage>
  );
}
