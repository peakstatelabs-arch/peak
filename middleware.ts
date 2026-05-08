import { NextRequest, NextResponse } from "next/server";

const STRUCTURED_PEPTIDES_HOSTS = new Set([
  "structuredpeptides.com",
  "www.structuredpeptides.com",
]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";
  const { pathname, search } = request.nextUrl;

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
