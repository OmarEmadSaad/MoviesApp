import { formatRuntime, formatYear, truncate } from "@/lib/format";
import type { MovieDetails, PersonDetails, SeriesDetails } from "@/types/tmdb";

const MAX = 155;

function compose(lead: string, body: string | null | undefined): string {
  if (!body) return truncate(lead, MAX);
  const combined = `${lead} ${body}`;
  return truncate(combined, MAX);
}

export function movieDescription(
  movie: MovieDetails,
  directorName?: string | null,
): string {
  const year = formatYear(movie.release_date);
  const genres = movie.genres?.slice(0, 2).map((g) => g.name).join(", ");
  const runtime = formatRuntime(movie.runtime);

  const facts = [
    year,
    genres,
    runtime,
    directorName ? `directed by ${directorName}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const lead = facts ? `${movie.title} (${facts}).` : `${movie.title}.`;
  return compose(lead, movie.overview);
}

export function seriesDescription(series: SeriesDetails): string {
  const year = formatYear(series.first_air_date);
  const genres = series.genres?.slice(0, 2).map((g) => g.name).join(", ");
  const seasons = series.number_of_seasons
    ? `${series.number_of_seasons} season${series.number_of_seasons === 1 ? "" : "s"}`
    : null;

  const facts = [year, genres, seasons].filter(Boolean).join(" · ");
  const lead = facts ? `${series.name} (${facts}).` : `${series.name}.`;
  return compose(lead, series.overview);
}

export function personDescription(person: PersonDetails): string {
  const role = person.known_for_department
    ? person.known_for_department.toLowerCase()
    : null;
  const born = person.place_of_birth ? `born in ${person.place_of_birth}` : null;
  const facts = [role, born].filter(Boolean).join(", ");
  const lead = facts ? `${person.name} — ${facts}.` : `${person.name}.`;
  return compose(lead, person.biography);
}
