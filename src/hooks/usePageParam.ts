import { useSearchParams } from "react-router-dom";

export function usePageParam(totalPages = 500): number {
  const [searchParams] = useSearchParams();
  const raw = Number(searchParams.get("page"));
  if (!Number.isFinite(raw) || raw < 1) return 1;
  return Math.min(Math.floor(raw), totalPages);
}

export function buildPageHref(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}
