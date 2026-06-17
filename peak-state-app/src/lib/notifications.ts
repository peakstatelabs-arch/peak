"use client";

/**
 * Request browser notification permission. Must be called from a user
 * gesture (e.g. a click handler). Returns the resulting permission.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof Notification === "undefined") return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export function notificationsSupported(): boolean {
  return typeof Notification !== "undefined";
}
