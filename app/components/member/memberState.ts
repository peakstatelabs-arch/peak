import { hasSavedContact } from "@/app/lib/clientContact";

// Visibility state for the "Members save 10%" banner, shared as a tiny
// external store so components can read it with useSyncExternalStore.

const DISMISS_KEY = "psl.memberBanner.dismissedAt";
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000; // hide for 7 days after ✕
const CHANGE_EVENT = "psl:member-change";

// Fallback for browsers that block storage: remember ✕ for this page view.
let dismissedInMemory = false;

function dismissedRecently(): boolean {
  if (dismissedInMemory) return true;
  try {
    const at = Number(window.localStorage.getItem(DISMISS_KEY));
    return Number.isFinite(at) && at > 0 && Date.now() - at < DISMISS_MS;
  } catch {
    return false;
  }
}

/** Client snapshot: show the banner to non-members who haven't dismissed it. */
export function shouldShowMemberBanner(): boolean {
  return !hasSavedContact() && !dismissedRecently();
}

/** Server snapshot: render nothing until the client knows who's visiting. */
export function shouldShowMemberBannerOnServer(): boolean {
  return false;
}

export function subscribeMemberState(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange); // other tabs
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Call after signing someone up so the banner re-checks and hides. */
export function notifyMemberChange(): void {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function dismissMemberBanner(): void {
  dismissedInMemory = true;
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // Storage blocked — the in-memory flag still hides it for this page view.
  }
  notifyMemberChange();
}
