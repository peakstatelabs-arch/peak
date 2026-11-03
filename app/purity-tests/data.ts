export interface PurityTest {
  slug: string;
  name: string;
  amount: string;
  title: string;
  images: string[];
}

export const PURITY_TESTS: Record<string, PurityTest> = {
  reta: {
    slug: "reta",
    name: "Retatrutide",
    amount: "20mg",
    title: "Retatrutide 20mg Lab Report",
    images: [
      "/RETA NEW1.png",
      "/RETA NEW2.png",
    ],
  },
  "cjc-ipa": {
    slug: "cjc-ipa",
    name: "CJC-1295 + Ipamorelin",
    amount: "10mg Blend",
    title: "CJC-1295 + Ipamorelin 10mg Blend Lab Report",
    images: [
      "/CJC NEW1.png",
      "/CJC NEW2.png",
    ],
  },
  "bpc-tb": {
    slug: "bpc-tb",
    name: "BPC-157 + TB-500",
    amount: "20mg Blend",
    title: "BPC-157 + TB-500 20mg Blend Lab Report",
    images: [
      "/BPC NEW1.png",
      "/BPC NEW2.png",
    ],
  },
  ghkcu: {
    slug: "ghkcu",
    name: "GHK-Cu",
    amount: "50mg",
    title: "GHK-Cu 50mg Lab Report",
    images: [
      "/GHKCU NEW1.png",
      "/GHCKU NEW2.png",
    ],
  },
  kpv: {
    slug: "kpv",
    name: "KPV",
    amount: "10mg",
    title: "KPV 10mg Lab Report",
    images: [
      "/KPV NEW1.png",
      "/KPV NEW2.png",
    ],
  },
  nad: {
    slug: "nad",
    name: "NAD+",
    amount: "500mg",
    title: "NAD+ 500mg Lab Report",
    images: [
      "/NAD NEW1.png",
      "/NAD NEW2.png",
    ],
  },
};
