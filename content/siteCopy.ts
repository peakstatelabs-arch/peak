export type SiteCopy = {
  brand: {
    name: string;
    tagline: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  nav: { label: string; href: string }[];
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    bullets: string[];
  };
  features: {
    headline: string;
    subheadline: string;
    items: { title: string; description: string }[];
  };
  socialProof: {
    headline: string;
    subheadline: string;
    testimonials: { quote: string; name: string; title: string }[];
  };
  faq: {
    headline: string;
    items: { q: string; a: string }[];
  };
  cta: {
    headline: string;
    subheadline: string;
    emailTo: string;
    emailSubject: string;
    emailBodyHint: string;
  };
  footer: {
    copyrightName: string;
    links: { label: string; href: string }[];
    disclaimerTitle: string;
    disclaimerLines: string[];
  };
};

export const siteCopy: SiteCopy = {
  brand: {
    name: "Peak",
    tagline: "Precision peptides. Clear standards.",
    primaryCtaLabel: "Join the waitlist",
    primaryCtaHref: "#waitlist",
    secondaryCtaLabel: "View standards",
    secondaryCtaHref: "#standards",
  },
  nav: [
    { label: "Standards", href: "#standards" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#waitlist" },
  ],
  hero: {
    eyebrow: "PEPTIDE BRAND",
    headline: "Build your protocol on quality you can verify.",
    subheadline:
      "A modern peptide brand focused on transparent documentation, careful handling, and a frictionless buying experience—without the hype.",
    bullets: [
      "Clear specs and documentation for each product",
      "Fast, discreet fulfillment",
      "Support that speaks plainly",
    ],
  },
  features: {
    headline: "Standards you can read in minutes.",
    subheadline:
      "We’re designing Peak around three things: clear documentation, consistent handling, and great customer experience.",
    items: [
      {
        title: "Documentation-first",
        description:
          "Each product page is built to make critical details easy to find—so you spend less time guessing.",
      },
      {
        title: "Consistency",
        description:
          "Repeatable processes and careful packaging to help reduce variability from order to order.",
      },
      {
        title: "Plain-language support",
        description:
          "Fast answers, simple explanations, and no vague marketing claims.",
      },
      {
        title: "Modern checkout",
        description:
          "Mobile-friendly UX designed to reduce friction and increase clarity at every step.",
      },
      {
        title: "Privacy-minded",
        description:
          "Discreet shipping options and minimal data collection where possible.",
      },
      {
        title: "Continuous improvement",
        description:
          "We’ll ship updates frequently—product pages, guidance, and the site itself.",
      },
    ],
  },
  socialProof: {
    headline: "Early feedback (placeholder)",
    subheadline:
      "Add real reviews here once you have them. For now, these are placeholders to shape layout.",
    testimonials: [
      {
        quote:
          "The site makes it easy to understand what you’re buying—no digging for basics.",
        name: "Customer Name",
        title: "Verified buyer (placeholder)",
      },
      {
        quote: "Fast shipping and clear communication. Exactly what I want.",
        name: "Customer Name",
        title: "Verified buyer (placeholder)",
      },
    ],
  },
  faq: {
    headline: "FAQ",
    items: [
      {
        q: "When are you launching?",
        a: "We’re building in public and shipping iteratively. Join the waitlist and we’ll email you when the first drop is live.",
      },
      {
        q: "Do you provide medical advice?",
        a: "No. We don’t provide medical advice or protocol recommendations. Always consult a qualified professional for medical decisions.",
      },
      {
        q: "What makes Peak different?",
        a: "We’re focused on clarity: documentation-first product pages, consistent handling, and a straightforward customer experience.",
      },
      {
        q: "How do I contact you?",
        a: "Use the waitlist form below to email us, and we’ll respond as quickly as possible.",
      },
    ],
  },
  cta: {
    headline: "Get launch updates.",
    subheadline:
      "Drop your email and we’ll notify you when Peak is live. No spam—just product updates.",
    emailTo: "support@peak.example",
    emailSubject: "Peak waitlist",
    emailBodyHint:
      "Hi Peak team — please add me to the waitlist. My email is:",
  },
  footer: {
    copyrightName: "Peak",
    links: [
      { label: "Standards", href: "#standards" },
      { label: "FAQ", href: "#faq" },
      { label: "Back to top", href: "#top" },
    ],
    disclaimerTitle: "Important disclaimer",
    disclaimerLines: [
      "All content on this site is for informational purposes only and is not medical advice.",
      "Products and descriptions are not intended to diagnose, treat, cure, or prevent any disease.",
      "Always follow applicable laws and consult qualified professionals for medical decisions.",
      "Replace this disclaimer with language that matches your exact product positioning and compliance needs.",
    ],
  },
};

