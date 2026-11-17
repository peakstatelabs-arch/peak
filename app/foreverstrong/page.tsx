import type { Metadata } from "next";
import { StackPage } from "@/app/components/sale/StackPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FOREVER STRONG Stack — Black Friday Sale, Up To 60% Off Stacks | Peak State Labs",
  description: "The FOREVER STRONG stack: BPC-157 + TB-500, CJC-1295 + Ipamorelin and KPV stack. Black Friday pricing — save up to 40% when you stack.",
  robots: { index: false },
};

export default function ForeverstrongPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <StackPage slug="foreverstrong" searchParams={searchParams} />;
}
