import Link from "next/link";
import { Logo } from "@/components/Logo";
import { COMPANY, CONTACT_EMAIL, TERMS_VERSION } from "@/lib/legal";

export const metadata = { title: "Terms of Service — Peak State Labs" };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg mb-6">
          <Logo size={28} />
          <span className="font-display font-semibold">Peak State Labs</span>
        </Link>

        <article className="prose-content">
          <h1 className="font-display text-3xl font-semibold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-fg-subtle mt-1">Version {TERMS_VERSION}</p>

          <Section title="1. Who we are">
            <p>
              {COMPANY} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;Peak State&rdquo;) operates the
              client portal at portal.peakstate.shop (the &ldquo;Service&rdquo;) to help clients
              track peptide protocols, training, nutrition, and progress as part of a coaching
              relationship. By creating an account or using the Service, you agree to these Terms
              of Service.
            </p>
          </Section>

          <Section title="2. Eligibility">
            <p>
              You must be at least 18 years old and legally permitted to enter contracts in your
              jurisdiction. The Service is intended for adults who are working with Peak State as
              clients.
            </p>
          </Section>

          <Section title="3. Not medical advice">
            <p>
              <strong>The Service is for educational and self-tracking purposes only.</strong>{" "}
              Content, recommendations, AI-generated questions, dosing schedules, workout plans,
              nutrition targets, and any other information provided through the Service are not
              medical advice and are not a substitute for consultation with a qualified physician.
            </p>
            <p>
              Peptides referenced in the Service may not be approved for human use in your
              jurisdiction. You are solely responsible for determining the legality, safety, and
              appropriateness of any compound, protocol, training plan, or diet for your
              individual circumstances. Consult your physician before starting, stopping, or
              changing anything.
            </p>
            <p>
              In an emergency, call 911 or your local emergency number — do not rely on the
              Service.
            </p>
          </Section>

          <Section title="4. Your account">
            <p>
              Your coach creates your account and provides initial credentials. You must change
              your password on first login and keep it confidential. You are responsible for
              activity under your account. Notify us promptly at {CONTACT_EMAIL} if you suspect
              unauthorized access.
            </p>
          </Section>

          <Section title="5. Acceptable use">
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the Service for anything other than your own personal coaching and tracking;</li>
              <li>Share your account, resell access, or scrape data;</li>
              <li>Attempt to break, probe, or circumvent the Service&apos;s security;</li>
              <li>Upload illegal content, harassing content, or anyone else&apos;s photos without their consent;</li>
              <li>Use the Service in violation of any applicable law.</li>
            </ul>
          </Section>

          <Section title="6. AI-generated content">
            <p>
              The Service uses Anthropic Claude to generate check-in questions, meal estimates,
              workout plans, and coaching responses based on data you provide. AI output can be
              wrong. Treat it as a starting point you review with your coach, not as medical or
              nutritional truth.
            </p>
          </Section>

          <Section title="7. Community features">
            <p>
              Posts, comments, reactions, and progress photos you choose to share to the community
              feed are visible to other authenticated clients. Don&apos;t post anything you
              wouldn&apos;t want them to see. We may remove content that violates these Terms.
            </p>
          </Section>

          <Section title="8. Subscription and payment">
            <p>
              Coaching fees and subscription terms are agreed separately with your coach. The
              Service itself does not currently process payments through this portal.
            </p>
          </Section>

          <Section title="9. Termination">
            <p>
              You may stop using the Service at any time by asking your coach to deactivate your
              account or by emailing {CONTACT_EMAIL}. We may suspend or terminate access for
              violations of these Terms or for any reason on reasonable notice.
            </p>
          </Section>

          <Section title="10. No warranties">
            <p>
              The Service is provided &ldquo;as is&rdquo; without warranties of any kind, express
              or implied, including fitness for a particular purpose, accuracy, or
              non-infringement.
            </p>
          </Section>

          <Section title="11. Limitation of liability">
            <p>
              To the maximum extent permitted by law, {COMPANY} and its operators are not liable
              for any indirect, incidental, consequential, or special damages arising from your
              use of the Service. Our aggregate liability for any direct damages is limited to
              the amount you paid us in the 12 months preceding the claim, or USD $100,
              whichever is greater.
            </p>
          </Section>

          <Section title="12. Changes">
            <p>
              We may update these Terms from time to time. Material changes are signaled by a new
              version number and you&apos;ll be prompted to re-accept at next login.
            </p>
          </Section>

          <Section title="13. Governing law">
            <p>
              These Terms are governed by the laws of the United States and the state in which
              {" "}{COMPANY} is established, without regard to conflict-of-laws principles.
            </p>
          </Section>

          <Section title="14. Contact">
            <p>
              Questions? Email{" "}
              <a className="text-accent hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>.
            </p>
          </Section>

          <p className="mt-10 text-sm">
            <Link href="/privacy" className="text-accent hover:underline">
              See our Privacy Policy →
            </Link>
          </p>
        </article>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-2 space-y-3 text-sm text-fg-muted leading-relaxed">{children}</div>
    </section>
  );
}
