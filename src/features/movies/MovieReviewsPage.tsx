import { Seo } from "@/lib/seo/Seo";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { Container } from "@/components/ui/Container";
import { EmptyState, ErrorState, PageLoading } from "@/components/ui/states";
import { ReviewCard } from "@/components/media/ReviewCard";
import { SubPageHeader } from "@/components/media/SubPageHeader";
import NotFoundPage from "@/features/NotFoundPage";
import { useMovieQuery, useMovieReviewsQuery } from "@/lib/tmdb/api";
import { useNumericParam } from "@/hooks/useNumericParam";
import { moviePath } from "@/lib/slug";

export default function MovieReviewsPage() {
  const id = useNumericParam();
  const movie = useMovieQuery(id!, { skip: id == null });
  const reviews = useMovieReviewsQuery(id!, { skip: id == null });

  if (id == null) return <NotFoundPage />;
  if (movie.isLoading) return <PageLoading label="Loading reviews" />;
  if (movie.isError || !movie.data) {
    return (
      <Container className="py-16">
        <ErrorState title="Movie not found" onRetry={movie.refetch} />
      </Container>
    );
  }

  const list = reviews.data ?? [];

  return (
    <>
      <Seo
        title={`${movie.data.title} - reviews`}
        description={`Read all ${list.length || ""} user reviews of ${movie.data.title} from The Movie Database community.`.replace(
          "  ",
          " ",
        )}
        canonicalPath={`/movie/${movie.data.id}/reviews`}
        noindex
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Movies", path: "/movies" },
          {
            name: movie.data.title,
            path: moviePath(movie.data.id, movie.data.title),
          },
          { name: "Reviews", path: `/movie/${movie.data.id}/reviews` },
        ])}
      />

      <SubPageHeader
        title={movie.data.title}
        subtitle={`Reviews (${list.length})`}
        posterPath={movie.data.poster_path}
        date={movie.data.release_date}
        parentPath={moviePath(movie.data.id, movie.data.title)}
        parentLabel={movie.data.title}
      />

      <Container className="pb-12">
        <h2 className="sr-only">User reviews</h2>
        {reviews.isLoading ? (
          <PageLoading label="Loading reviews" />
        ) : reviews.isError ? (
          <ErrorState onRetry={reviews.refetch} />
        ) : list.length ? (
          <ul className="space-y-6">
            {list.map((review) => (
              <li key={review.id}>
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No reviews yet"
            description={`Nobody has reviewed ${movie.data.title} on TMDB.`}
          />
        )}
      </Container>
    </>
  );
}
