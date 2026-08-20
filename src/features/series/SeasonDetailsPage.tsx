import { Seo } from "@/lib/seo/Seo";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { Container } from "@/components/ui/Container";
import { Image } from "@/components/ui/Image";
import { Rating } from "@/components/ui/Rating";
import { EmptyState, ErrorState, PageLoading } from "@/components/ui/states";
import { SubPageHeader } from "@/components/media/SubPageHeader";
import NotFoundPage from "@/features/NotFoundPage";
import { useSeasonQuery, useSeriesQuery } from "@/lib/tmdb/api";
import { useNumericParam } from "@/hooks/useNumericParam";
import { seriesPath } from "@/lib/slug";
import { posterUrl, stillUrl } from "@/lib/tmdb/images";
import { formatDate, formatRuntime, truncate } from "@/lib/format";


export default function SeasonDetailsPage() {
  const id = useNumericParam("id");
  const seasonNumber = useNumericParam("seasonNumber", { allowZero: true });

  const series = useSeriesQuery(id!, { skip: id == null });
  const season = useSeasonQuery(
    { seriesId: id!, seasonNumber: seasonNumber! },
    { skip: id == null || seasonNumber == null },
  );

  if (id == null || seasonNumber == null) return <NotFoundPage />;
  if (series.isLoading || season.isLoading) {
    return <PageLoading label="Loading season" />;
  }
  if (season.isError || !season.data || !series.data) {
    return (
      <Container className="py-16">
        <ErrorState title="Season not found" onRetry={season.refetch} />
      </Container>
    );
  }

  const show = series.data;
  const data = season.data;
  const canonicalPath = `/series/${show.id}/season/${seasonNumber}`;
  const description =
    data.overview ||
    `${data.name} of ${show.name} has ${data.episodes?.length ?? 0} episodes.`;

  return (
    <>
      <Seo
        title={`${show.name} - ${data.name}`}
        description={truncate(description, 155)}
        canonicalPath={canonicalPath}
        image={posterUrl(data.poster_path ?? show.poster_path, 780)}
        type="video.tv_show"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "TV series", path: "/series" },
          { name: show.name, path: seriesPath(show.id, show.name) },
          { name: "Seasons", path: `/series/${show.id}/seasons` },
          { name: data.name, path: canonicalPath },
        ])}
      />

      <SubPageHeader
        title={`${show.name} - ${data.name}`}
        subtitle={`${data.episodes?.length ?? 0} episodes`}
        posterPath={data.poster_path ?? show.poster_path}
        date={data.air_date}
        parentPath={`/series/${show.id}/seasons`}
        parentLabel="all seasons"
      />

      <Container className="pb-12">
        {data.overview && (
          <p className="mb-8 max-w-prose text-sm leading-relaxed text-gray-300">
            {data.overview}
          </p>
        )}

        <h2 className="mb-4 text-xl font-bold text-light-blue-600">Episodes</h2>
        {data.episodes?.length ? (
          <ol className="space-y-4">
            {data.episodes.map((episode) => (
              <li
                key={episode.id}
                className="flex flex-col gap-4 rounded-lg bg-gray-900 p-4 sm:flex-row"
              >
                <div className="w-full shrink-0 sm:w-56">
                  <Image
                    src={stillUrl(episode.still_path)}
                    alt={`Still from ${episode.name}`}
                    aspect="still"
                    className="rounded-md"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-white">
                    <span className="text-light-blue-400">
                      {episode.episode_number}.
                    </span>{" "}
                    {episode.name}
                  </h3>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                    {episode.air_date && (
                      <time dateTime={episode.air_date}>
                        {formatDate(episode.air_date)}
                      </time>
                    )}
                    {formatRuntime(episode.runtime) && (
                      <span>{formatRuntime(episode.runtime)}</span>
                    )}
                    <Rating value={episode.vote_average} size="sm" />
                  </p>
                  {episode.overview && (
                    <p className="mt-2 text-sm leading-relaxed text-gray-300">
                      {episode.overview}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState title="No episodes listed for this season" />
        )}
      </Container>
    </>
  );
}
