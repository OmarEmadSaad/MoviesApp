import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/lib/seo/Seo";
import { breadcrumbJsonLd, movieJsonLd } from "@/lib/seo/jsonld";
import { movieDescription } from "@/lib/seo/descriptions";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Carousel, CarouselItem } from "@/components/ui/Carousel";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
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
  useCollectionQuery,
  useMovieCreditsQuery,
  useMovieExternalIdsQuery,
  useMovieImagesQuery,
  useMovieKeywordsQuery,
  useMovieQuery,
  useMovieRecommendationsQuery,
  useMovieReviewsQuery,
  useMovieVideosQuery,
} from "@/lib/tmdb/api";
import { useNumericParam } from "@/hooks/useNumericParam";
import { moviePath } from "@/lib/slug";
import { posterUrl, youtubeEmbedUrl } from "@/lib/tmdb/images";
import {
  formatCurrency,
  formatDate,
  formatRuntime,
  uniqueById,
} from "@/lib/format";
import { pickTrailer } from "./trailer";

export default function MovieDetailsPage() {
  const id = useNumericParam();
  const [trailerOpen, setTrailerOpen] = useState(false);

  const movie = useMovieQuery(id!, { skip: id == null });
  const credits = useMovieCreditsQuery(id!, { skip: id == null });
  const videos = useMovieVideosQuery(id!, { skip: id == null });
  const images = useMovieImagesQuery(id!, { skip: id == null });
  const keywords = useMovieKeywordsQuery(id!, { skip: id == null });
  const reviews = useMovieReviewsQuery(id!, { skip: id == null });
  const recommendations = useMovieRecommendationsQuery(id!, { skip: id == null });
  const externalIds = useMovieExternalIdsQuery(id!, { skip: id == null });

  const collectionId = movie.data?.belongs_to_collection?.id;
  const collection = useCollectionQuery(collectionId!, {
    skip: collectionId == null,
  });

  const trailer = useMemo(() => pickTrailer(videos.data), [videos.data]);
  const cast = useMemo(
    () => uniqueById(credits.data?.cast ?? []).slice(0, 20),
    [credits.data],
  );
  const director = credits.data?.crew.find((member) => member.job === "Director");

  if (id == null) return <NotFoundPage />;
  if (movie.isLoading) return <PageLoading label="Loading movie" />;
  if (movie.isError || !movie.data) {
    return (
      <Container className="py-16">
        <ErrorState
          title="Movie not found"
          description="We could not load this film from The Movie Database. It may have been removed, or the link may be wrong."
          onRetry={movie.refetch}
        />
      </Container>
    );
  }

  const data = movie.data;
  const canonicalPath = moviePath(data.id, data.title);
  const runtime = formatRuntime(data.runtime);
  const released = formatDate(data.release_date);

  const facts: HeroFact[] = [
    released ? { label: "Released", value: released } : null,
    runtime ? { label: "Runtime", value: runtime } : null,
    data.original_language
      ? { label: "Language", value: data.original_language.toUpperCase() }
      : null,
    data.status ? { label: "Status", value: data.status } : null,
  ].filter((fact): fact is HeroFact => fact !== null);

  const topReview = reviews.data?.[0];

  return (
    <>
      <Seo
        title={data.title}
        description={movieDescription(data, director?.name)}
        canonicalPath={canonicalPath}
        image={posterUrl(data.poster_path, 780)}
        imageAlt={`${data.title} poster`}
        type="video.movie"
        jsonLd={[
          movieJsonLd(data, cast, credits.data?.crew ?? []),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Movies", path: "/movies" },
            { name: data.title, path: canonicalPath },
          ]),
        ]}
      />

      <MediaHero
        title={data.title}
        originalTitle={data.original_title}
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
        {director && (
          <p className="text-sm text-gray-300">
            Directed by{" "}
            <Link
              to={`/person/${director.id}`}
              className="rounded font-medium text-light-blue-400 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
            >
              {director.name}
            </Link>
          </p>
        )}
      </MediaHero>

      {trailer && (
        <Modal
          open={trailerOpen}
          onClose={() => setTrailerOpen(false)}
          title={`${data.title} trailer`}
        >
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            <iframe
              src={`${youtubeEmbedUrl(trailer.key)}&autoplay=1`}
              title={`${data.title} trailer`}
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
                title="Top billed cast"
                count={credits.data?.cast.length}
                linkTo={`/movie/${data.id}/cast`}
                linkLabel="Full cast & crew"
              />
              {credits.isLoading ? (
                <MediaGridSkeleton count={5} />
              ) : cast.length ? (
                <Carousel label={`Cast of ${data.title}`}>
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
                <EmptyState title="No cast listed for this film" />
              )}
            </section>

            <section aria-labelledby="reviews-heading">
              <SectionHeader
                id="reviews-heading"
                title="Reviews"
                count={reviews.data?.length}
                linkTo={`/movie/${data.id}/reviews`}
                linkLabel="Read all reviews"
              />
              {reviews.isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : topReview ? (
                <ReviewCard review={topReview} showRating={false} />
              ) : (
                <EmptyState
                  title="No reviews yet"
                  description={`Nobody has reviewed ${data.title} on TMDB.`}
                />
              )}
            </section>

            <section aria-labelledby="media-heading">
              <SectionHeader id="media-heading" title="Media" />
              <MediaTabs
                videos={videos.data}
                images={images.data}
                title={data.title}
              />
            </section>

            {collection.data && (
              <section aria-labelledby="collection-heading">
                <SectionHeader
                  id="collection-heading"
                  title={collection.data.name}
                  linkTo={`/movie/${data.id}/collection/${collection.data.id}`}
                  linkLabel="View the collection"
                />
                <p className="mb-4 text-sm text-gray-300">
                  {data.title} is part of a {collection.data.parts.length}-film
                  series.
                </p>
                <ol className="space-y-1 text-sm text-gray-300">
                  {collection.data.parts.map((part, index) => (
                    <li key={part.id}>
                      <span className="text-light-blue-400">{index + 1}.</span>{" "}
                      <Link
                        to={moviePath(part.id, part.title)}
                        className="rounded underline-offset-4 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
                      >
                        {part.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section aria-labelledby="recommendations-heading">
              <SectionHeader
                id="recommendations-heading"
                title="More like this"
              />
              {recommendations.isLoading ? (
                <MediaGridSkeleton count={5} />
              ) : recommendations.data?.length ? (
                <Carousel label={`Movies similar to ${data.title}`}>
                  {recommendations.data.slice(0, 16).map((item) => (
                    <CarouselItem key={item.id}>
                      <MediaCard item={item} mediaType="movie" />
                    </CarouselItem>
                  ))}
                </Carousel>
              ) : (
                <EmptyState title="No recommendations available" />
              )}
            </section>
          </div>

          <aside
            aria-label="Movie facts"
            className="w-full shrink-0 space-y-8 lg:w-72"
          >
            <div>
              <h2 className="mb-3 text-lg font-semibold text-white">
                Find {data.title} elsewhere
              </h2>
              <SocialLinks
                ids={externalIds.data}
                homepage={data.homepage}
                name={data.title}
                kind="movie"
              />
            </div>

            <FactList
              facts={[
                { label: "Status", value: data.status },
                {
                  label: "Original language",
                  value: data.spoken_languages?.[0]?.english_name ?? null,
                },
                { label: "Budget", value: formatCurrency(data.budget) },
                { label: "Revenue", value: formatCurrency(data.revenue) },
                {
                  label: "Production",
                  value:
                    data.production_companies
                      ?.slice(0, 3)
                      .map((company) => company.name)
                      .join(", ") || null,
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
