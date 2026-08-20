import { Seo } from "@/lib/seo/Seo";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import { Container } from "@/components/ui/Container";
import { MediaGrid } from "@/components/media/MediaGrid";
import { SubPageHeader } from "@/components/media/SubPageHeader";
import { ErrorState, PageLoading } from "@/components/ui/states";
import NotFoundPage from "@/features/NotFoundPage";
import { useSeriesQuery, useSeriesRecommendationsQuery } from "@/lib/tmdb/api";
import { useNumericParam } from "@/hooks/useNumericParam";
import { seriesPath } from "@/lib/slug";
import { posterUrl } from "@/lib/tmdb/images";

export default function SeriesRecommendationsPage() {
  const id = useNumericParam();
  const series = useSeriesQuery(id!, { skip: id == null });
  const recommendations = useSeriesRecommendationsQuery(id!, { skip: id == null });

  if (id == null) return <NotFoundPage />;
  if (series.isLoading) return <PageLoading label="Loading recommendations" />;
  if (series.isError || !series.data) {
    return (
      <Container className="py-16">
        <ErrorState title="Series not found" onRetry={series.refetch} />
      </Container>
    );
  }

  const data = series.data;
  const items = recommendations.data ?? [];
  const canonicalPath = `/series/${data.id}/recommendations`;

  return (
    <>
      <Seo
        title={`Series like ${data.name}`}
        description={`TV series recommended for viewers of ${data.name}, ranked by The Movie Database.`}
        canonicalPath={canonicalPath}
        image={posterUrl(data.poster_path, 780)}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "TV series", path: "/series" },
            { name: data.name, path: seriesPath(data.id, data.name) },
            { name: "Recommendations", path: canonicalPath },
          ]),
          itemListJsonLd(
            `Series like ${data.name}`,
            items.map((item) => ({
              id: item.id,
              title: item.name ?? "",
              path: seriesPath(item.id, item.name),
              image: posterUrl(item.poster_path, 342),
            })),
          ),
        ]}
      />

      <SubPageHeader
        title={data.name}
        subtitle="Recommendations"
        posterPath={data.poster_path}
        date={data.first_air_date}
        parentPath={seriesPath(data.id, data.name)}
        parentLabel={data.name}
      />

      <Container width="full" className="pb-12">
        <h2 className="mb-4 text-xl font-bold text-light-blue-600">
          If you like {data.name}
        </h2>
        <MediaGrid
          label={`Series like ${data.name}`}
          items={items}
          mediaType="tv"
          isLoading={recommendations.isLoading}
          isError={recommendations.isError}
          onRetry={recommendations.refetch}
          showOverview
          emptyTitle="No recommendations available"
          emptyDescription={`TMDB has not suggested anything alongside ${data.name} yet.`}
        />
      </Container>
    </>
  );
}
