import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply — Peak State Creator Program",
  description: "Apply to become a Peak State Creator.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function CreatorApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
