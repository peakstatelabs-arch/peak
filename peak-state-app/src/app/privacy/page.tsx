import Link from "next/link";
import { Logo } from "@/components/Logo";
import { COMPANY, CONTACT_EMAIL, TERMS_VERSION } from "@/lib/legal";

export const metadata = { title: "Privacy Policy — Peak State Labs" };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg mb-6">
          <Logo size={28} />
          <span className="font-display font-semibold">Peak State Labs</span>
        </Link>

        <article>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-fg-subtle mt-1">Version {TERMS_VERSION}</p>

          <p className="mt-6 text-sm text-fg-muted leading-relaxed">
            {COMPANY} takes the data you give us seriously. This policy explains what we collect,
            why, who else touches it, and what control you have. Plain English, no fluff.
          </p>

          <Section title="What we collect">
            <p>You give us, and we store:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Account info: name, email, password hash, role.</li>
              <li>Protocol and dosing data: the peptide schedules your coach assigns and the doses you log as taken.</li>
              <li>Training data: workout sessions, sets, reps, weights, PRs.</li>
              <li>Nutrition data: macro targets, meal logs (text + macros), AI-generated meal plans, metabolic type quiz responses.</li>
              <li>Body data: weight logs, optional body measurements, optional progress photos.</li>
              <li>Check-in data: AI-personalized weekly check-in questions and your answers, plus optional photos.</li>
              <li>Community content: posts, comments, reactions, optional shared photos.</li>
              <li>Device data needed for push notifications: a Web Push subscription endpoint and the device&apos;s user-agent string, only if you opt into reminders.</li>
              <li>Basic technical logs from hosting and database providers (IP, request timestamps), used to keep the Service running and secure.</li>
            </ul>
          </Section>

          <Section title="What we don&apos;t collect">
            <ul className="list-disc pl-6 space-y-1">
              <li>No payment info goes through the portal.</li>
              <li>No tracking cookies for advertising. No third-party ad networks.</li>
              <li>No location data beyond standard server-side IP logs.</li>
              <li>No health data shared with insurers, employers, or marketing partners — ever.</li>
            </ul>
          </Section>

          <Section title="Why we collect it">
            <ul className="list-disc pl-6 space-y-1">
              <li>To run the features you see (tracker, charts, AI suggestions, reminders).</li>
              <li>To let your coach support you (admin role can see your data inside the portal).</li>
              <li>To send you Web Push reminders if you opted in.</li>
              <li>To keep the Service secure and debug issues.</li>
            </ul>
          </Section>

          <Section title="Who else touches your data (sub-processors)">
            <p>We rely on a handful of vetted vendors. None of them sell data:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Supabase</strong> (US) — database, authentication, file storage for photos.</li>
              <li><strong>Vercel</strong> (US) — application hosting and edge delivery.</li>
              <li><strong>Anthropic</strong> (US) — Claude AI model that generates check-in questions, meal estimates, workout plans, and coaching responses. We send only the minimum context needed for each call. Per Anthropic&apos;s API policies, your data is not used to train their models.</li>
              <li><strong>Web Push services</strong> (Apple, Google, Mozilla) — relay the encrypted push payload to your device if you opt into reminders.</li>
              <li><strong>cron-job.org</strong> — triggers the reminder cron on schedule. They only know the URL they call, not your data.</li>
            </ul>
          </Section>

          <Section title="Photos">
            <p>
              Progress photos you upload to your weekly check-in are private — stored in a
              private Supabase Storage bucket scoped so only you and your coach (admin role) can
              read them. We use short-lived signed URLs to display them.
            </p>
            <p>
              Photos you choose to share to the community feed are visible to other
              authenticated clients. Their storage paths are unguessable but the photos
              themselves are not encrypted at rest in a way that prevents staff at our
              sub-processors from technically accessing them. Treat anything you post to
              community as visible to your fellow clients.
            </p>
          </Section>

          <Section title="How long we keep it">
            <p>
              As long as your account exists. If you ask us to delete your account, we remove
              your data within 30 days, except where retention is required by law.
            </p>
          </Section>

          <Section title="Your rights">
            <p>You can ask us to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Export your data (we&apos;ll send you a copy of everything stored under your account).</li>
              <li>Correct anything inaccurate.</li>
              <li>Delete your account and the data associated with it.</li>
              <li>Stop sending you push reminders (or just toggle them off in the app).</li>
            </ul>
            <p>
              Email{" "}
              <a className="text-accent hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>{" "}
              for any of the above. We&apos;ll respond within 30 days.
            </p>
          </Section>

          <Section title="Security">
            <p>
              All data in transit is encrypted (TLS). Row-level security policies on the
              database scope every read and write to either the owning user or admin role.
              Passwords are hashed by Supabase Auth. Push payloads are encrypted with VAPID.
              Despite our care, no system is 100% secure — if something goes wrong we&apos;ll
              tell you promptly.
            </p>
          </Section>

          <Section title="Children">
            <p>The Service is not for anyone under 18.</p>
          </Section>

          <Section title="Changes">
            <p>
              Material changes will bump the version number and you&apos;ll be re-prompted to
              accept at next login.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions?{" "}
              <a className="text-accent hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>.
            </p>
          </Section>

          <p className="mt-10 text-sm">
            <Link href="/terms" className="text-accent hover:underline">
              See our Terms of Service →
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
