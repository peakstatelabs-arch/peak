import { NextRequest, NextResponse } from "next/server";

const STRUCTURED_PEPTIDES_HOSTS = new Set([
  "structuredpeptides.com",
  "www.structuredpeptides.com",
]);

// One canonical address: browsers keep cookies and the saved cart per
// address, so a visitor bouncing between peakstate.shop and
// www.peakstate.shop would lose their cart. Send the bare domain to www.
const APEX_HOST = "peakstate.shop";
const CANONICAL_ORIGIN = "https://www.peakstate.shop";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";
  const { pathname, search } = request.nextUrl;

  if (host.split(":")[0] === APEX_HOST) {
    return NextResponse.redirect(`${CANONICAL_ORIGIN}${pathname}${search}`, 308);
  }

  if (STRUCTURED_PEPTIDES_HOSTS.has(host) && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/structured-peptides";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
