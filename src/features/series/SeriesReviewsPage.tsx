import { Seo } from "@/lib/seo/Seo";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { Container } from "@/components/ui/Container";
import { EmptyState, ErrorState, PageLoading } from "@/components/ui/states";
import { ReviewCard } from "@/components/media/ReviewCard";
import { SubPageHeader } from "@/components/media/SubPageHeader";
import NotFoundPage from "@/features/NotFoundPage";
import { useSeriesQuery, useSeriesReviewsQuery } from "@/lib/tmdb/api";
import { useNumericParam } from "@/hooks/useNumericParam";
import { seriesPath } from "@/lib/slug";

export default function SeriesReviewsPage() {
  const id = useNumericParam();
  const series = useSeriesQuery(id!, { skip: id == null });
  const reviews = useSeriesReviewsQuery(id!, { skip: id == null });

  if (id == null) return <NotFoundPage />;
  if (series.isLoading) return <PageLoading label="Loading reviews" />;
  if (series.isError || !series.data) {
    return (
      <Container className="py-16">
        <ErrorState title="Series not found" onRetry={series.refetch} />
      </Container>
    );
  }

  const list = reviews.data ?? [];

  return (
    <>
      <Seo
        title={`${series.data.name} - reviews`}
        description={`Read user reviews of ${series.data.name} from The Movie Database community.`}
        canonicalPath={`/series/${series.data.id}/reviews`}
        noindex
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "TV series", path: "/series" },
          {
            name: series.data.name,
            path: seriesPath(series.data.id, series.data.name),
          },
          { name: "Reviews", path: `/series/${series.data.id}/reviews` },
        ])}
      />

      <SubPageHeader
        title={series.data.name}
        subtitle={`Reviews (${list.length})`}
        posterPath={series.data.poster_path}
        date={series.data.first_air_date}
        parentPath={seriesPath(series.data.id, series.data.name)}
        parentLabel={series.data.name}
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
            description={`Nobody has reviewed ${series.data.name} on TMDB.`}
          />
        )}
      </Container>
    </>
  );
}
