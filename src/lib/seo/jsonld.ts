import { backdropUrl, posterUrl, profileUrl } from "@/lib/tmdb/images";
import { getSiteUrl } from "@/lib/tmdb/config";
import { toIsoDuration } from "@/lib/format";
import { moviePath, personPath, seriesPath } from "@/lib/slug";
import type {
  CastMember,
  CrewMember,
  MovieDetails,
  PersonDetails,
  SeriesDetails,
} from "@/types/tmdb";

type JsonLd = Record<string, unknown>;

const site = () => getSiteUrl();

function absolute(path: string): string {
  return `${site()}${path}`;
}

function aggregateRating(voteAverage: number, voteCount: number) {
  if (!voteCount || voteAverage <= 0) return undefined;
  return {
    "@type": "AggregateRating",
    ratingValue: Number(voteAverage.toFixed(1)),
    bestRating: 10,
    worstRating: 0,
    ratingCount: voteCount,
  };
}

function people(members: (CastMember | CrewMember)[], limit = 10) {
  return members.slice(0, limit).map((member) => ({
    "@type": "Person",
    name: member.name,
    url: absolute(personPath(member.id, member.name)),
    ...(member.profile_path
      ? { image: profileUrl(member.profile_path, 185) }
      : {}),
  }));
}

export function movieJsonLd(
  movie: MovieDetails,
  cast: CastMember[] = [],
  crew: CrewMember[] = [],
): JsonLd {
  const directors = crew.filter((member) => member.job === "Director");
  const writers = crew.filter((member) =>
    ["Writer", "Screenplay", "Story"].includes(member.job),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    ...(movie.original_title && movie.original_title !== movie.title
      ? { alternateName: movie.original_title }
      : {}),
    url: absolute(moviePath(movie.id, movie.title)),
    ...(movie.overview ? { description: movie.overview } : {}),
    ...(movie.poster_path ? { image: posterUrl(movie.poster_path, 780) } : {}),
    ...(movie.release_date ? { datePublished: movie.release_date } : {}),
    ...(movie.genres?.length
      ? { genre: movie.genres.map((genre) => genre.name) }
      : {}),
    ...(movie.runtime ? { duration: toIsoDuration(movie.runtime) } : {}),
    ...(movie.original_language ? { inLanguage: movie.original_language } : {}),
    ...(directors.length ? { director: people(directors, 5) } : {}),
    ...(writers.length ? { author: people(writers, 5) } : {}),
    ...(cast.length ? { actor: people(cast, 10) } : {}),
    ...(movie.production_companies?.length
      ? {
          productionCompany: movie.production_companies.map((company) => ({
            "@type": "Organization",
            name: company.name,
          })),
        }
      : {}),
    ...(aggregateRating(movie.vote_average, movie.vote_count)
      ? { aggregateRating: aggregateRating(movie.vote_average, movie.vote_count) }
      : {}),
  };
}

export function seriesJsonLd(
  series: SeriesDetails,
  cast: CastMember[] = [],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: series.name,
    ...(series.original_name && series.original_name !== series.name
      ? { alternateName: series.original_name }
      : {}),
    url: absolute(seriesPath(series.id, series.name)),
    ...(series.overview ? { description: series.overview } : {}),
    ...(series.poster_path ? { image: posterUrl(series.poster_path, 780) } : {}),
    ...(series.first_air_date ? { startDate: series.first_air_date } : {}),
    ...(series.last_air_date && !series.in_production
      ? { endDate: series.last_air_date }
      : {}),
    ...(series.genres?.length
      ? { genre: series.genres.map((genre) => genre.name) }
      : {}),
    ...(series.number_of_seasons
      ? { numberOfSeasons: series.number_of_seasons }
      : {}),
    ...(series.number_of_episodes
      ? { numberOfEpisodes: series.number_of_episodes }
      : {}),
    ...(series.original_language ? { inLanguage: series.original_language } : {}),
    ...(series.created_by?.length
      ? {
          creator: series.created_by.map((creator) => ({
            "@type": "Person",
            name: creator.name,
            url: absolute(personPath(creator.id, creator.name)),
          })),
        }
      : {}),
    ...(series.networks?.length
      ? {
          productionCompany: series.networks.map((network) => ({
            "@type": "Organization",
            name: network.name,
          })),
        }
      : {}),
    ...(cast.length ? { actor: people(cast, 10) } : {}),
    ...(aggregateRating(series.vote_average, series.vote_count)
      ? {
          aggregateRating: aggregateRating(
            series.vote_average,
            series.vote_count,
          ),
        }
      : {}),
  };
}

export function personJsonLd(person: PersonDetails): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    url: absolute(personPath(person.id, person.name)),
    ...(person.biography ? { description: person.biography } : {}),
    ...(person.profile_path
      ? { image: profileUrl(person.profile_path, 632) }
      : {}),
    ...(person.birthday ? { birthDate: person.birthday } : {}),
    ...(person.deathday ? { deathDate: person.deathday } : {}),
    ...(person.place_of_birth ? { birthPlace: person.place_of_birth } : {}),
    ...(person.known_for_department
      ? { jobTitle: person.known_for_department }
      : {}),
    ...(person.also_known_as?.length
      ? { alternateName: person.also_known_as }
      : {}),
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}

export function itemListJsonLd(
  name: string,
  items: { id: number; title: string; path: string; image: string | null }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absolute(item.path),
      name: item.title,
      ...(item.image ? { image: item.image } : {}),
    })),
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "React Movies",
    url: site(),
    description:
      "Browse movies and TV series, with cast, crew, trailers, reviews and ratings sourced from The Movie Database.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site()}/search/movies/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export { backdropUrl };
