import type { Metadata } from "next";
import { StackPage } from "@/app/components/sale/StackPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "LIMITLESS Stack — Black Friday Sale, Up To 60% Off Stacks | Peak State Labs",
  description: "The LIMITLESS stack: NAD+ and BPC-157 + TB-500 energy and focus stack. Black Friday pricing — save up to 40% when you stack.",
  robots: { index: false },
};

export default function LimitlessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <StackPage slug="limitless" searchParams={searchParams} />;
}
