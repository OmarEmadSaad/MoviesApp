import { Seo } from "@/lib/seo/Seo";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import { Container } from "@/components/ui/Container";
import { MediaGrid } from "@/components/media/MediaGrid";
import { Pagination } from "@/components/ui/Pagination";
import { usePopularSeriesQuery } from "@/lib/tmdb/api";
import { buildPageHref, usePageParam } from "@/hooks/usePageParam";
import { posterUrl } from "@/lib/tmdb/images";
import { seriesPath } from "@/lib/slug";

const MAX_PAGES = 500;

export default function SeriesPage() {
  const page = usePageParam(MAX_PAGES);
  const { data, isLoading, isFetching, isError, refetch } =
    usePopularSeriesQuery(page);

  const series = data?.results ?? [];
  const totalPages = Math.min(data?.total_pages ?? MAX_PAGES, MAX_PAGES);
  const canonicalPath = buildPageHref("/series", page);

  return (
    <>
      <Seo
        title={page > 1 ? `TV series - page ${page}` : "TV series"}
        description={
          page > 1
            ? `Page ${page} of the most popular TV series on The Movie Database, with ratings, air dates, seasons and full cast.`
            : "Browse the most popular TV series on The Movie Database. Seasons, episodes, cast, trailers, reviews and ratings for every show."
        }
        canonicalPath={canonicalPath}
        image={posterUrl(series[0]?.poster_path, 780)}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "TV series", path: "/series" },
          ]),
          itemListJsonLd(
            page > 1 ? `Popular TV series - page ${page}` : "Popular TV series",
            series.map((show) => ({
              id: show.id,
              title: show.name ?? "",
              path: seriesPath(show.id, show.name),
              image: posterUrl(show.poster_path, 342),
            })),
          ),
        ]}
      >
        {page > 1 && (
          <link rel="prev" href={buildPageHref("/series", page - 1)} />
        )}
        {page < totalPages && (
          <link rel="next" href={buildPageHref("/series", page + 1)} />
        )}
      </Seo>

      <Container width="full" className="py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            TV series
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Sorted by popularity &middot; page{" "}
            <span className="text-light-blue-400">{page}</span> of{" "}
            <span className="text-light-blue-400">{totalPages}</span>
          </p>
        </header>

        <div aria-busy={isFetching}>
          <MediaGrid
            label={`TV series, page ${page}`}
            items={series}
            mediaType="tv"
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            showOverview
            emptyTitle="No series on this page"
            emptyDescription="Try an earlier page of the catalogue."
          />
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          buildHref={(target) => buildPageHref("/series", target)}
          label="TV series pagination"
        />
      </Container>
    </>
  );
}
