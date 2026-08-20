import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/app/lib/CartContext";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Peak State Skincare",
  description:
    "The Engine, The Architect, The Shield, The Restorer, The Catalyst, and The Regulator — Peak State Skincare's line for rejuvenation, scar healing, acne protection, collagen support, cellular glow, and tone balance.",
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
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
