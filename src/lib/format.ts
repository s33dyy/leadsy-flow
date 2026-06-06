export function initials(name?: string | null) {
  if (!name) return "—";
  return name.split(/\s+/).filter(Boolean).map(p => p[0]).slice(0, 2).join("").toUpperCase();
}

export function relativeTime(input?: string | Date | null): string {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  const diff = Date.now() - d.getTime();
  const s = Math.max(1, Math.round(diff / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.round(h / 24);
  if (days < 30) return `${days}d`;
  return d.toLocaleDateString();
}
