import posthog from "posthog-js";

const STORAGE_KEY = "psl.contact";
const SESSION_KEY = "psl.session";

export interface ClientContact {
  email?: string;
  name?: string;
  sessionId?: string;
}

function isEmail(value: unknown): value is string {
  return (
    typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

function generateSessionId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `s_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 12)}`;
}

function getOrCreateSessionId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const created = generateSessionId();
    window.localStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return undefined;
  }
}

function getFromPostHog(): { email?: string; name?: string } {
  if (typeof window === "undefined") return {};
  try {
    const distinctId = posthog?.get_distinct_id?.();
    const email = isEmail(distinctId) ? distinctId : undefined;
    const nameProp = posthog?.get_property?.("name");
    const name = typeof nameProp === "string" ? nameProp : undefined;
    return { email, name };
  } catch {
    return {};
  }
}

function getFromLocalStorage(): { email?: string; name?: string } {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { email?: string; name?: string };
    return {
      email: isEmail(parsed.email) ? parsed.email : undefined,
      name: typeof parsed.name === "string" ? parsed.name : undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Persists email/name on the client so we can attribute later events (e.g. Add
 * to Cart clicks) back to the visitor that signed up at /research-access.
 * Also seeds the session id so every event the user fires is tied to a stable
 * per-browser identifier even before they identify themselves.
 */
export function saveClientContact(contact: {
  email?: string;
  name?: string;
}): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getFromLocalStorage();
    const merged = {
      email: contact.email || existing.email,
      name: contact.name || existing.name,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // localStorage may be disabled (private mode etc) — fail silently.
  }
  // Ensure a session id exists for downstream events.
  getOrCreateSessionId();
}

/**
 * Reads the visitor's contact info, preferring localStorage and falling back
 * to the PostHog identified distinct ID if it looks like an email. Always
 * returns a sessionId, generating one on first call if missing.
 */
export function readClientContact(): ClientContact {
  const local = getFromLocalStorage();
  const fromPosthog =
    local.email && local.name ? { email: undefined, name: undefined } : getFromPostHog();
  return {
    email: local.email || fromPosthog.email,
    name: local.name || fromPosthog.name,
    sessionId: getOrCreateSessionId(),
  };
}

/**
 * Returns a display-safe first name for greetings, or undefined when the
 * stored value isn't plausibly a name. Account "names" are user-entered and
 * messy — often an email, a full name, or junk — so we only greet when it
 * looks like a real first name:
 *   - drop anything containing "@" (an email)
 *   - keep the first token only ("Nichole Moore" -> "Nichole")
 *   - reject tokens with digits/symbols, or shorter than 2 / longer than 20
 *   - normalize casing ("alex"/"ALEX" -> "Alex") while preserving intentional
 *     mixed case ("McKay", "DeOrsey")
 */
export function safeFirstName(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.includes("@")) return undefined;
  const first = trimmed.split(/\s+/)[0];
  if (!/^[A-Za-z][A-Za-z'’-]{1,19}$/.test(first)) return undefined;
  const allLower = first === first.toLowerCase();
  const allUpper = first === first.toUpperCase();
  return allLower || allUpper
    ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
    : first;
}
