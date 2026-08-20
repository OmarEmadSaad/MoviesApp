import { isTmdbConfigured } from "@/lib/tmdb/config";

export function ConfigNotice() {
  if (isTmdbConfigured()) return null;

  return (
    <div
      role="alert"
      className="border-b border-amber-700 bg-amber-950 px-4 py-3 text-center text-sm text-amber-100"
    >
      <p className="font-semibold">This site is not configured yet.</p>
      <p className="mt-1 text-amber-200">
        <code className="rounded bg-amber-900 px-1.5 py-0.5">
          VITE_TMDB_TOKEN
        </code>{" "}
        is missing, so no data can be loaded from The Movie Database. Set it in
        your hosting provider&rsquo;s environment variables and redeploy.
      </p>
    </div>
  );
}
