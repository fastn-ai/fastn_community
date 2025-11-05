import {
  GET_NOTIFICATIONS_API_URL,
  MARK_NOTIFICATION_READ_API_URL,
  MARK_ALL_NOTIFICATIONS_READ_API_URL,
} from "@/constants";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string; // ISO string
  isRead: boolean;
  type?: string;
  link?: string; // optional URL to navigate
};

function getAuthHeader(): HeadersInit {
  // Access token is stored by oidc-client in sessionStorage; rely on `react-oidc-context` components to pass token to callers when needed.
  const token = (window as any).authAccessToken as string | undefined;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function resolveCredentialsMode(): RequestCredentials {
  try {
    const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
    return isLocal ? "omit" : "include";
  } catch {
    return "include";
  }
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const res = await fetch(GET_NOTIFICATIONS_API_URL, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    credentials: resolveCredentialsMode(),
  });
  if (!res.ok) {
    throw new Error(`Failed to load notifications (${res.status})`);
  }
  const data = await res.json();
  // Normalize minimal shape
  return (data?.notifications ?? data ?? []).map((n: any) => ({
    id: String(n.id ?? n.notificationId ?? n._id),
    title: n.title ?? n.subject ?? "Notification",
    message: n.message ?? n.body ?? "",
    createdAt: n.createdAt ?? n.time ?? n.created_at ?? new Date().toISOString(),
    isRead: Boolean(n.isRead ?? n.read ?? false),
    type: n.type,
    link: n.link,
  }));
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const res = await fetch(MARK_NOTIFICATION_READ_API_URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ id: notificationId }),
    credentials: resolveCredentialsMode(),
  });
  if (!res.ok) {
    throw new Error(`Failed to mark notification as read (${res.status})`);
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  const res = await fetch(MARK_ALL_NOTIFICATIONS_READ_API_URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    credentials: resolveCredentialsMode(),
  });
  if (!res.ok) {
    throw new Error(`Failed to mark all notifications as read (${res.status})`);
  }
}


