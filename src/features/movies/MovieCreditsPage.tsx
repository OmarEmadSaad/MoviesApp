import { Seo } from "@/lib/seo/Seo";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState, ErrorState, PageLoading } from "@/components/ui/states";
import { PersonRow } from "@/components/media/PersonRow";
import { SubPageHeader } from "@/components/media/SubPageHeader";
import NotFoundPage from "@/features/NotFoundPage";
import { useMovieCreditsQuery, useMovieQuery } from "@/lib/tmdb/api";
import { useNumericParam } from "@/hooks/useNumericParam";
import { moviePath } from "@/lib/slug";
import { groupBy, uniqueById } from "@/lib/format";

export default function MovieCreditsPage() {
  const id = useNumericParam();
  const movie = useMovieQuery(id!, { skip: id == null });
  const credits = useMovieCreditsQuery(id!, { skip: id == null });

  if (id == null) return <NotFoundPage />;
  if (movie.isLoading || credits.isLoading) {
    return <PageLoading label="Loading cast and crew" />;
  }
  if (movie.isError || !movie.data) {
    return (
      <Container className="py-16">
        <ErrorState title="Movie not found" onRetry={movie.refetch} />
      </Container>
    );
  }

  const cast = uniqueById(credits.data?.cast ?? []);
  const crew = credits.data?.crew ?? [];
  const crewByDepartment = groupBy(crew, (member) => member.department || "Other");
  const departments = Object.keys(crewByDepartment).sort();

  return (
    <>
      <Seo
        title={`${movie.data.title} - full cast & crew`}
        description={`Every credited cast member and crew member on ${movie.data.title}, grouped by department.`}
        canonicalPath={`/movie/${movie.data.id}/cast`}
        noindex
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Movies", path: "/movies" },
          {
            name: movie.data.title,
            path: moviePath(movie.data.id, movie.data.title),
          },
          { name: "Cast & crew", path: `/movie/${movie.data.id}/cast` },
        ])}
      />

      <SubPageHeader
        title={movie.data.title}
        subtitle="Full cast & crew"
        posterPath={movie.data.poster_path}
        date={movie.data.release_date}
        parentPath={moviePath(movie.data.id, movie.data.title)}
        parentLabel={movie.data.title}
      />

      <Container className="pb-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <section aria-labelledby="cast-heading">
            <SectionHeader id="cast-heading" title="Cast" count={cast.length} />
            {cast.length ? (
              <ul className="space-y-3">
                {cast.map((actor) => (
                  <PersonRow
                    key={actor.credit_id}
                    id={actor.id}
                    name={actor.name}
                    role={actor.character}
                    profilePath={actor.profile_path}
                  />
                ))}
              </ul>
            ) : (
              <EmptyState title="No cast records available" />
            )}
          </section>

          <section aria-labelledby="crew-heading">
            <SectionHeader id="crew-heading" title="Crew" count={crew.length} />
            {departments.length ? (
              <div className="space-y-8">
                {departments.map((department) => (
                  <div key={department}>
                    <h3 className="mb-3 text-lg font-semibold text-light-blue-400">
                      {department}{" "}
                      <span className="text-sm text-gray-400">
                        ({crewByDepartment[department].length})
                      </span>
                    </h3>
                    <ul className="space-y-3">
                      {crewByDepartment[department].map((member) => (
                        <PersonRow
                          key={member.credit_id}
                          id={member.id}
                          name={member.name}
                          role={member.job}
                          profilePath={member.profile_path}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No crew records available" />
            )}
          </section>
        </div>
      </Container>
    </>
  );
}
