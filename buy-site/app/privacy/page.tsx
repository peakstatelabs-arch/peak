import type { Metadata } from "next";
import { PolicyPage } from "@/app/components/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Peak State Skincare",
  description: "Privacy Policy for Peak State Skincare.",
};

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="How we handle information on this site."
      updated="July 8, 2026"
    >
      <h2>Information We Collect</h2>
      <p>
        This site does not currently use analytics, tracking cookies, or
        email sign-up forms, and we do not collect personal information from
        visitors browsing the site. Our hosting provider automatically
        processes standard technical information (such as IP address and
        browser type) to serve the site securely, as is standard for any
        website.
      </p>

      <h2>Orders &amp; Checkout</h2>
      <p>
        Online checkout is not yet available on this site. Once checkout
        launches, this policy will be updated to describe what order
        information (such as name, shipping address, and payment details) is
        collected and how it is used and protected, including any third-party
        payment processor involved.
      </p>

      <h2>Children&rsquo;s Privacy</h2>
      <p>
        This site is not directed at children, and we do not knowingly
        collect information from anyone under the age of 13.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy as new features — such as checkout,
        accounts, or marketing communications — are added to this site.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href="mailto:paigespierce@gmail.com">paigespierce@gmail.com</a>.
      </p>
    </PolicyPage>
  );
}
