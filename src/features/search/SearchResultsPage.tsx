import { Navigate, useParams } from "react-router-dom";
import { Seo } from "@/lib/seo/Seo";
import { Container } from "@/components/ui/Container";
import { MediaGrid } from "@/components/media/MediaGrid";
import { useSearchMoviesQuery, useSearchSeriesQuery } from "@/lib/tmdb/api";

const SCOPES = ["movies", "series"] as const;
type Scope = (typeof SCOPES)[number];

function isScope(value: string | undefined): value is Scope {
  return SCOPES.includes(value as Scope);
}

export default function SearchResultsPage() {
  const { scope, query } = useParams();

  if (!isScope(scope) || !query) {
    return <Navigate to="/" replace />;
  }

  const decoded = decodeURIComponent(query);
  return <Results scope={scope} query={decoded} />;
}

function Results({ scope, query }: { scope: Scope; query: string }) {
  const movies = useSearchMoviesQuery(query, { skip: scope !== "movies" });
  const series = useSearchSeriesQuery(query, { skip: scope !== "series" });

  const active = scope === "movies" ? movies : series;
  const results = active.data ?? [];
  const label = scope === "movies" ? "movies" : "TV series";

  return (
    <>
      <Seo
        title={`Search: ${query}`}
        description={`${label} matching "${query}" on The Movie Database.`}
        canonicalPath={`/search/${scope}/${encodeURIComponent(query)}`}
        noindex
      />

      <Container width="full" className="py-8">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {label} matching{" "}
            <span className="text-light-blue-500">&ldquo;{query}&rdquo;</span>
          </h1>
          {!active.isLoading && (
            <p className="mt-2 text-sm text-gray-400">
              {results.length}{" "}
              {results.length === 1 ? "result" : "results"}
            </p>
          )}
        </header>

        <MediaGrid
          label={`Search results for ${query}`}
          items={results}
          mediaType={scope === "movies" ? "movie" : "tv"}
          isLoading={active.isLoading}
          isError={active.isError}
          onRetry={active.refetch}
          showOverview
          emptyTitle={`No ${label} found for "${query}"`}
          emptyDescription="Try a different spelling, or switch the search type in the header."
        />
      </Container>
    </>
  );
}
