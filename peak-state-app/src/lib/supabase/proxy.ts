import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const BASE = "/portal";
// Public = unauthenticated visitors are allowed in. /accept-terms requires a
// session but isn't under (app), so signed-in-but-not-yet-accepted users hit
// it directly without bouncing to /login.
const PUBLIC_PATHS = [
  "/login",
  "/auth/callback",
  "/forgot-password",
  "/reset-password",
  "/terms",
  "/privacy",
];

function stripBase(p: string) {
  if (p === BASE) return "/";
  if (p.startsWith(BASE + "/")) return p.slice(BASE.length);
  return p;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rawPath = request.nextUrl.pathname;
  const pathname = stripBase(rawPath);
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = `${BASE}/login`;
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = `${BASE}/dashboard`;
    return NextResponse.redirect(url);
  }

  return response;
}
