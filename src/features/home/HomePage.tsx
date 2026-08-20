import { Link } from "react-router-dom";
import { Seo } from "@/lib/seo/Seo";
import { itemListJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Carousel, CarouselItem } from "@/components/ui/Carousel";
import { MediaCard } from "@/components/media/MediaCard";
import { MediaGrid } from "@/components/media/MediaGrid";
import { ErrorState, MediaGridSkeleton } from "@/components/ui/states";
import {
  useAiringTodaySeriesQuery,
  useNowPlayingMoviesQuery,
} from "@/lib/tmdb/api";
import { posterUrl } from "@/lib/tmdb/images";
import { moviePath } from "@/lib/slug";
import type { MediaSummary, MediaType } from "@/types/tmdb";

const TOP_RATED_THRESHOLD = 7;


export default function HomePage() {
  const movies = useNowPlayingMoviesQuery(1);
  const series = useAiringTodaySeriesQuery(1);

  const movieList = movies.data?.results ?? [];
  const seriesList = series.data?.results ?? [];

  const topMovies = movieList.filter(
    (movie) => movie.vote_average > TOP_RATED_THRESHOLD,
  );
  const topSeries = seriesList.filter(
    (show) => show.vote_average > TOP_RATED_THRESHOLD,
  );

  return (
    <>
      <Seo
        title="React Movies"
        description="Browse films now playing in cinemas and TV series airing today, with cast, crew, trailers, reviews and ratings from The Movie Database."
        canonicalPath="/"
        image={posterUrl(movieList[0]?.poster_path, 780)}
        jsonLd={[
          websiteJsonLd(),
          itemListJsonLd(
            "Movies now playing",
            movieList.slice(0, 20).map((movie) => ({
              id: movie.id,
              title: movie.title ?? "",
              path: moviePath(movie.id, movie.title),
              image: posterUrl(movie.poster_path, 342),
            })),
          ),
        ]}
      />

      <Container width="full" className="py-8 sm:py-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-blue-500 sm:text-4xl">
            Movies and TV series
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-300 sm:text-base">
            Everything showing right now, pulled live from The Movie Database.
            Open any title for its full cast and crew, trailers, reviews,
            keywords and related films.
          </p>
        </div>

        <MediaRail
          title="Now playing in cinemas"
          items={movieList}
          mediaType="movie"
          seeAllHref="/movies"
          isLoading={movies.isLoading}
          isError={movies.isError}
          onRetry={movies.refetch}
        />

        <MediaRail
          title="TV series airing today"
          items={seriesList}
          mediaType="tv"
          seeAllHref="/series"
          isLoading={series.isLoading}
          isError={series.isError}
          onRetry={series.refetch}
        />

        <section className="mt-14" aria-labelledby="top-movies">
          <SectionHeader
            id="top-movies"
            title="Top rated movies now playing"
            linkTo="/movies"
            linkLabel="Browse all movies"
          />
          <p className="mb-4 text-sm text-gray-400">
            Films currently in cinemas rated above {TOP_RATED_THRESHOLD} out of
            10 by TMDB users.
          </p>
          <MediaGrid
            label="Top rated movies now playing"
            items={topMovies}
            mediaType="movie"
            isLoading={movies.isLoading}
            isError={movies.isError}
            onRetry={movies.refetch}
            emptyTitle="No highly rated films playing right now"
            emptyDescription="Check back tomorrow, or browse the full catalogue."
          />
        </section>

        <section className="mt-14" aria-labelledby="top-series">
          <SectionHeader
            id="top-series"
            title="Top rated series airing today"
            linkTo="/series"
            linkLabel="Browse all series"
          />
          <p className="mb-4 text-sm text-gray-400">
            Series with an episode airing today rated above{" "}
            {TOP_RATED_THRESHOLD} out of 10 by TMDB users.
          </p>
          <MediaGrid
            label="Top rated series airing today"
            items={topSeries}
            mediaType="tv"
            isLoading={series.isLoading}
            isError={series.isError}
            onRetry={series.refetch}
            emptyTitle="No highly rated series airing today"
            emptyDescription="Check back tomorrow, or browse the full catalogue."
          />
        </section>
      </Container>
    </>
  );
}

function MediaRail({
  title,
  items,
  mediaType,
  seeAllHref,
  isLoading,
  isError,
  onRetry,
}: {
  title: string;
  items: MediaSummary[];
  mediaType: MediaType;
  seeAllHref: string;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  return (
    <section className="mt-12 first:mt-0" aria-label={title}>
      <SectionHeader title={title} linkTo={seeAllHref} />
      {isLoading ? (
        <MediaGridSkeleton count={5} />
      ) : isError ? (
        <ErrorState compact onRetry={onRetry} />
      ) : items.length ? (
        <Carousel label={title}>
          {items.slice(0, 20).map((item, index) => (
            <CarouselItem key={item.id}>
              <MediaCard
                item={item}
                mediaType={mediaType}
                priority={index < 3}
              />
            </CarouselItem>
          ))}
        </Carousel>
      ) : (
        <p className="text-sm text-gray-400">
          Nothing to show.{" "}
          <Link to={seeAllHref} className="underline">
            Browse the catalogue
          </Link>
          .
        </p>
      )}
    </section>
  );
}
