import { Link } from "react-router-dom";
import { Seo } from "@/lib/seo/Seo";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { Container } from "@/components/ui/Container";
import { Image } from "@/components/ui/Image";
import { EmptyState, ErrorState, PageLoading } from "@/components/ui/states";
import { SubPageHeader } from "@/components/media/SubPageHeader";
import NotFoundPage from "@/features/NotFoundPage";
import { useSeriesQuery } from "@/lib/tmdb/api";
import { useNumericParam } from "@/hooks/useNumericParam";
import { seriesPath } from "@/lib/slug";
import { posterSrcSet, posterUrl } from "@/lib/tmdb/images";
import { formatYear } from "@/lib/format";

export default function SeasonsPage() {
  const id = useNumericParam();
  const series = useSeriesQuery(id!, { skip: id == null });

  if (id == null) return <NotFoundPage />;
  if (series.isLoading) return <PageLoading label="Loading seasons" />;
  if (series.isError || !series.data) {
    return (
      <Container className="py-16">
        <ErrorState title="Series not found" onRetry={series.refetch} />
      </Container>
    );
  }

  const data = series.data;
  const seasons = [...(data.seasons ?? [])].sort(
    (a, b) => b.season_number - a.season_number,
  );

  return (
    <>
      <Seo
        title={`${data.name} - seasons`}
        description={`All ${seasons.length} seasons of ${data.name}, with episode counts, air dates and synopses.`}
        canonicalPath={`/series/${data.id}/seasons`}
        image={posterUrl(data.poster_path, 780)}
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "TV series", path: "/series" },
          { name: data.name, path: seriesPath(data.id, data.name) },
          { name: "Seasons", path: `/series/${data.id}/seasons` },
        ])}
      />

      <SubPageHeader
        title={data.name}
        subtitle={`${seasons.length} seasons`}
        posterPath={data.poster_path}
        date={data.first_air_date}
        parentPath={seriesPath(data.id, data.name)}
        parentLabel={data.name}
      />

      <Container className="pb-12">
        <h2 className="sr-only">Seasons</h2>
        {seasons.length ? (
          <ul className="space-y-4">
            {seasons.map((season) => (
              <li key={season.id}>
                <Link
                  to={`/series/${data.id}/season/${season.season_number}`}
                  className="flex flex-col gap-4 rounded-lg bg-gray-900 p-4 transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400 sm:flex-row"
                >
                  <div className="w-24 shrink-0 sm:w-32">
                    <Image
                      src={posterUrl(season.poster_path, 185)}
                      srcSet={posterSrcSet(season.poster_path)}
                      sizes="128px"
                      alt={`${season.name} poster`}
                      aspect="poster"
                      className="rounded-md"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white">
                      {season.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {formatYear(season.air_date) ?? "Air date TBC"}
                      {" \u00b7 "}
                      {season.episode_count} episodes
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-300">
                      {season.overview ||
                        `Season ${season.season_number} of ${data.name}.`}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No seasons listed for this series" />
        )}
      </Container>
    </>
  );
}
