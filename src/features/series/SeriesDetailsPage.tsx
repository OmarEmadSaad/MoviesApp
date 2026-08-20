import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/lib/seo/Seo";
import { breadcrumbJsonLd, seriesJsonLd } from "@/lib/seo/jsonld";
import { seriesDescription } from "@/lib/seo/descriptions";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Carousel, CarouselItem } from "@/components/ui/Carousel";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Image } from "@/components/ui/Image";
import {
  EmptyState,
  ErrorState,
  MediaGridSkeleton,
  PageLoading,
  Skeleton,
} from "@/components/ui/states";
import { MediaCard } from "@/components/media/MediaCard";
import { PersonCard } from "@/components/media/PersonCard";
import { MediaHero, type HeroFact } from "@/components/media/MediaHero";
import { MediaTabs } from "@/components/media/MediaTabs";
import { ReviewCard } from "@/components/media/ReviewCard";
import { SocialLinks } from "@/components/media/SocialLinks";
import { FactList } from "@/components/media/FactList";
import NotFoundPage from "@/features/NotFoundPage";
import {
  useSeriesCreditsQuery,
  useSeriesExternalIdsQuery,
  useSeriesImagesQuery,
  useSeriesKeywordsQuery,
  useSeriesQuery,
  useSeriesRecommendationsQuery,
  useSeriesReviewsQuery,
  useSeriesVideosQuery,
} from "@/lib/tmdb/api";
import { useNumericParam } from "@/hooks/useNumericParam";
import { seriesPath } from "@/lib/slug";
import { posterSrcSet, posterUrl, youtubeEmbedUrl } from "@/lib/tmdb/images";
import { formatDate, formatRuntime, formatYear, uniqueById } from "@/lib/format";
import { pickTrailer } from "@/features/movies/trailer";

