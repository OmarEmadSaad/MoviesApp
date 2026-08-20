import { Seo } from "@/lib/seo/Seo";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { Container } from "@/components/ui/Container";
import { ErrorState, PageLoading } from "@/components/ui/states";
import { MediaTabs } from "@/components/media/MediaTabs";
import { SubPageHeader } from "@/components/media/SubPageHeader";
import NotFoundPage from "@/features/NotFoundPage";
import {
  useSeriesImagesQuery,
  useSeriesQuery,
  useSeriesVideosQuery,
} from "@/lib/tmdb/api";
import { useNumericParam } from "@/hooks/useNumericParam";
import { seriesPath } from "@/lib/slug";

export default function SeriesMediaPage() {
  const id = useNumericParam();
  const series = useSeriesQuery(id!, { skip: id == null });
  const videos = useSeriesVideosQuery(id!, { skip: id == null });
  const images = useSeriesImagesQuery(id!, { skip: id == null });

  if (id == null) return <NotFoundPage />;
  if (series.isLoading) return <PageLoading label="Loading media" />;
  if (series.isError || !series.data) {
    return (
      <Container className="py-16">
        <ErrorState title="Series not found" onRetry={series.refetch} />
      </Container>
    );
  }

  return (
    <>
      <Seo
        title={`${series.data.name} - videos and images`}
        description={`Trailers, clips, backdrops and poster artwork for ${series.data.name}.`}
        canonicalPath={`/series/${series.data.id}/media`}
        noindex
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "TV series", path: "/series" },
          {
            name: series.data.name,
            path: seriesPath(series.data.id, series.data.name),
          },
          { name: "Media", path: `/series/${series.data.id}/media` },
        ])}
      />

      <SubPageHeader
        title={series.data.name}
        subtitle="Videos and images"
        posterPath={series.data.poster_path}
        date={series.data.first_air_date}
        parentPath={seriesPath(series.data.id, series.data.name)}
        parentLabel={series.data.name}
      />

      <Container className="pb-12">
        <h2 className="sr-only">Media</h2>
        <MediaTabs
          videos={videos.data}
          images={images.data}
          title={series.data.name}
        />
      </Container>
    </>
  );
}
