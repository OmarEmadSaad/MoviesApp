import { useMemo } from "react";
import { Seo } from "@/lib/seo/Seo";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/seo/jsonld";
import { personDescription } from "@/lib/seo/descriptions";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Image } from "@/components/ui/Image";
import { EmptyState, ErrorState, PageLoading } from "@/components/ui/states";
import { MediaGrid } from "@/components/media/MediaGrid";
import { SocialLinks } from "@/components/media/SocialLinks";
import { FactList } from "@/components/media/FactList";
import NotFoundPage from "@/features/NotFoundPage";
import {
  usePersonCreditsQuery,
  usePersonExternalIdsQuery,
  usePersonQuery,
} from "@/lib/tmdb/api";
import { useNumericParam } from "@/hooks/useNumericParam";
import { personPath } from "@/lib/slug";
import { profileSrcSet, profileUrl } from "@/lib/tmdb/images";
import { formatDate, formatGender, uniqueById } from "@/lib/format";
import type { MediaSummary } from "@/types/tmdb";

const CREDITS_SHOWN = 12;

export default function PersonPage() {
  const id = useNumericParam();

  const person = usePersonQuery(id!, { skip: id == null });
  const credits = usePersonCreditsQuery(id!, { skip: id == null });
  const externalIds = usePersonExternalIdsQuery(id!, { skip: id == null });

  const { movies, series } = useMemo(() => {
    const cast = uniqueById(credits.data?.cast ?? []);

    const byPopularity = (a: MediaSummary, b: MediaSummary) =>
      (b.popularity ?? 0) - (a.popularity ?? 0);
    return {
      movies: cast
        .filter((credit) => credit.media_type === "movie")
        .sort(byPopularity),
      series: cast
        .filter((credit) => credit.media_type === "tv")
        .sort(byPopularity),
    };
  }, [credits.data]);

  if (id == null) return <NotFoundPage />;
  if (person.isLoading) return <PageLoading label="Loading profile" />;
  if (person.isError || !person.data) {
    return (
      <Container className="py-16">
        <ErrorState
          title="Person not found"
          description="We could not load this profile from The Movie Database."
          onRetry={person.refetch}
        />
      </Container>
    );
  }

  const data = person.data;
  const canonicalPath = personPath(data.id, data.name);
  const knownCredits = (credits.data?.cast.length ?? 0) + (credits.data?.crew.length ?? 0);

  return (
    <>
      <Seo
        title={data.name}
        description={personDescription(data)}
        canonicalPath={canonicalPath}
        image={profileUrl(data.profile_path, 632)}
        imageAlt={`Photo of ${data.name}`}
        type="profile"
        jsonLd={[
          personJsonLd(data),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: data.name, path: canonicalPath },
          ]),
        ]}
      />

      <Container width="full" className="animate-fade-in-up py-10">
        <div className="flex flex-col gap-10 lg:flex-row">
          <aside className="w-full shrink-0 space-y-6 lg:w-72">
            <div className="mx-auto w-56 lg:w-full">
              <Image
                src={profileUrl(data.profile_path, 632)}
                srcSet={profileSrcSet(data.profile_path)}
                sizes="(min-width: 1024px) 288px, 224px"
                alt={`Photo of ${data.name}`}
                aspect="profile"
                priority
                className="rounded-xl shadow-lg"
              />
            </div>

            <SocialLinks
              ids={externalIds.data}
              homepage={data.homepage}
              name={data.name}
              kind="person"
            />

            <div>
              <h2 className="mb-3 text-lg font-semibold text-white">
                Personal info
              </h2>
              <FactList
                facts={[
                  { label: "Known for", value: data.known_for_department },
                  {
                    label: "Known credits",
                    value: knownCredits > 0 ? knownCredits : null,
                  },
                  { label: "Gender", value: formatGender(data.gender) },
                  { label: "Born", value: formatDate(data.birthday) },
                  { label: "Died", value: formatDate(data.deathday) },
                  { label: "Place of birth", value: data.place_of_birth },
                  {
                    label: "Also known as",
                    value: data.also_known_as?.length ? (
                      <span className="flex flex-col gap-0.5">
                        {data.also_known_as.slice(0, 6).map((alias) => (
                          <span key={alias}>{alias}</span>
                        ))}
                      </span>
                    ) : null,
                  },
                ]}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-12">
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                {data.name}
              </h1>
              <h2 className="mb-2 mt-6 text-xl font-semibold text-light-blue-400">
                Biography
              </h2>
              {data.biography ? (
                <p className="max-w-prose whitespace-pre-line text-sm leading-relaxed text-gray-200">
                  {data.biography}
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  No biography has been written for {data.name} on TMDB yet.
                </p>
              )}
            </div>

            <section aria-labelledby="film-credits">
              <SectionHeader
                id="film-credits"
                title="Film credits"
                count={movies.length}
              />
              {credits.isLoading ? (
                <PageLoading label="Loading credits" />
              ) : movies.length ? (
                <MediaGrid
                  label={`Films featuring ${data.name}`}
                  items={movies.slice(0, CREDITS_SHOWN)}
                  mediaType="movie"
                />
              ) : (
                <EmptyState title={`No film credits listed for ${data.name}`} />
              )}
            </section>

            <section aria-labelledby="tv-credits">
              <SectionHeader
                id="tv-credits"
                title="TV credits"
                count={series.length}
              />
              {credits.isLoading ? (
                <PageLoading label="Loading credits" />
              ) : series.length ? (
                <MediaGrid
                  label={`TV series featuring ${data.name}`}
                  items={series.slice(0, CREDITS_SHOWN)}
                  mediaType="tv"
                />
              ) : (
                <EmptyState title={`No TV credits listed for ${data.name}`} />
              )}
            </section>
          </div>
        </div>
      </Container>
    </>
  );
}
