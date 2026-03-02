export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "dj")
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatPrice(cents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(cents);
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "upravo sada";
  if (seconds < 3600) return `prije ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `prije ${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `prije ${Math.floor(seconds / 86400)} dana`;
  if (seconds < 2592000) return `prije ${Math.floor(seconds / 604800)} sed.`;

  return new Intl.DateTimeFormat("hr-HR", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
