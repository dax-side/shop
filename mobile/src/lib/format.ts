const naira = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 });

// ₦32,000
export const formatNaira = (amount: number) => `₦${naira.format(amount)}`;

// "NOW", "2 MIN AGO", "3 HR AGO", "5 DAYS AGO"
export function timeAgo(iso: string, now = Date.now()) {
  const seconds = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export const firstName = (name: string | null | undefined) => name?.trim().split(/\s+/)[0] ?? "";

export function initials(name: string | null | undefined, email?: string | null) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length) return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
  return (email?.[0] ?? "?").toUpperCase();
}
