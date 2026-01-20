export const siteCopy = {
  brand: {
    name: "Peak State Labs",
    trademark: "POWER CUT\u2122",
    tagline: "The 10-Week Biological Shortcut to Your Dream Physique",
    primaryCtaLabel: "PRE-ORDER NOW",
    primaryCtaHref: "#pricing",
    secondaryCtaLabel: "See What's Included",
    secondaryCtaHref: "#contents",
  },

  urgencyBanner: {
    preorderText: "PREORDER SPECIAL: Save $150 today.",
    shippingText: "We ship in 21 days (Week of Feb 8th).",
    disclaimer: "For laboratory research only. Not for human consumption.",
  },

  nav: [
    { label: "Calculator", href: "#calculator" },
    { label: "What's Included", href: "#contents" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],

  hero: {
    eyebrow: "SECURE PRIORITY PRE-ORDER",
    headline: "POWER CUT\u2122",
    subheadline:
      "A Curated Peptide Stack Packaged With A Clear 10-Week Protocol For Rapid Fat Loss And Lean Muscle Growth",
    benefits: [
      {
        title: "Burn 2lbs Every Week",
        description:
          'Tell your body to melt fat away automatically without needing "willpower".',
      },
      {
        title: "Strong, Toned Muscle",
        description:
          "Build your dream physique while keeping your body healthy and safe.",
      },
      {
        title: "No Guessing",
        description:
          "Follow a simple 10-week map that tells you exactly what to do every day.",
      },
      {
        title: "Expert Coaching",
        description:
          "Get 1-on-1 support so you never feel alone on your journey.",
      },
      {
        title: "Proven Science",
        description:
          "Use the same clean, tested tools that the world's top athletes use.",
      },
      {
        title: "Total Body Reset",
        description:
          'Wake up with a "bolt of energy" and finally feel like yourself again.',
      },
    ],
    secureNote:
      "Secure Priority Pre-Order: We are currently in a 21-day final quality & purity certification window. Secure your kit now to be first in line for Batch 001 dispatch.",
    timerLabel: "Time remaining to lock in up to $150 Pre-Order Discount:",
    researchDisclaimer:
      "Laboratory research only. No medical or human-use guidance provided.",
  },

  calculator: {
    headline: "How Many Cycles Does Your Dream Physique Require?",
    subheadline:
      "Use the POWER CUT\u2122 Calculator to estimate how many 10-week cycles your transformation may require.",
    fields: {
      currentWeight: { label: "Current Weight (lbs)", min: 100, max: 400, default: 150 },
      goalWeight: { label: "Goal Weight (lbs)", min: 80, max: 350, default: 130 },
      currentBodyFat: {
        label: "Current Body Fat % (optional)",
        min: 5,
        max: 50,
        default: 20,
      },
      goalBodyFat: {
        label: "Goal Body Fat % (optional)",
        min: 5,
        max: 50,
        default: 15,
      },
    },
    resultPrefix: "You Need",
    resultSuffix: "POWER CUT\u2122 Cycles",
    resultTagline: "to Hit Your Goal",
  },

  contents: {
    headline: "POWER CUT\u2122 \u2014 Research Materials Included",
    subheadline:
      "The only toolkit that forces a total body reset, even if you've spent a lifetime fighting your own genetics.",
    items: [
      {
        name: "Retatrutide",
        amount: "20mg (2 vials)",
        url: "https://pep-pedia.org/peptides/retatrutide",
      },
      {
        name: "CJC-1295 + Ipamorelin",
        amount: "10mg Blend (2 vials)",
        url: "https://pep-pedia.org/peptides/cjc-ipa-protocol",
      },
      {
        name: "BPC-157 + TB-500",
        amount: "20mg Blend (2 vials)",
        url: "https://pep-pedia.org/peptides/wolverine-stack",
      },
    ],
  },

  comparison: {
    headline: "The Real Cost of Buying Each Peptide Individually",
    subheadline:
      "Most people think building their own stack saves money. It doesn't.",
    diy: {
      title: "DIY Sourcing",
      items: [
        { name: "Retatrutide 20mg (2 vials)", price: "$450+" },
        { name: "CJC-1295 + Ipamorelin 10mg blend (2 vials)", price: "$180+" },
        { name: "BPC-157 + TB-500 20mg blend (2 vials)", price: "$300+" },
      ],
      cons: ["Guesswork and confusion", "You're on your own"],
      total: "$900+",
    },
    powercut: {
      title: "The POWER CUT\u2122 Solution",
      items: [
        { name: "Retatrutide 20mg (2 vials)", price: "INCLUDED" },
        { name: "CJC-1295 + Ipamorelin 10mg blend (2 vials)", price: "INCLUDED" },
        { name: "BPC-157 + TB-500 20mg blend (2 vials)", price: "INCLUDED" },
      ],
      pros: ["Step-by-step proven system", "Private community and support"],
      price: "$599",
      savings: "$330+",
    },
  },

  pricing: {
    headline: "Choose Your Stack",
    tiers: [
      {
        id: "single",
        name: "The Body Reset",
        subtitle: "One 10-Week POWER CUT\u2122 Cycle",
        description:
          "A single 10-week burst to prove the system works. Perfect for hitting an immediate fat loss goal before deciding if you're ready for the elite level.",
        features: [
          "1\u00d7 POWER CUT\u2122 Research Cycle",
          "Full experiment protocol",
          "Handling & sequencing guidance",
          "Batch documentation (COAs)",
          "Research Cycle Calculator access",
          "Free shipping",
        ],
        estimatedValue: "$900",
        price: "$599",
        savings: "$50",
        ctaLabel: "Add To Cart",
        preorderNote: "PREORDER NOW AND SAVE $50",
        refundNote:
          "Pre-orders are guaranteed. Cancel anytime before shipment for a full refund.",
      },
      {
        id: "double",
        name: "The Total Transformation",
        subtitle: "Two 10-Week POWER CUT\u2122 Cycles",
        description:
          'The "Smart Choice" for 20 weeks of uninterrupted metabolic control. Stop "trying" and start guaranteeing your body finally cooperates with your ambition.',
        features: [
          "2\u00d7 POWER CUT\u2122 Research Cycles",
          "Extended protocol continuity",
          "Cleaner sequencing across phases",
          "Reduced variability from re-ordering",
          "Priority access to research drops",
          "Bonus guidance + protocol notes",
          "Batch documentation (COAs)",
          "Free shipping",
        ],
        estimatedValue: "$1,800",
        price: "$1,019",
        savings: "$100",
        ctaLabel: "Add To Cart",
        preorderNote: "PREORDER NOW AND SAVE $100",
        refundNote:
          "Pre-orders are guaranteed. Cancel anytime before shipment for a full refund.",
        popular: true,
      },
      {
        id: "triple",
        name: "The Biological Overhaul",
        subtitle: "Three 10-Week POWER CUT\u2122 Cycles",
        description:
          "Our most aggressive research timeline. Lock in three full cycles to ensure your new, lean physique becomes your permanent biological reality.",
        features: [
          "3\u00d7 POWER CUT\u2122 Research Cycles",
          "Full multi-phase protocol continuity",
          "Priority restocks on limited batches",
          "Highest cost-per-cycle efficiency",
          "Bonus protocol expansions",
          "Batch documentation (COAs)",
          "Free shipping",
        ],
        estimatedValue: "$2,700",
        price: "$1,259",
        savings: "$150",
        ctaLabel: "Add To Cart",
        preorderNote: "PREORDER NOW AND SAVE $150",
        refundNote:
          "Pre-orders are guaranteed. Cancel anytime before shipment for a full refund.",
      },
    ],
  },

  safety: {
    headline: "Your Safety Is Our #1 Priority",
    subheadline: "Documentation & COAs",
    description:
      "Everything inside POWER CUT\u2122 is supported with documentation and references.",
    documents: [
      { name: "Retatrutide", amount: "20mg" },
      { name: "CJC-1295 + Ipamorelin", amount: "10mg Blend" },
      { name: "BPC-157 + TB-500", amount: "20mg Blend" },
    ],
  },

  timeline: {
    headline: "The Path to Peak Performance: Batch 001 Timeline",
    subheadline:
      "Because we prioritize 99%+ purity, we don't 'warehouse' our stacks. Every Power Cut\u2122 kit is part of a fresh, small-batch production run.",
    steps: [
      {
        phase: "1. Secure Your Spot",
        days: "Days 1\u20133",
        action:
          "Lock in your pre-order discount and priority position in Batch 001.",
        result:
          "You get immediate digital access to the Power Cut\u2122 10-Week Protocol so you can begin your mental and nutritional preparation today.",
      },
      {
        phase: "2. Purity Verification",
        days: "Days 4\u201318",
        action:
          "Your kit undergoes final formulation followed by an additional independent, 3rd-party laboratory testing.",
        result:
          "We verify that every vial exceeds 99% purity, ensuring the highest level of safety and efficacy before it ever leaves our facility.",
      },
      {
        phase: "3. Priority Dispatch",
        days: "Days 19\u201321",
        action:
          "Kits are professionally packed and dispatched via priority, insured mail.",
        result:
          "Your tracking number is sent to your inbox and begins its journey from our production hub to your doorstep.",
      },
    ],
  },

  problem: {
    headline: "Most Peptide Users Fail Before They Start",
    reasons: [
      "The stack isn't curated",
      "There's no protocol",
      "No sequence",
      "No clarity",
      "No consistency",
    ],
    solution: {
      headline: "POWER CUT\u2122 solves all five:",
      tagline: "Stack + Protocol + Access = Guaranteed Results",
    },
  },

  faq: {
    headline: "Frequently Asked Questions",
    items: [
      {
        q: "Is this medical advice?",
        a: "No. Nothing on this site constitutes medical advice. We do not provide recommendations for human use, dosing, or protocols. Always consult with a licensed healthcare professional before making any health decisions.",
      },
      {
        q: "Why a protocol?",
        a: "Research quality dramatically improves with structure. Our 10-week protocol provides clear sequencing, documentation checkpoints, and milestone tracking so your data is clean and actionable.",
      },
      {
        q: "Is this beginner-friendly?",
        a: "Yes. The protocol is designed to guide researchers through every step, from handling and storage to sequencing and documentation. No prior peptide research experience required.",
      },
      {
        q: "How many cycles do I need?",
        a: "Use our calculator above to estimate based on your research parameters. Most researchers see meaningful data within 1-2 cycles, with 3 cycles providing the most comprehensive dataset.",
      },
      {
        q: "What happens after I order?",
        a: "You'll receive immediate digital access to the 10-Week Protocol. Your physical kit ships within our 21-day production window, and you'll receive tracking information via email.",
      },
      {
        q: "Are Certificates of Analysis available?",
        a: "Yes. Every batch includes full COA documentation from independent third-party laboratories, verifying 99%+ purity for all compounds.",
      },
      {
        q: "Why insider drops?",
        a: "Due to our small-batch production model and 99%+ purity standards, inventory is limited. Priority access ensures serious researchers get first access to each production run.",
      },
      {
        q: "Can I buy the components individually?",
        a: "The POWER CUT\u2122 stack is specifically curated and sequenced for optimal research outcomes. While individual components exist elsewhere, our value comes from the complete system: curated compounds + proven protocol + community support.",
      },
    ],
  },

  finalCta: {
    headline: "Stop Guessing. Start Structuring.",
    description:
      "Your research becomes dramatically easier when it happens inside a 10-week structure.",
    subtext:
      "Cycles end. Data is clean. Decisions are clear. This is why POWER CUT\u2122 works.",
  },

  footer: {
    copyrightName: "POWER CUT\u2122",
    disclaimer:
      "Power Cut\u2122 and all peptides referenced are sold for research and educational purposes only. Nothing on this site is medical advice. Not intended to diagnose, treat, cure, or prevent any disease. Not for human consumption. Consult a licensed healthcare provider before making decisions about your health. All testimonials are individual experiences and not guarantees. By using this site, you agree this is for informational and research-use only.",
    productDisclaimer:
      "All products are for laboratory research only. Not for human consumption. Not a drug, treatment, or supplement. No medical use implied or intended.",
  },
};

export type SiteCopy = typeof siteCopy;
