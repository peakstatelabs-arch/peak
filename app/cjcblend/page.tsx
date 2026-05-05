import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";

export const metadata: Metadata = {
  title: "CJC-1295 (no DAC) + Ipamorelin — Research Overview | Peak State Labs",
  description:
    "Independent research overview of the CJC-1295 (no DAC) + Ipamorelin blend: a GHRH analog paired with a selective GH secretagogue. Mechanism, half-life, reported research dosing, and reconstitution — for laboratory and educational use only.",
  alternates: { canonical: "/cjcblend" },
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

export default function CjcBlendPage() {
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
                  CJC-1295 + Ipamorelin
                  <span className="block text-2xl sm:text-3xl text-[var(--primary)]/60 font-semibold mt-2">
                    GHRH Analog + Selective GH Secretagogue
                  </span>
                </h1>
                <p className="mt-6 text-lg text-[var(--primary)]/70 max-w-xl">
                  An independent overview of the CJC-1295 (no DAC) + Ipamorelin
                  blend: a modified GHRH analog paired with a selective ghrelin-receptor
                  agonist. Together they drive a pulsatile, physiologic release of
                  endogenous growth hormone without disturbing cortisol, prolactin,
                  or ACTH.
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
                    src="/CJC%20Ipa%20Product%20Image%20Transparent%202.png"
                    alt="CJC-1295 + Ipamorelin research vial"
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
                { label: "Class", value: "GHRH + GHRP" },
                { label: "Targets", value: "GHRH-R / GHSR-1a" },
                { label: "Half-life", value: "~30 min / ~2 h" },
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
                  The CJC-1295 + Ipamorelin protocol is one of the most widely
                  studied combinations in growth-hormone research. It pairs{" "}
                  <span className="font-semibold">CJC-1295 (no DAC)</span> — also
                  known as Modified GRF (1-29), a tetrasubstituted analog of the
                  first 29 amino acids of endogenous GHRH — with{" "}
                  <span className="font-semibold">Ipamorelin</span>, a selective
                  pentapeptide growth-hormone secretagogue.
                </p>
                <p>
                  CJC-1295 (no DAC) acts upstream at the GHRH receptor on the
                  anterior pituitary, while Ipamorelin acts at the ghrelin /
                  growth-hormone-secretagogue receptor (GHSR-1a). Because the two
                  peptides recruit GH through complementary, parallel pathways,
                  the combination produces a markedly larger pulsatile GH release
                  than either compound alone — without the cortisol, prolactin,
                  or ACTH disturbance characteristic of older non-selective
                  secretagogues.
                </p>
                <p>
                  Both peptides remain investigational research compounds. They
                  are not approved by the FDA, EMA, or any other regulatory body
                  for human therapeutic use. Material referenced on this page is
                  intended for laboratory research and educational reading only.
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
                The blend pulls on two independent levers of growth-hormone
                physiology. Each peptide contributes a distinct, additive
                signal at the somatotroph.
              </p>

              <div className="mt-10 grid md:grid-cols-2 gap-6">
                {[
                  {
                    tag: "GHRH-R",
                    title: "CJC-1295 (no DAC) — Modified GRF (1-29)",
                    body:
                      "A 29-amino-acid GHRH analog that binds the GHRH receptor on pituitary somatotrophs. Activation drives cAMP/PKA signaling, increasing GH synthesis and amplifying the size of each natural GH pulse. The four amino-acid substitutions resist DPP-IV cleavage and improve stability vs. native GHRH.",
                  },
                  {
                    tag: "GHSR-1a",
                    title: "Ipamorelin — selective ghrelin-receptor agonist",
                    body:
                      "A pentapeptide GH secretagogue that binds GHSR-1a via Gq/11-linked calcium signaling. Triggers GH release without measurable elevation in cortisol, ACTH, prolactin, or aldosterone — the cleanest profile in the GHRP class.",
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
                Because GHRH-R and GHSR-1a recruit GH via different second
                messengers, co-administration produces a synergistic — not
                merely additive — pulse. The use of CJC-1295{" "}
                <span className="italic">without</span> DAC is intentional: the
                short half-life preserves the natural pulsatile architecture of
                GH release rather than creating a continuous &quot;bleed&quot;
                of the hormone, which would blunt receptor sensitivity over
                time.
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
                      ["CJC-1295 (no DAC) — class", "29-amino-acid modified GHRH analog (Mod GRF 1-29)"],
                      ["Ipamorelin — class", "Synthetic pentapeptide GH secretagogue"],
                      ["Administration (research)", "Subcutaneous injection"],
                      ["CJC-1295 half-life", "~30 minutes (short pulse to mimic native GHRH)"],
                      ["Ipamorelin half-life", "~2 hours (range 1.5 – 2.5 h reported)"],
                      ["Onset of GH pulse", "Within ~15 minutes of subcutaneous injection"],
                      ["GH-pulse duration", "~2 – 3 hours from a single co-administered dose"],
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
                Reported endpoints across the published literature and the
                broader GHRH + GHRP research base.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                {[
                  {
                    stat: "Sleep",
                    label:
                      "Deeper slow-wave sleep is among the earliest and most consistently reported endpoints, typically appearing within the first 1 – 2 weeks of administration.",
                  },
                  {
                    stat: "Recovery",
                    label:
                      "Improved recovery between training sessions, reduced soreness, and accelerated soft-tissue repair are commonly reported within 2 – 4 weeks.",
                  },
                  {
                    stat: "Body composition",
                    label:
                      "Gradual increases in lean mass and reductions in visceral fat reported across 6 – 12 weeks; effects scale with baseline GH status.",
                  },
                  {
                    stat: "IGF-1",
                    label:
                      "Pulsatile GH release drives downstream IGF-1 elevation — the surrogate marker most often used to confirm pituitary response.",
                  },
                  {
                    stat: "Skin & connective tissue",
                    label:
                      "Anecdotal reports of improved skin texture, hair quality, and joint comfort consistent with elevated GH/IGF-1 axis activity.",
                  },
                  {
                    stat: "Selectivity",
                    label:
                      "Unlike GHRP-2 / GHRP-6 / hexarelin, ipamorelin does not measurably elevate cortisol, prolactin, ACTH, or aldosterone — the cleanest profile in the class.",
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
                broader GHRH + GHRP literature; see references below.
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
                published literature and clinical observation. Individual
                results vary; values below describe ranges reported in research
                contexts and are not promises.
              </p>

              <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
                <ul className="space-y-5">
                  {[
                    {
                      week: "Week 1 – 2",
                      body:
                        "Improved sleep onset and noticeably deeper slow-wave sleep are typically the first endpoints reported. Mild flushing or warmth shortly after injection is common during initial adaptation.",
                    },
                    {
                      week: "Week 2 – 4",
                      body:
                        "Recovery between training sessions improves; subjects commonly report reduced muscle soreness, steadier daytime energy, and more vivid dreaming.",
                    },
                    {
                      week: "Week 4 – 8",
                      body:
                        "Early body-composition changes appear: gradual reductions in waist circumference and modest lean-mass gains. IGF-1 confirmation testing typically reaches steady state in this window.",
                    },
                    {
                      week: "Week 8 – 10",
                      body:
                        "More visible body-composition changes, improved skin texture and joint comfort, and continued recovery improvements. Most research protocols reassess and consider cycling at this point.",
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
                settings. Adherence, dose, sleep quality, training stimulus, and
                baseline GH status all materially influence individual response.
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
                The following schedule reflects the titration design most
                commonly described in the published protocol literature for the
                10 mg blended vial (5 mg CJC-1295 no DAC + 5 mg Ipamorelin). It
                is provided for reference only and is not a recommendation for
                human use.
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
                      ["Initiation", "1 – 2", "100 mcg of each peptide, once daily"],
                      ["Titration A", "3 – 4", "150 mcg of each peptide, once daily"],
                      ["Titration B", "5 – 8", "200 mcg of each peptide, once or twice daily"],
                      ["Maintenance", "9 – 10", "Up to 300 mcg of each peptide, twice daily"],
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
                Timing is consistent across protocols: subcutaneous injection
                30 – 60 minutes before bed (single-dose schedules) or split
                between fasted morning and pre-bed (twice-daily schedules), with
                a 2 – 3 hour fasted window before each dose to prevent insulin
                and free-fatty-acid blunting of the GH pulse.
              </p>

              <p className="mt-4 text-sm text-[var(--primary)]/60 italic">
                Slow titration is the standard pattern in published protocols
                and is associated with reduced flushing, headache, and
                injection-site reactions.
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
                    <li>• At 2 mL into a 10 mg blend (5 mg + 5 mg), each 0.1 mL contains 250 mcg CJC-1295 + 250 mcg Ipamorelin.</li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-[var(--border)] shadow-sm">
                  <h3 className="font-bold text-lg">Storage</h3>
                  <ul className="mt-4 space-y-2 text-[var(--primary)]/80">
                    <li>• Lyophilized: refrigerate at 2 – 8 °C; long-term store at −20 °C.</li>
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
                The CJC-1295 (no DAC) + Ipamorelin combination is generally
                described as well tolerated in published research, with most
                reported events mild, transient, and dose-related — and most
                arising during titration.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                {[
                  "Transient flushing or warmth shortly after injection",
                  "Mild headache",
                  "Light-headedness on standing",
                  "Increased appetite (typically modest)",
                  "Mild fluid retention",
                  "Tingling or numbness in extremities",
                  "Vivid dreaming / sleep-cycle changes",
                  "Injection-site redness or itching",
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
                Notably, ipamorelin&apos;s selectivity at GHSR-1a means cortisol,
                prolactin, ACTH, and aldosterone are not measurably elevated —
                a key differentiator from earlier non-selective GHRPs.
              </p>
            </div>
          </Container>
        </Section>

        {/* Comparisons */}
        <Section id="comparisons" className="bg-white">
          <Container>
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Where the Blend Sits in the GH-Secretagogue Class
              </h2>

              <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)]">
                <table className="w-full text-left">
                  <thead className="bg-[var(--primary)] text-white">
                    <tr>
                      <th className="p-4 font-semibold">Compound</th>
                      <th className="p-4 font-semibold">Receptor</th>
                      <th className="p-4 font-semibold">Selectivity profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] bg-white">
                    {[
                      ["CJC-1295 (no DAC)", "GHRH-R", "GHRH-analog; preserves pulsatile GH release"],
                      ["CJC-1295 (DAC)", "GHRH-R", "Long-acting; produces continuous GH bleed (less physiologic)"],
                      ["Sermorelin", "GHRH-R", "First-generation GHRH(1-29); shorter half-life"],
                      ["Ipamorelin", "GHSR-1a", "Selective: no cortisol / prolactin / ACTH elevation"],
                      ["GHRP-2 / GHRP-6", "GHSR-1a", "Stronger pulse but raises cortisol & prolactin"],
                      ["Hexarelin", "GHSR-1a", "Most potent GHRP; tachyphylaxis, raises cortisol"],
                      ["CJC-1295 + Ipamorelin", "GHRH-R + GHSR-1a", "Synergistic, physiologic, low-side-effect blend"],
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
                  Teichman SL, et al. Prolonged stimulation of growth hormone
                  (GH) and insulin-like growth factor I secretion by CJC-1295,
                  a long-acting analog of GH-releasing hormone, in healthy
                  adults. <em>J Clin Endocrinol Metab</em>, 2006.
                </li>
                <li>
                  Raun K, et al. Ipamorelin, the first selective growth hormone
                  secretagogue. <em>Eur J Endocrinol</em>, 1998.
                </li>
                <li>
                  Sinha DK, et al. Beyond the androgen receptor: the role of
                  growth hormone secretagogues. <em>Translational Andrology
                  and Urology</em>, 2020.
                </li>
                <li>
                  Bowers CY. GH-releasing peptides — structure and kinetics.
                  <em> Journal of Pediatric Endocrinology &amp; Metabolism</em>,
                  1993.
                </li>
                <li>
                  Pep-Pedia. CJC-1295 (no DAC) / Ipamorelin Protocol.
                  pep-pedia.org/peptides/cjc-ipa-protocol.
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
                CJC-1295 + Ipamorelin is part of the POWER CUT
                <span className="text-[0.5em] align-super">™</span> Stack
              </h2>
              <p className="mt-6 text-lg text-white/80">
                Peak State Labs supplies the CJC-1295 + Ipamorelin blend
                alongside Retatrutide and BPC-157 + TB-500 in a single
                coordinated stack — with full third-party purity testing on
                every batch.
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