export default function SeriesDetailsPage() {
  const id = useNumericParam();
  const [trailerOpen, setTrailerOpen] = useState(false);

  const series = useSeriesQuery(id!, { skip: id == null });
  const credits = useSeriesCreditsQuery(id!, { skip: id == null });
  const videos = useSeriesVideosQuery(id!, { skip: id == null });
  const images = useSeriesImagesQuery(id!, { skip: id == null });
  const keywords = useSeriesKeywordsQuery(id!, { skip: id == null });
  const reviews = useSeriesReviewsQuery(id!, { skip: id == null });
  const recommendations = useSeriesRecommendationsQuery(id!, { skip: id == null });
  const externalIds = useSeriesExternalIdsQuery(id!, { skip: id == null });

  const trailer = useMemo(() => pickTrailer(videos.data), [videos.data]);
  const cast = useMemo(
    () => uniqueById(credits.data?.cast ?? []).slice(0, 20),
    [credits.data],
  );

  if (id == null) return <NotFoundPage />;
  if (series.isLoading) return <PageLoading label="Loading series" />;
  if (series.isError || !series.data) {
    return (
      <Container className="py-16">
        <ErrorState
          title="Series not found"
          description="We could not load this series from The Movie Database. It may have been removed, or the link may be wrong."
          onRetry={series.refetch}
        />
      </Container>
    );
  }

  const data = series.data;
  const canonicalPath = seriesPath(data.id, data.name);
  const episodeRuntime = formatRuntime(data.episode_run_time?.[0]);
  const firstAired = formatDate(data.first_air_date);

  const facts: HeroFact[] = [
    firstAired ? { label: "First aired", value: firstAired } : null,
    data.number_of_seasons
      ? {
          label: "Seasons",
          value: `${data.number_of_seasons} season${data.number_of_seasons === 1 ? "" : "s"}`,
        }
      : null,
    data.number_of_episodes
      ? { label: "Episodes", value: `${data.number_of_episodes} episodes` }
      : null,
    episodeRuntime ? { label: "Episode runtime", value: episodeRuntime } : null,
  ].filter((fact): fact is HeroFact => fact !== null);

  const latestSeason = [...(data.seasons ?? [])]
    .filter((season) => season.season_number !== 0)
    .sort((a, b) => b.season_number - a.season_number)[0];

  const topReview = reviews.data?.[0];
  const creators = data.created_by ?? [];

  return (
    <>
      <Seo
        title={data.name}
        description={seriesDescription(data)}
        canonicalPath={canonicalPath}
        image={posterUrl(data.poster_path, 780)}
        imageAlt={`${data.name} poster`}
        type="video.tv_show"
        jsonLd={[
          seriesJsonLd(data, cast),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "TV series", path: "/series" },
            { name: data.name, path: canonicalPath },
          ]),
        ]}
      />

      <MediaHero
        title={data.name}
        originalTitle={data.original_name}
        tagline={data.tagline}
        overview={data.overview}
        posterPath={data.poster_path}
        backdropPath={data.backdrop_path}
        genres={data.genres ?? []}
        facts={facts}
        voteAverage={data.vote_average}
        voteCount={data.vote_count}
        onPlayTrailer={() => setTrailerOpen(true)}
        trailerAvailable={Boolean(trailer)}
      >
        {creators.length > 0 && (
          <p className="text-sm text-gray-300">
            Created by{" "}
            {creators.map((creator, index) => (
              <span key={creator.id}>
                {index > 0 && ", "}
                <Link
                  to={`/person/${creator.id}`}
                  className="rounded font-medium text-light-blue-400 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
                >
                  {creator.name}
                </Link>
              </span>
            ))}
          </p>
        )}
      </MediaHero>

      {trailer && (
        <Modal
          open={trailerOpen}
          onClose={() => setTrailerOpen(false)}
          title={`${data.name} trailer`}
        >
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            <iframe
              src={`${youtubeEmbedUrl(trailer.key)}&autoplay=1`}
              title={`${data.name} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        </Modal>
      )}

      <Container width="full" className="py-10">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-12">
            <section aria-labelledby="cast-heading">
              <SectionHeader
                id="cast-heading"
                title="Series cast"
                count={credits.data?.cast.length}
                linkTo={`/series/${data.id}/cast`}
                linkLabel="Full cast & crew"
              />
              {credits.isLoading ? (
                <MediaGridSkeleton count={5} />
              ) : cast.length ? (
                <Carousel label={`Cast of ${data.name}`}>
                  {cast.map((actor) => (
                    <CarouselItem key={actor.credit_id} className="w-32 sm:w-36">
                      <PersonCard
                        id={actor.id}
                        name={actor.name}
                        role={actor.character}
                        profilePath={actor.profile_path}
                        size="sm"
                      />
                    </CarouselItem>
                  ))}
                </Carousel>
              ) : (
                <EmptyState title="No cast listed for this series" />
              )}
            </section>

            {latestSeason && (
              <section aria-labelledby="season-heading">
                <SectionHeader
                  id="season-heading"
                  title="Latest season"
                  linkTo={`/series/${data.id}/seasons`}
                  linkLabel="All seasons"
                />
                <Link
                  to={`/series/${data.id}/season/${latestSeason.season_number}`}
                  className="flex flex-col gap-4 rounded-lg bg-gray-900 p-4 transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400 sm:flex-row"
                >
                  <div className="w-28 shrink-0 sm:w-32">
                    <Image
                      src={posterUrl(latestSeason.poster_path, 185)}
                      srcSet={posterSrcSet(latestSeason.poster_path)}
                      sizes="128px"
                      alt={`${latestSeason.name} poster`}
                      aspect="poster"
                      className="rounded-md"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white">
                      {latestSeason.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {formatYear(latestSeason.air_date) ?? "Air date TBC"}
                      {" · "}
                      {latestSeason.episode_count} episodes
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-300">
                      {latestSeason.overview ||
                        `Season ${latestSeason.season_number} of ${data.name}.`}
                    </p>
                  </div>
                </Link>
              </section>
            )}

            <section aria-labelledby="reviews-heading">
              <SectionHeader
                id="reviews-heading"
                title="Reviews"
                count={reviews.data?.length}
                linkTo={`/series/${data.id}/reviews`}
                linkLabel="Read all reviews"
              />
              {reviews.isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : topReview ? (
                <ReviewCard review={topReview} showRating={false} />
              ) : (
                <EmptyState
                  title="No reviews yet"
                  description={`Nobody has reviewed ${data.name} on TMDB.`}
                />
              )}
            </section>

            <section aria-labelledby="media-heading">
              <SectionHeader
                id="media-heading"
                title="Media"
                linkTo={`/series/${data.id}/media`}
                linkLabel="See all media"
              />
              <MediaTabs
                videos={videos.data}
                images={images.data}
                title={data.name}
              />
            </section>

            <section aria-labelledby="recommendations-heading">
              <SectionHeader
                id="recommendations-heading"
                title="More like this"
                linkTo={`/series/${data.id}/recommendations`}
                linkLabel="See all"
              />
              {recommendations.isLoading ? (
                <MediaGridSkeleton count={5} />
              ) : recommendations.data?.length ? (
                <Carousel label={`Series similar to ${data.name}`}>
                  {recommendations.data.slice(0, 16).map((item) => (
                    <CarouselItem key={item.id}>
                      <MediaCard item={item} mediaType="tv" />
                    </CarouselItem>
                  ))}
                </Carousel>
              ) : (
                <EmptyState title="No recommendations available" />
              )}
            </section>
          </div>

          <aside
            aria-label="Series facts"
            className="w-full shrink-0 space-y-8 lg:w-72"
          >
            <div>
              <h2 className="mb-3 text-lg font-semibold text-white">
                Find {data.name} elsewhere
              </h2>
              <SocialLinks
                ids={externalIds.data}
                homepage={data.homepage}
                name={data.name}
                kind="tv"
              />
            </div>

            <FactList
              facts={[
                { label: "Original name", value: data.original_name },
                { label: "Status", value: data.status },
                { label: "Type", value: data.type },
                { label: "Network", value: data.networks?.[0]?.name ?? null },
                {
                  label: "Original language",
                  value:
                    data.spoken_languages?.find(
                      (language) => language.iso_639_1 === data.original_language,
                    )?.english_name ??
                    data.original_language?.toUpperCase() ??
                    null,
                },
              ]}
            />

            {keywords.data?.length ? (
              <div>
                <h2 className="mb-3 text-lg font-semibold text-white">
                  Keywords
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {keywords.data.map((keyword) => (
                    <li key={keyword.id}>
                      <Badge>{keyword.name}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </Container>
    </>
  );
}
