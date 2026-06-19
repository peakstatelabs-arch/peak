import webpush from "web-push";

export type PushPayload = {
  title: string;
  body: string;
  tag?: string;
  url?: string;
};

export type StoredSubscription = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

let configured = false;
function configure(): boolean {
  if (configured) return true;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:drewdeorsey@gmail.com";
  if (!pub || !priv) return false;
  webpush.setVapidDetails(subject, pub, priv);
  configured = true;
  return true;
}

export function pushConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

/**
 * Send a push to one subscription. Returns:
 *  - "sent": delivered to the gateway
 *  - "expired": the subscription is dead (410/404) and should be deleted
 *  - "error": some other failure
 */
export async function sendPush(
  sub: StoredSubscription,
  payload: PushPayload
): Promise<"sent" | "expired" | "error"> {
  if (!configure()) return "error";
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload),
      { TTL: 60 * 60 } // 1 hour
    );
    return "sent";
  } catch (e: unknown) {
    const status = (e as { statusCode?: number })?.statusCode;
    if (status === 404 || status === 410) return "expired";
    return "error";
  }
}
