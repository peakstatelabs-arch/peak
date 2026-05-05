import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";

export const metadata: Metadata = {
  title: "BPC-157 + TB-500 (Wolverine Stack) — Research Overview | Peak State Labs",
  description:
    "Independent research overview of the BPC-157 + TB-500 blend (the Wolverine Stack): a cytoprotective pentadecapeptide paired with a thymosin β4 fragment. Mechanism, half-life, reported research dosing, and reconstitution — for laboratory and educational use only.",
  alternates: { canonical: "/bpcblend" },
};

const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "mechanism", label: "Mechanism of Action" },
  { id: "pharmacokinetics", label: "Pharmacokinetics" },
  { id: "benefits", label: "Reported Benefits" },
  { id: "what-to-expect", label: "What to Expect" },
  { id: "dosing", label: "Reported Research Dosing" },
  { id: "reconstitution", label: "Reconstitution & Storage" },
  { id: "side-effects", label: "Reported Adverse Events" },
  { id: "comparisons", label: "Comparisons" },
  { id: "references", label: "References" },
];

export default function BpcBlendPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--primary)]">
      {/* Header — links back to main site */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
        <Container className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-bold text-lg">
            <img
              src="/logo.png"
              alt="Peak State Labs Logo"
              className="h-7 w-7 rounded-lg"
            />
            <span className="hidden sm:inline">{siteCopy.brand.name}</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--primary)]/70">
            <a href="/#contents" className="font-medium hover:text-[var(--primary)] transition-colors">
              The Stack
            </a>
            <a href="/#pricing" className="font-medium hover:text-[var(--primary)] transition-colors">
              Pricing
            </a>
            <a href="/#faq" className="font-medium hover:text-[var(--primary)] transition-colors">
              FAQ
            </a>
          </nav>
          <a
            href="/#pricing"
            className="btn-primary inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-semibold"
          >
            Shop the Stack
          </a>
        </Container>
      </header>

      <main>
        {/* Hero */}
        <Section className="relative overflow-hidden gradient-hero !py-12 sm:!py-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                  <span>RESEARCH OVERVIEW</span>
                </div>
                <h1 className="mt-6 text-balance text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  BPC-157 + TB-500
                  <span className="block text-2xl sm:text-3xl text-[var(--primary)]/60 font-semibold mt-2">
                    The Wolverine Stack
                  </span>
                </h1>
                <p className="mt-6 text-lg text-[var(--primary)]/70 max-w-xl">
                  An independent overview of the BPC-157 + TB-500 blend — often
                  called the &ldquo;Wolverine Stack&rdquo; in the research
                  community for its dual-mechanism approach to soft-tissue
                  repair. BPC-157 is a synthetic pentadecapeptide derived from
                  human gastric juice; TB-500 is a synthetic fragment of
                  thymosin β4. Together they target angiogenesis, cell
                  migration, and matrix remodeling through complementary
                  pathways.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href="/#pricing"
                    className="btn-primary inline-flex h-12 items-center justify-center rounded-2xl px-6 text-base font-semibold"
                  >
                    See the POWER CUT Stack
                  </a>
                  <a
                    href="#overview"
                    className="inline-flex h-12 items-center justify-center rounded-2xl border-2 border-[var(--border)] bg-white px-6 text-base font-semibold text-[var(--primary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--muted)]"
                  >
                    Read the Overview
                  </a>
                </div>

                <p className="mt-5 text-xs text-[var(--primary)]/50 max-w-xl">
                  For laboratory research and educational reference only. Not a
                  drug, supplement, or treatment. Not for human consumption.
                </p>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="relative">
                  <img
                    src="/BPC%20Tb%20Product%20Image%20Transparent%202.png"
                    alt="BPC-157 + TB-500 research vial"
                    className="w-full max-w-md drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--accent)]/30 to-[var(--accent)]/10 blur-3xl rounded-full scale-90" />
                </div>
              </div>
            </div>

            {/* Quick facts */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl">
              {[
                { label: "Blend", value: "5 mg + 5 mg" },
                { label: "Class", value: "Cytoprotective + Tβ4 fragment" },
                { label: "Targets", value: "VEGFR2 / G-actin" },
                { label: "Half-life", value: "~4 h / ~2–3 h" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="p-4 rounded-2xl bg-white border border-[var(--border)] shadow-sm"
                >
                  <p className="text-xs uppercase tracking-wider text-[var(--primary)]/60 font-semibold">
                    {f.label}
                  </p>
                  <p className="mt-1 font-bold text-[var(--primary)]">{f.value}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Table of contents */}
        <Section className="bg-[var(--muted)] !py-10 sm:!py-12">
          <Container>
            <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-white border border-[var(--border)]">
              <p className="text-sm font-bold uppercase tracking-wider text-[var(--primary)]/70">
                On this page
              </p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-[var(--primary)]/80 hover:text-[var(--accent-dark)] transition-colors"
                    >
                      → {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>

        {/* Overview */}
        <Section id="overview" className="bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Overview
              </h2>
              <div className="mt-6 space-y-5 text-lg text-[var(--primary)]/80 leading-relaxed">
                <p>
                  The BPC-157 + TB-500 protocol — colloquially known as the
                  &ldquo;Wolverine Stack&rdquo; — is one of the most widely
                  discussed regenerative-peptide combinations in the research
                  literature. It pairs{" "}
                  <span className="font-semibold">BPC-157</span> (Body
                  Protective Compound, a 15-amino-acid synthetic peptide
                  derived from a protective protein found in human gastric
                  juice) with <span className="font-semibold">TB-500</span> (a
                  synthetic fragment of thymosin β4 corresponding to its
                  active actin-binding domain).
                </p>
                <p>
                  The two peptides target tissue repair through complementary
                  but distinct mechanisms. BPC-157 acts primarily on the
                  angiogenic and nitric-oxide axes — upregulating VEGFR2,
                  modulating eNOS, and accelerating tendon-to-bone outgrowth in
                  preclinical models. TB-500 sequesters monomeric G-actin,
                  driving cellular migration, capillary formation, and
                  recruitment of progenitor cells into damaged tissue. Used
                  together, they cover both the local cytoprotective response
                  and the broader systemic remodeling phase of soft-tissue
                  recovery.
                </p>
                <p>
                  Both peptides remain investigational research compounds. They
                  are not approved by the FDA, EMA, or any other regulatory
                  body for human therapeutic use. Material referenced on this
                  page is intended for laboratory research and educational
                  reading only.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Mechanism */}
        <Section id="mechanism" className="bg-[var(--muted)]">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Mechanism of Action
              </h2>
              <p className="mt-4 text-lg text-[var(--primary)]/70">
                The blend pulls on two independent levers of tissue repair.
                Each peptide contributes a distinct, additive signal at the
                site of injury.
              </p>

              <div className="mt-10 grid md:grid-cols-2 gap-6">
                {[
                  {
                    tag: "BPC-157",
                    title: "Body Protective Compound (pentadecapeptide)",
                    body:
                      "A 15-amino-acid peptide isolated from a protective fragment of human gastric juice protein. In preclinical models it upregulates VEGFR2 expression, modulates the nitric-oxide (NO) system via eNOS, accelerates tendon and ligament fibroblast outgrowth, and produces broad cytoprotective effects across the GI tract, tendons, ligaments, muscle, and CNS. Stable in gastric acid — one of the few peptides with documented oral activity in animal studies.",
                  },
                  {
                    tag: "TB-500",
                    title: "Thymosin β4 fragment (Tβ4 17–23, LKKTETQ)",
                    body:
                      "A synthetic peptide corresponding to the active actin-binding region of naturally occurring thymosin β4. Sequesters monomeric G-actin, accelerating cell migration into wounded tissue, promoting endothelial-cell differentiation and capillary outgrowth, and recruiting bone-marrow-derived stem and progenitor cells to sites of injury. Systemic distribution gives it action beyond the immediate injection site.",
                  },
                ].map((m) => (
                  <div
                    key={m.tag}
                    className="p-6 rounded-2xl bg-white border border-[var(--border)] shadow-sm"
                  >
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-[var(--accent)]/15 text-[var(--accent-dark)]">
                      {m.tag}
                    </span>
                    <h3 className="mt-4 font-bold text-lg text-[var(--primary)]">
                      {m.title}
                    </h3>
                    <p className="mt-3 text-sm text-[var(--primary)]/70 leading-relaxed">
                      {m.body}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-base text-[var(--primary)]/70 leading-relaxed">
                Because BPC-157 and TB-500 act on different molecular targets —
                angiogenic signaling and growth-factor receptors versus
                actin-cytoskeleton dynamics and stem-cell recruitment — the
                two peptides are complementary rather than redundant. BPC-157
                is the localized, fast-acting cytoprotective agent; TB-500 is
                the slower, more systemic remodeling agent. Together they
                cover both the early inflammatory phase and the later
                proliferative / matrix-remodeling phases of repair.
              </p>
            </div>
          </Container>
        </Section>

        {/* Pharmacokinetics */}
        <Section id="pharmacokinetics" className="bg-white">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Pharmacokinetics
              </h2>

              <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)]">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-[var(--border)]">
                    {[
                      ["BPC-157 — class", "15-amino-acid synthetic pentadecapeptide (gastric juice fragment)"],
                      ["TB-500 — class", "7-amino-acid active fragment of thymosin β4 (LKKTETQ)"],
                      ["Administration (research)", "Subcutaneous injection (BPC-157 also studied via oral and intramuscular routes)"],
                      ["BPC-157 half-life", "~4 hours (plasma); local tissue effects persist longer"],
                      ["TB-500 half-life", "~2 – 3 hours (plasma); G-actin binding extends functional duration to several days"],
                      ["Onset of effect", "Within ~1 – 2 weeks of consistent administration in preclinical models"],
                      ["Stability (BPC-157)", "Stable in gastric acid — the only peptide in this class with documented oral activity"],
                      ["Elimination", "Proteolytic degradation; renal clearance of fragments"],
                    ].map(([k, v]) => (
                      <tr key={k} className="bg-white">
                        <th className="p-4 font-semibold text-[var(--primary)] bg-[var(--muted)] w-1/3 align-top">
                          {k}
                        </th>
                        <td className="p-4 text-[var(--primary)]/80">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        </Section>

        {/* Reported benefits */}
        <Section id="benefits" className="bg-[var(--muted)]">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Reported Benefits in Research
              </h2>
              <p className="mt-4 text-lg text-[var(--primary)]/70">
                Reported endpoints across the published preclinical literature
                and the broader BPC-157 / Tβ4 research base.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                {[
                  {
                    stat: "Tendon & ligament",
                    label:
                      "Accelerated tendon-to-bone healing and fibroblast outgrowth in rodent Achilles and medial-collateral ligament transection models — the most cited BPC-157 endpoint.",
                  },
                  {
                    stat: "Angiogenesis",
                    label:
                      "Both peptides promote capillary formation: BPC-157 via VEGFR2 upregulation, TB-500 via endothelial-cell migration and tube formation.",
                  },
                  {
                    stat: "Muscle repair",
                    label:
                      "Faster recovery from crush and laceration injury in muscle models; TB-500 in particular has been studied in cardiac and skeletal-muscle repair.",
                  },
                  {
                    stat: "GI cytoprotection",
                    label:
                      "BPC-157 produces broad protection of gastric and intestinal mucosa against NSAIDs, alcohol, and stress-induced ulceration in rodent models.",
                  },
                  {
                    stat: "Soft-tissue recovery",
                    label:
                      "Subjects report reduced soreness, faster recovery between training sessions, and improved range of motion through a 6 – 12 week cycle.",
                  },
                  {
                    stat: "Hair & skin",
                    label:
                      "TB-500 has documented effects on hair-follicle stem-cell activation and dermal wound closure; anecdotal reports of improved skin texture.",
                  },
                ].map((f) => (
                  <div
                    key={f.stat}
                    className="p-6 rounded-2xl bg-white border border-[var(--border)] shadow-sm"
                  >
                    <p className="text-3xl font-bold text-[var(--accent-dark)]">
                      {f.stat}
                    </p>
                    <p className="mt-2 text-[var(--primary)]/80">{f.label}</p>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm text-[var(--primary)]/60 italic">
                Endpoints summarized from peer-reviewed publications and the
                broader BPC-157 + Tβ4 literature; see references below.
              </p>
            </div>
          </Container>
        </Section>

        {/* What to Expect */}
        <Section id="what-to-expect" className="bg-white">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                What to Expect
              </h2>
              <p className="mt-4 text-lg text-[var(--primary)]/70">
                A general timeline of how response has progressed across the
                published literature and protocol observation. Individual
                results vary; values below describe ranges reported in research
                contexts and are not promises.
              </p>

              <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
                <ul className="space-y-5">
                  {[
                    {
                      week: "Week 1 – 2",
                      body:
                        "Early reduction in inflammation and pain at the injury site. Mild improvements in sleep and recovery commonly reported. TB-500 loading dose (where used) is administered in this window.",
                    },
                    {
                      week: "Week 2 – 4",
                      body:
                        "Noticeable improvements in joint comfort and range of motion. Reduced post-training soreness and steadier energy through the day. Most subjects feel the stack is “working” by the end of week 3.",
                    },
                    {
                      week: "Week 4 – 6",
                      body:
                        "More substantial gains in tissue resilience: tendons and ligaments tolerate progressively greater load, and chronic minor strains often resolve. This is when most published case reports note their inflection point.",
                    },
                    {
                      week: "Week 6 – 8",
                      body:
                        "For acute-injury research protocols, this is typically the end of the active cycle. Soft tissue is meaningfully remodeled; many subjects transition to maintenance dosing or cycle off.",
                    },
                    {
                      week: "Week 8 – 10",
                      body:
                        "Maintenance window: dose tapers to once-daily BPC-157 with optional weekly TB-500. Continued connective-tissue improvement and stabilization of gains before the planned cycle-off period.",
                    },
                  ].map((row) => (
                    <li key={row.week} className="flex gap-4">
                      <span className="flex-shrink-0 mt-1.5 w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
                      <div>
                        <p className="font-bold text-[var(--primary)]">
                          {row.week}
                        </p>
                        <p className="mt-1 text-[var(--primary)]/80 leading-relaxed">
                          {row.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-6 text-sm text-[var(--primary)]/60 italic">
                Timeline values reflect group-level outcomes in research
                settings. Adherence, dose, injury type, training stimulus, and
                baseline tissue health all materially influence individual
                response.
              </p>
            </div>
          </Container>
        </Section>

        {/* Dosing */}
        <Section id="dosing" className="bg-[var(--muted)]">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Reported Research Dosing
              </h2>
              <p className="mt-4 text-lg text-[var(--primary)]/70">
                The following schedule reflects the dosing design most
                commonly described in the published Wolverine Stack protocol
                literature for the 10 mg blended vial (5 mg BPC-157 + 5 mg
                TB-500). It is provided for reference only and is not a
                recommendation for human use.
              </p>

              <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)]">
                <table className="w-full text-left">
                  <thead className="bg-[var(--primary)] text-white">
                    <tr>
                      <th className="p-4 font-semibold">Phase</th>
                      <th className="p-4 font-semibold">Weeks</th>
                      <th className="p-4 font-semibold">Per-injection dose (research)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {[
                      ["Loading", "1 – 2", "BPC-157 250 mcg twice daily; TB-500 5 mg twice weekly"],
                      ["Active cycle", "3 – 6", "BPC-157 250 mcg twice daily; TB-500 2 – 2.5 mg twice weekly"],
                      ["Extended cycle", "7 – 8", "BPC-157 250 – 500 mcg daily; TB-500 2 mg twice weekly"],
                      ["Maintenance", "9 – 10", "BPC-157 250 mcg daily; TB-500 2 mg once weekly (optional)"],
                      ["Cycle off", "11 – 12", "Pause for 2 weeks before resuming"],
                    ].map((row) => (
                      <tr key={row[0]} className="bg-white">
                        <td className="p-4 font-semibold">{row[0]}</td>
                        <td className="p-4 text-[var(--primary)]/70">{row[1]}</td>
                        <td className="p-4 text-[var(--primary)]/70">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-6 text-base text-[var(--primary)]/70 leading-relaxed">
                Timing is flexible: BPC-157 is most often split into two daily
                subcutaneous injections (morning and evening), placed near the
                injury site when accessible. TB-500 is dosed twice weekly
                (e.g. Monday and Thursday), and because of its slow systemic
                action, location of injection is less important. A 6 – 8 week
                cycle is standard for active soft-tissue recovery; chronic or
                more severe presentations are extended to 8 – 12 weeks.
              </p>

              <p className="mt-4 text-sm text-[var(--primary)]/60 italic">
                The optional 2-week loading phase for TB-500 is the most
                consistent variation across published Wolverine Stack
                protocols and is associated with faster onset of effect.
              </p>
            </div>
          </Container>
        </Section>

        {/* Reconstitution */}
        <Section id="reconstitution" className="bg-white">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Reconstitution &amp; Storage
              </h2>

              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-[var(--border)] shadow-sm">
                  <h3 className="font-bold text-lg">Reconstitution (research handling)</h3>
                  <ul className="mt-4 space-y-2 text-[var(--primary)]/80">
                    <li>• Wipe the rubber stoppers of both the lyophilized vial and the bacteriostatic-water vial with an alcohol swab.</li>
                    <li>• Draw 2 mL of bacteriostatic water into a 3 mL syringe.</li>
                    <li>• Inject the diluent slowly down the inside wall of the peptide vial; do not aim directly at the powder.</li>
                    <li>• Swirl gently until fully dissolved. Do not shake.</li>
                    <li>• At 2 mL into a 10 mg blend (5 mg + 5 mg), each 0.1 mL contains 250 mcg BPC-157 + 250 mcg TB-500.</li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-[var(--border)] shadow-sm">
                  <h3 className="font-bold text-lg">Storage</h3>
                  <ul className="mt-4 space-y-2 text-[var(--primary)]/80">
                    <li>• Lyophilized: stable at room temperature short-term; refrigerate at 2 – 8 °C; long-term store at −20 °C.</li>
                    <li>• Reconstituted: refrigerate at 2 – 8 °C and use within ~28 days.</li>
                    <li>• Protect from light.</li>
                    <li>• Avoid repeated freeze-thaw cycles after reconstitution.</li>
                    <li>• Discard the vial immediately if cloudiness or particulate matter develops.</li>
                  </ul>
                </div>
              </div>

              <p className="mt-6 text-sm text-[var(--primary)]/60 italic">
                Storage parameters are general guidance for lyophilized peptide
                handling and may vary by batch — always defer to lot-specific
                documentation.
              </p>
            </div>
          </Container>
        </Section>

        {/* Side effects */}
        <Section id="side-effects" className="bg-[var(--muted)]">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Reported Adverse Events
              </h2>
              <p className="mt-4 text-lg text-[var(--primary)]/70">
                The BPC-157 + TB-500 combination is generally described as
                very well tolerated in published preclinical research and
                protocol literature, with most reported events mild,
                transient, and most often arising during the loading phase.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                {[
                  "Mild fatigue or lethargy during loading",
                  "Transient head-rush or light-headedness shortly after injection",
                  "Mild headache",
                  "Injection-site redness, itching, or bruising",
                  "Mild flushing or warmth",
                  "Temporary nausea (uncommon)",
                  "Vivid dreaming or sleep-cycle changes",
                  "Localized soreness at the injection site",
                ].map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                    <span className="text-[var(--primary)]/80">{s}</span>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm text-[var(--primary)]/60 italic">
                Long-term human safety data is limited. Both peptides remain
                investigational and have not been evaluated in large-scale
                controlled human trials. Theoretical concerns around enhanced
                angiogenesis warrant caution in any subject with a history of
                neoplastic disease.
              </p>
            </div>
          </Container>
        </Section>

        {/* Comparisons */}
        <Section id="comparisons" className="bg-white">
          <Container>
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Where the Blend Sits in the Regenerative-Peptide Class
              </h2>

              <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)]">
                <table className="w-full text-left">
                  <thead className="bg-[var(--primary)] text-white">
                    <tr>
                      <th className="p-4 font-semibold">Compound</th>
                      <th className="p-4 font-semibold">Mechanism</th>
                      <th className="p-4 font-semibold">Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] bg-white">
                    {[
                      ["BPC-157", "VEGFR2 / eNOS / NO axis", "Local cytoprotection; fast-acting; oral-stable"],
                      ["TB-500", "G-actin sequestration", "Systemic remodeling; slow-acting; longer cycle"],
                      ["Thymosin β4 (full)", "Native 43-aa peptide", "Endogenous parent of TB-500; broader but less potent"],
                      ["GHK-Cu", "Copper tripeptide", "Skin remodeling; collagen synthesis; cosmetic focus"],
                      ["BPC-157 + TB-500 (Wolverine Stack)", "Angiogenic + actin / migration", "Synergistic, dual-phase soft-tissue repair blend"],
                    ].map((row) => (
                      <tr key={row[0]}>
                        <td className="p-4 font-semibold">{row[0]}</td>
                        <td className="p-4 text-[var(--primary)]/70">{row[1]}</td>
                        <td className="p-4 text-[var(--primary)]/70">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        </Section>

        {/* References */}
        <Section id="references" className="bg-[var(--muted)]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                References
              </h2>
              <ol className="mt-6 space-y-4 list-decimal list-inside text-[var(--primary)]/80">
                <li>
                  Sikiric P, et al. Stable gastric pentadecapeptide BPC-157:
                  novel therapy in gastrointestinal tract.{" "}
                  <em>Current Pharmaceutical Design</em>, 2010.
                </li>
                <li>
                  Chang CH, et al. The promoting effect of pentadecapeptide
                  BPC-157 on tendon healing involves tendon outgrowth, cell
                  survival, and cell migration.{" "}
                  <em>Journal of Applied Physiology</em>, 2011.
                </li>
                <li>
                  Huang T, et al. Body protective compound-157 enhances
                  alkali-burn wound healing in vivo and promotes proliferation,
                  migration, and angiogenesis in vitro.{" "}
                  <em>Drug Design, Development and Therapy</em>, 2015.
                </li>
                <li>
                  Goldstein AL, Hannappel E, Kleinman HK. Thymosin β4: actin
                  sequestering protein moonlights to repair injured tissues.{" "}
                  <em>Trends in Molecular Medicine</em>, 2005.
                </li>
                <li>
                  Crockford D, et al. Thymosin β4: structure, function, and
                  biological properties supporting current and future clinical
                  applications. <em>Annals of the New York Academy of
                  Sciences</em>, 2010.
                </li>
                <li>
                  Pep-Pedia. Wolverine Stack — BPC-157 + TB-500 Protocol.
                  pep-pedia.org/peptides/wolverine-stack.
                </li>
              </ol>
              <p className="mt-6 text-sm text-[var(--primary)]/60 italic">
                Citations are provided for educational reference. Refer to the
                original publications for full methodology and results.
              </p>
            </div>
          </Container>
        </Section>

        {/* Final CTA back to main site */}
        <Section className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>READY TO LEARN MORE?</span>
              </div>
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                BPC-157 + TB-500 is part of the POWER CUT
                <span className="text-[0.5em] align-super">™</span> Stack
              </h2>
              <p className="mt-6 text-lg text-white/80">
                Peak State Labs supplies the BPC-157 + TB-500 blend alongside
                Retatrutide and CJC-1295 + Ipamorelin in a single coordinated
                stack — with full third-party purity testing on every batch.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/#pricing"
                  className="btn-accent inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold"
                >
                  Shop the Stack
                </a>
                <a
                  href="/"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-white/30 bg-white/5 px-8 text-lg font-semibold text-white transition-all hover:bg-white/10"
                >
                  Learn More on Peak State
                </a>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      {/* Footer — links back to main site */}
      <footer className="bg-[var(--primary)] text-white">
        <Container className="py-12">
          <div className="text-center pb-8 border-b border-white/10">
            <p className="text-sm text-white/60">
              {siteCopy.footer.productDisclaimer}
            </p>
          </div>

          <div className="py-8 border-b border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <a href="/" className="flex items-center gap-2 font-bold text-lg">
                <img
                  src="/logo.png"
                  alt="Peak State Labs Logo"
                  className="h-7 w-7 rounded-lg"
                />
                <span>{siteCopy.brand.name}</span>
              </a>
              <nav className="flex flex-wrap justify-center gap-6 text-sm">
                <a href="/" className="text-white/70 hover:text-white transition-colors">
                  Home
                </a>
                <a href="/#contents" className="text-white/70 hover:text-white transition-colors">
                  The Stack
                </a>
                <a href="/#pricing" className="text-white/70 hover:text-white transition-colors">
                  Pricing
                </a>
                <a href="/#faq" className="text-white/70 hover:text-white transition-colors">
                  FAQ
                </a>
              </nav>
            </div>
          </div>

          <div className="pt-8">
            <p className="text-xs text-white/50 leading-relaxed max-w-4xl mx-auto text-center">
              {siteCopy.footer.disclaimer}
            </p>
            <p className="text-xs text-white/40 text-center mt-6">
              © {new Date().getFullYear()} {siteCopy.footer.copyrightName}. All
              rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
