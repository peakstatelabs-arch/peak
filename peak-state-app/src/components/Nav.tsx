"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  short?: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", short: "Home", icon: <IconHome /> },
  { href: "/peptide-tracker", label: "Peptide Tracker", short: "Tracker", icon: <IconSyringe /> },
  { href: "/dosing-guide", label: "Dosing Guide", short: "Guide", icon: <IconBook /> },
  { href: "/body-tracker", label: "Body Tracker", short: "Body", icon: <IconScale /> },
  { href: "/workouts", label: "Workouts", short: "Train", icon: <IconDumbbell /> },
  { href: "/nutrition", label: "Nutrition", short: "Food", icon: <IconBowl /> },
  { href: "/progress", label: "Progress", short: "Stats", icon: <IconChart /> },
  { href: "/community", label: "Community", short: "Crew", icon: <IconUsers /> },
  { href: "/profile", label: "Profile", short: "Me", icon: <IconUser /> },
];

const MOBILE_ITEMS = NAV_ITEMS.filter((n) =>
  ["/dashboard", "/peptide-tracker", "/body-tracker", "/workouts", "/profile"].includes(n.href)
);

export function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-bg-elev/40 h-screen sticky top-0">
      <div className="px-5 pt-6 pb-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <img src="https://www.peakstate.shop/logo.png" alt="Peak State Labs" className="h-8 w-8 rounded-md" />
          <span className="font-display font-semibold tracking-tight">
            Peak State <span className="text-accent">Labs</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-accent/10 text-fg font-medium"
                  : "text-fg-muted hover:text-fg hover:bg-bg-elev"
              )}
            >
              <span className={cn("h-5 w-5", active && "text-accent")}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              "mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm border border-dashed border-border",
              pathname?.startsWith("/admin")
                ? "bg-accent/10 text-fg font-medium"
                : "text-fg-muted hover:text-fg"
            )}
          >
            <span className="h-5 w-5"><IconShield /></span>
            Admin
          </Link>
        )}
      </nav>
      <div className="p-3 border-t border-border">
        <SignOutButton />
      </div>
    </aside>
  );
}

// pathname → page title for the mobile header
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Today",
  "/peptide-tracker": "Peptides",
  "/dosing-guide": "Dosing Guide",
  "/body-tracker": "Body",
  "/workouts": "Training",
  "/nutrition": "Nutrition",
  "/progress": "Progress",
  "/community": "Community",
  "/profile": "Profile",
  "/check-in": "Check-in",
  "/welcome": "Welcome",
};

function titleForPath(pathname: string | null): string | null {
  if (!pathname) return null;
  // exact match first
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // prefix match for nested routes (e.g. /dosing-guide/[slug])
  const key = Object.keys(PAGE_TITLES).find((k) => pathname.startsWith(k + "/"));
  if (key) return PAGE_TITLES[key];
  // /admin/*
  if (pathname.startsWith("/admin")) return "Admin";
  return null;
}

export function MobileTopBar({ isAdmin: _isAdmin, streak }: { isAdmin: boolean; streak: number }) {
  const pathname = usePathname();
  const isHome = pathname === "/dashboard" || pathname === "/" || pathname === "/welcome";
  const title = titleForPath(pathname);

  return (
    <header
      className="lg:hidden sticky top-0 z-30 bg-bg/70 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/60 border-b border-border/70 safe-top"
    >
      <div className="flex items-center justify-between gap-3 px-4 h-14">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <img
            src="https://www.peakstate.shop/logo.png"
            alt="Peak State Labs"
            width={28}
            height={28}
            className="h-7 w-7 rounded-md flex-shrink-0"
          />
          {isHome ? (
            <span className="font-display font-semibold tracking-tight whitespace-nowrap">
              Peak State <span className="text-accent">Labs</span>
            </span>
          ) : (
            <span className="font-display font-semibold tracking-tight truncate">
              {title ?? "Peak State Labs"}
            </span>
          )}
        </Link>

        {streak > 0 && (
          <Link
            href="/dashboard"
            aria-label={`Compliance streak: ${streak} day${streak === 1 ? "" : "s"}`}
            className="flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/30 px-3 h-8 text-accent flex-shrink-0"
          >
            <FlameIcon />
            <span className="text-sm font-bold tabular-nums leading-none">{streak}</span>
          </Link>
        )}
      </div>
    </header>
  );
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M12 2c1 4 4 5.5 4 9a4 4 0 0 1-8 0c0-1.5.5-2.5 1.5-3.5C8 9.5 7 11 7 12.5A5 5 0 0 0 12 17.5 5 5 0 0 0 17 12.5c0-3.5-3-6.5-5-10.5Z" />
    </svg>
  );
}

export function BottomTabBar() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-bg/85 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/75 border-t border-border/70 safe-bottom">
      <ul className="grid grid-cols-5">
        {MOBILE_ITEMS.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium",
                  active ? "text-accent" : "text-fg-muted"
                )}
              >
                <span className="h-5 w-5">{item.icon}</span>
                {item.short ?? item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function ThemeToggleButton() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="btn-ghost px-2 py-1.5"
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
    >
      {theme === "dark" ? <IconSun /> : <IconMoon />}
    </button>
  );
}

export function SignOutButton() {
  return (
    <form action="/portal/auth/signout" method="post">
      <button type="submit" className="btn-ghost w-full justify-start gap-3 text-sm">
        <span className="h-5 w-5"><IconLogout /></span>
        Sign out
      </button>
    </form>
  );
}

/* Icons (lucide-style inline SVG, no extra deps) */
function I({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      {children}
    </svg>
  );
}
function IconHome() { return <I><path d="M3 12 12 4l9 8" /><path d="M5 10v10h14V10" /></I>; }
function IconSyringe() { return <I><path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="m19 9-8.5 8.5a2 2 0 0 1-3-3L16 6" /><path d="m9 11 4 4" /><path d="m5 19-3 3" /><path d="M7 21l-3-3" /></I>; }
function IconBook() { return <I><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5Z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></I>; }
function IconScale() { return <I><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></I>; }
function IconDumbbell() { return <I><path d="M6.5 6.5 17.5 17.5"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></I>; }
function IconBowl() { return <I><path d="M2 12h20" /><path d="M3 12a9 9 0 0 0 18 0" /><path d="M12 2v5" /></I>; }
function IconChart() { return <I><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 5-6" /></I>; }
function IconUsers() { return <I><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></I>; }
function IconUser() { return <I><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></I>; }
function IconShield() { return <I><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></I>; }
function IconSun() { return <I><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></I>; }
function IconMoon() { return <I><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></I>; }
function IconLogout() { return <I><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></I>; }
