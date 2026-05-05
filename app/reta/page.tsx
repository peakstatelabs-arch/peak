import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";

export const metadata: Metadata = {
  title: "Retatrutide (LY-3437943) — Research Overview | Peak State Labs",
  description:
    "Independent research overview of retatrutide (LY-3437943): a triple GLP-1 / GIP / glucagon receptor agonist. Mechanism, half-life, reported research dosing, and trial findings — for laboratory and educational use only.",
  alternates: { canonical: "/reta" },
};

const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "mechanism", label: "Mechanism of Action" },
  { id: "pharmacokinetics", label: "Pharmacokinetics" },
  { id: "research-findings", label: "Research Findings" },
  { id: "what-to-expect", label: "What to Expect" },
  { id: "dosing", label: "Reported Research Dosing" },
  { id: "reconstitution", label: "Reconstitution & Storage" },
  { id: "side-effects", label: "Reported Adverse Events" },
  { id: "comparisons", label: "Comparisons" },
  { id: "references", label: "References" },
];

export default function RetatrutidePage() {
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
                  Retatrutide
                  <span className="block text-2xl sm:text-3xl text-[var(--primary)]/60 font-semibold mt-2">
                    Triple Receptor Agonist
                  </span>
                </h1>
                <p className="mt-6 text-lg text-[var(--primary)]/70 max-w-xl">
                  An independent overview of the investigational peptide retatrutide:
                  a synthetic triple agonist of the GLP-1, GIP, and glucagon
                  receptors developed by Eli Lilly and currently in late-stage
                  clinical evaluation for obesity and metabolic disease.
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
                    src="/Reta Product Image Transparent.png"
                    alt="Retatrutide research vial"
                    className="w-full max-w-md drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--accent)]/30 to-[var(--accent)]/10 blur-3xl rounded-full scale-90" />
                </div>
              </div>
            </div>

            {/* Quick facts */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl">
              {[
                { label: "Compound", value: "LY-3437943" },
                { label: "Class", value: "Triple Agonist" },
                { label: "Targets", value: "GLP-1 / GIP / GCG" },
                { label: "Half-life", value: "~6 days" },
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
                  Retatrutide (developmental code{" "}
                  <span className="font-semibold">LY-3437943</span>) is an
                  investigational synthetic peptide developed by Eli Lilly. It is
                  notable for activating three incretin and metabolic hormone
                  receptors simultaneously: the glucagon-like peptide-1 (GLP-1)
                  receptor, the glucose-dependent insulinotropic polypeptide
                  (GIP) receptor, and the glucagon (GCG) receptor.
                </p>
                <p>
                  Where earlier peptides such as semaglutide acted on a single
                  receptor (GLP-1) and tirzepatide added a second (GIP),
                  retatrutide extends this approach by adding glucagon receptor
                  activity. The intended outcome of the third agonism is
                  increased basal energy expenditure and lipid mobilization on
                  top of the appetite and glycemic effects of GLP-1 / GIP
                  signaling.
                </p>
                <p>
                  As of the most recent published results, retatrutide remains
                  an investigational compound undergoing Phase 3 clinical trials
                  and is not approved by the FDA, EMA, or any other regulatory
                  body. Material referenced on this page is intended for
                  laboratory research and educational reading only.
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
                Retatrutide&apos;s effects derive from three parallel signaling
                pathways. Each receptor contributes a different piece of the
                metabolic picture.
              </p>

              <div className="mt-10 grid md:grid-cols-3 gap-6">
                {[
                  {
                    tag: "GLP-1",
                    title: "Glucagon-like peptide-1",
                    body:
                      "Slows gastric emptying, enhances glucose-dependent insulin secretion, and acts centrally to reduce appetite and food intake.",
                  },
                  {
                    tag: "GIP",
                    title: "Glucose-dependent insulinotropic polypeptide",
                    body:
                      "Augments insulin response to nutrients and is thought to modulate adipose tissue lipid handling and energy storage.",
                  },
                  {
                    tag: "GCG",
                    title: "Glucagon",
                    body:
                      "Increases hepatic glucose output but also raises basal energy expenditure and promotes lipolysis — the differentiating mechanism vs. dual agonists.",
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
                The receptor balance is intentionally tilted: GLP-1 and GIP
                activity dominate the glycemic and appetite response, while
                glucagon activity is calibrated to add an energy-expenditure
                contribution without producing the hyperglycemia historically
                associated with pure glucagon agonism.
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
                      ["Molecular class", "39-amino-acid peptide with C20 fatty diacid moiety"],
                      ["Administration (research)", "Subcutaneous injection"],
                      ["Reported half-life", "~6 days (supports once-weekly dosing in trials)"],
                      ["Time to steady state", "Approximately 4 weeks of weekly administration"],
                      ["Elimination", "Proteolytic degradation; no renal dose adjustment reported in trials"],
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

        {/* Research findings */}
        <Section id="research-findings" className="bg-[var(--muted)]">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Research Findings
              </h2>
              <p className="mt-4 text-lg text-[var(--primary)]/70">
                Published Phase 2 results have drawn significant attention to
                retatrutide&apos;s magnitude of effect relative to other incretin
                agents.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                {[
                  {
                    stat: "~24%",
                    label:
                      "Mean body-weight reduction at 48 weeks at the highest dose in the Phase 2 obesity trial.",
                  },
                  {
                    stat: "Phase 3",
                    label:
                      "Currently in ongoing Phase 3 trials (TRIUMPH program) for obesity and related conditions.",
                  },
                  {
                    stat: "Dose-dependent",
                    label:
                      "Weight and HbA1c response scaled with dose across the 1 mg / 4 mg / 8 mg / 12 mg arms tested.",
                  },
                  {
                    stat: "Hepatic fat",
                    label:
                      "Sub-studies have reported substantial reductions in hepatic steatosis (MASLD/NAFLD).",
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
                Numbers above are summarized from peer-reviewed publications;
                see references below.
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
                A general timeline of how response has progressed across published
                Phase 2 trial data. Individual results vary; figures below are
                ranges reported in clinical research and are not promises.
              </p>

              <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
                <ul className="space-y-5">
                  {[
                    {
                      week: "Week 1 – 2",
                      body:
                        "Early appetite suppression begins as triple-receptor activity ramps up; mild gastrointestinal effects are common during initial adaptation.",
                    },
                    {
                      week: "Week 2 – 4",
                      body:
                        "Noticeable reduction in cravings and portion size. Early body-weight reduction in the 2 – 5% range begins to appear.",
                    },
                    {
                      week: "Week 4 – 8",
                      body:
                        "Steadier appetite control and continued weight reduction (typically 5 – 10%). Glycemic markers improve in subjects with type-2 diabetes.",
                    },
                    {
                      week: "Week 8 – 16",
                      body:
                        "Substantial body-weight reduction (10 – 18%) accompanied by increased basal energy expenditure and broader metabolic improvements.",
                    },
                    {
                      week: "Week 16 – 24",
                      body:
                        "A major weight-loss milestone (15 – 22%) with cardiovascular markers improving and reductions in hepatic fat reported.",
                    },
                    {
                      week: "Week 24 – 48",
                      body:
                        "Maximum efficacy observed in trials (up to ~24% mean reduction at the highest dose) with comprehensive metabolic improvements and sustained benefits.",
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
                Timeline values reflect group-level outcomes from published
                trials. Adherence, dose, baseline weight, and lifestyle inputs
                all materially influence individual response.
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
                The following weekly schedule reflects the dose-titration design
                used in published clinical research. It is provided for
                reference only and is not a recommendation for human use.
              </p>

              <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)]">
                <table className="w-full text-left">
                  <thead className="bg-[var(--primary)] text-white">
                    <tr>
                      <th className="p-4 font-semibold">Phase</th>
                      <th className="p-4 font-semibold">Weeks</th>
                      <th className="p-4 font-semibold">Weekly dose (research)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {[
                      ["Initiation", "1 – 4", "0.5 – 2 mg"],
                      ["Titration A", "5 – 8", "4 mg"],
                      ["Titration B", "9 – 12", "6 – 8 mg"],
                      ["Maintenance", "13+", "Up to 12 mg (highest arm tested)"],
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

              <p className="mt-6 text-sm text-[var(--primary)]/60 italic">
                Slow titration is consistent across published trials and is
                associated with reduced gastrointestinal adverse events.
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
                    <li>• Reconstitute lyophilized peptide with bacteriostatic water for injection.</li>
                    <li>• Inject diluent slowly down the side of the vial; do not shake.</li>
                    <li>• Swirl gently until fully dissolved.</li>
                    <li>• Volume of diluent determines final mg-per-unit concentration.</li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-[var(--border)] shadow-sm">
                  <h3 className="font-bold text-lg">Storage</h3>
                  <ul className="mt-4 space-y-2 text-[var(--primary)]/80">
                    <li>• Lyophilized: refrigerate at 2 – 8 °C; long-term store at −20 °C.</li>
                    <li>• Reconstituted: refrigerate at 2 – 8 °C and use within manufacturer-stated stability window.</li>
                    <li>• Protect from light.</li>
                    <li>• Avoid repeated freeze-thaw cycles after reconstitution.</li>
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
                Reported Adverse Events in Clinical Trials
              </h2>
              <p className="mt-4 text-lg text-[var(--primary)]/70">
                The adverse event profile reported in the published Phase 2
                trials is consistent with the broader incretin-agonist class.
                Most events were graded mild to moderate, were dose-related, and
                occurred during titration.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                {[
                  "Nausea",
                  "Diarrhea",
                  "Vomiting",
                  "Constipation",
                  "Decreased appetite",
                  "Injection-site reactions",
                  "Transient heart-rate elevation",
                  "Mild lipid profile changes",
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
                This list summarizes published trial data and is not exhaustive.
                Long-term safety remains under evaluation as Phase 3 progresses.
              </p>
            </div>
          </Container>
        </Section>

        {/* Comparisons */}
        <Section id="comparisons" className="bg-white">
          <Container>
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Where Retatrutide Sits in the Incretin Class
              </h2>

              <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)]">
                <table className="w-full text-left">
                  <thead className="bg-[var(--primary)] text-white">
                    <tr>
                      <th className="p-4 font-semibold">Compound</th>
                      <th className="p-4 font-semibold">Receptor targets</th>
                      <th className="p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] bg-white">
                    {[
                      ["Semaglutide", "GLP-1", "Approved"],
                      ["Tirzepatide", "GLP-1 + GIP", "Approved"],
                      ["Retatrutide (LY-3437943)", "GLP-1 + GIP + Glucagon", "Phase 3 / investigational"],
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
                  Jastreboff AM, et al. Triple–Hormone-Receptor Agonist
                  Retatrutide for Obesity — A Phase 2 Trial. <em>NEJM</em>, 2023.
                </li>
                <li>
                  Rosenstock J, et al. Retatrutide in Type 2 Diabetes — Phase 2
                  results. <em>The Lancet</em>, 2023.
                </li>
                <li>
                  Sanyal AJ, et al. Effect of retatrutide on hepatic steatosis
                  — sub-study analysis. 2024.
                </li>
                <li>
                  Eli Lilly investor materials and ClinicalTrials.gov entries
                  for the TRIUMPH program (Phase 3).
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
                Retatrutide is part of the POWER CUT
                <span className="text-[0.5em] align-super">™</span> Stack
              </h2>
              <p className="mt-6 text-lg text-white/80">
                Peak State Labs supplies retatrutide alongside CJC-1295 +
                Ipamorelin and BPC-157 + TB-500 in a single coordinated stack —
                with full third-party purity testing on every batch.
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
