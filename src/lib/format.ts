export function formatRuntime(minutes: number | null | undefined): string | null {
  if (!minutes || minutes <= 0) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function toIsoDuration(minutes: number | null | undefined): string | null {
  if (!minutes || minutes <= 0) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `PT${hours ? `${hours}H` : ""}${mins ? `${mins}M` : ""}`;
}

export function formatDate(date: string | null | undefined): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatYear(date: string | null | undefined): string | null {
  if (!date) return null;
  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? null : String(year);
}

export function formatCurrency(amount: number | null | undefined): string | null {
  if (!amount || amount <= 0) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatScore(voteAverage: number | null | undefined): string | null {
  if (voteAverage == null || voteAverage <= 0) return null;
  return `${Math.round(voteAverage * 10)}%`;
}

export function formatRating(voteAverage: number | null | undefined): string {
  if (voteAverage == null) return "0.0";
  return voteAverage.toFixed(1);
}

const GENDERS: Record<number, string> = {
  1: "Female",
  2: "Male",
  3: "Non-binary",
};

export function formatGender(gender: number | null | undefined): string {
  return (gender != null && GENDERS[gender]) || "Not specified";
}

export function truncate(text: string | null | undefined, max: number): string {
  if (!text) return "";
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}

export function uniqueById<T extends { id: number }>(items: T[]): T[] {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

export function groupBy<T, K extends string>(
  items: T[],
  key: (item: T) => K,
): Record<K, T[]> {
  return items.reduce(
    (acc, item) => {
      const group = key(item);
      (acc[group] ??= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}
