export const LOCAL_SITE_URL = "http://localhost:5173";

export function resolveSiteUrl(
  explicit?: string,
  vercelProductionUrl?: string,
): string {
  const chosen = explicit?.trim() || vercelProductionUrl?.trim();
  if (!chosen) return LOCAL_SITE_URL;

  const withProtocol = /^https?:\/\//i.test(chosen)
    ? chosen
    : `https://${chosen}`;

  return withProtocol.replace(/\/+$/, "");
}
