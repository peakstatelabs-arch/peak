import type { Metadata } from "next";
import { StackPage } from "@/app/components/sale/StackPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BUILD Stack — Black Friday Sale, Up To 60% Off Stacks | Peak State Labs",
  description: "The BUILD stack: BPC-157 + TB-500 and CJC-1295 + Ipamorelin lean muscle stack. Black Friday pricing — save up to 40% when you stack.",
  robots: { index: false },
};

export default function BuildPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <StackPage slug="build" searchParams={searchParams} />;
}
