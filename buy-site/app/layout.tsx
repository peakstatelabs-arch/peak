import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Peak State Labs — Skincare",
  description:
    "The Engine, The Architect, The Shield, and The Restorer — Peak State Labs' skincare line for rejuvenation, scar healing, acne protection, and hair, nail, and collagen support.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable}`} style={{ fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
