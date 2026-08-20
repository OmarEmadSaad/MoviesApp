import { Seo } from "@/lib/seo/Seo";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import { Container } from "@/components/ui/Container";
import { MediaGrid } from "@/components/media/MediaGrid";
import { Pagination } from "@/components/ui/Pagination";
import { useDiscoverMoviesQuery } from "@/lib/tmdb/api";
import { buildPageHref, usePageParam } from "@/hooks/usePageParam";
import { posterUrl } from "@/lib/tmdb/images";
import { moviePath } from "@/lib/slug";

const MAX_PAGES = 500;

export default function MoviesPage() {
  const page = usePageParam(MAX_PAGES);
  const { data, isLoading, isFetching, isError, refetch } =
    useDiscoverMoviesQuery(page);

  const movies = data?.results ?? [];
  const totalPages = Math.min(data?.total_pages ?? MAX_PAGES, MAX_PAGES);
  const canonicalPath = buildPageHref("/movies", page);

  return (
    <>
      <Seo
        title={page > 1 ? `Movies - page ${page}` : "Movies"}
        description={
          page > 1
            ? `Page ${page} of the most popular movies on The Movie Database, with ratings, release dates and full cast and crew.`
            : "Browse the most popular movies on The Movie Database, sorted by popularity. Ratings, release dates, cast, crew, trailers and reviews for every title."
        }
        canonicalPath={canonicalPath}
        image={posterUrl(movies[0]?.poster_path, 780)}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Movies", path: "/movies" },
          ]),
          itemListJsonLd(
            page > 1 ? `Popular movies - page ${page}` : "Popular movies",
            movies.map((movie) => ({
              id: movie.id,
              title: movie.title ?? "",
              path: moviePath(movie.id, movie.title),
              image: posterUrl(movie.poster_path, 342),
            })),
          ),
        ]}
      >
        {page > 1 && (
          <link rel="prev" href={buildPageHref("/movies", page - 1)} />
        )}
        {page < totalPages && (
          <link rel="next" href={buildPageHref("/movies", page + 1)} />
        )}
      </Seo>

      <Container width="full" className="py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Movies</h1>
          <p className="mt-2 text-sm text-gray-400">
            Sorted by popularity &middot; page{" "}
            <span className="text-light-blue-400">{page}</span> of{" "}
            <span className="text-light-blue-400">{totalPages}</span>
          </p>
        </header>

        <div aria-busy={isFetching}>
          <MediaGrid
            label={`Movies, page ${page}`}
            items={movies}
            mediaType="movie"
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            emptyTitle="No movies on this page"
            emptyDescription="Try an earlier page of the catalogue."
          />
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          buildHref={(target) => buildPageHref("/movies", target)}
          label="Movies pagination"
        />
      </Container>
    </>
  );
}
