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
      "/Reta Lab Report 2 Page 1.png",
      "/Reta Lab Report 2 Page 2.png",
    ],
  },
  "cjc-ipa": {
    slug: "cjc-ipa",
    name: "CJC-1295 + Ipamorelin",
    amount: "10mg Blend",
    title: "CJC-1295 + Ipamorelin 10mg Blend Lab Report",
    images: [
      "/CJC Lab Report 2 Page 1.png",
      "/CJC Lab Report 2 Page 2.png",
    ],
  },
  "bpc-tb": {
    slug: "bpc-tb",
    name: "BPC-157 + TB-500",
    amount: "20mg Blend",
    title: "BPC-157 + TB-500 20mg Blend Lab Report",
    images: [
      "/BPC Lab Report 2 Page 1.png",
      "/BPC Lab Report 2 Page 2.png",
      "/BPC Lab Report 2 Page 3.png",
    ],
  },
  ghkcu: {
    slug: "ghkcu",
    name: "GHK-Cu",
    amount: "50mg",
    title: "GHK-Cu 50mg Lab Report",
    images: [
      "/GHKCU Lab Report/1.png",
      "/GHKCU Lab Report/2.png",
    ],
  },
  kpv: {
    slug: "kpv",
    name: "KPV",
    amount: "10mg",
    title: "KPV 10mg Lab Report",
    images: [
      "/KPV 1.png",
      "/KPV 2.png",
    ],
  },
  nad: {
    slug: "nad",
    name: "NAD+",
    amount: "500mg",
    title: "NAD+ 500mg Lab Report",
    images: [
      "/NAD 1.png",
      "/NAD 2.png",
    ],
  },
};
