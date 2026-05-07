import posthog from "posthog-js";

const STORAGE_KEY = "psl.contact";

export interface ClientContact {
  email?: string;
  name?: string;
}

function isEmail(value: unknown): value is string {
  return (
    typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

function getFromPostHog(): ClientContact {
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

function getFromLocalStorage(): ClientContact {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ClientContact;
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
 */
export function saveClientContact(contact: ClientContact): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getFromLocalStorage();
    const merged: ClientContact = {
      email: contact.email || existing.email,
      name: contact.name || existing.name,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // localStorage may be disabled (private mode etc) — fail silently.
  }
}

/**
 * Reads the visitor's contact info, preferring localStorage and falling back
 * to the PostHog identified distinct ID if it looks like an email.
 */
export function readClientContact(): ClientContact {
  const local = getFromLocalStorage();
  if (local.email && local.name) return local;

  const fromPosthog = getFromPostHog();
  return {
    email: local.email || fromPosthog.email,
    name: local.name || fromPosthog.name,
  };
}
