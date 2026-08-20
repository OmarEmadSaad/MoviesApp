import { Link } from "react-router-dom";
import { FaCirclePlay } from "react-icons/fa6";
import { Image } from "@/components/ui/Image";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { backdropSrcSet, backdropUrl, posterSrcSet, posterUrl } from "@/lib/tmdb/images";
import { formatRating } from "@/lib/format";
import type { Genre } from "@/types/tmdb";

export interface HeroFact {
  label: string;
  value: string;
}

export interface MediaHeroProps {
  title: string;
  originalTitle?: string | null;
  tagline?: string | null;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  genres: Genre[];

  facts: HeroFact[];
  voteAverage: number;
  voteCount: number;

  genreHref?: (genre: Genre) => string;
  onPlayTrailer?: () => void;
  trailerAvailable?: boolean;
  children?: React.ReactNode;
}


export function MediaHero({
  title,
  originalTitle,
  tagline,
  overview,
  posterPath,
  backdropPath,
  genres,
  facts,
  voteAverage,
  voteCount,
  genreHref,
  onPlayTrailer,
  trailerAvailable = false,
  children,
}: MediaHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-gray-950">
      {backdropPath && (
        <img
          src={backdropUrl(backdropPath, 1280) ?? undefined}
          srcSet={backdropSrcSet(backdropPath)}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          {...{ fetchpriority: "high" }}
          className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/95 via-black/80 to-black/50"
      />

      <Container className="py-8 sm:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="mx-auto w-48 shrink-0 sm:w-60 lg:mx-0 lg:w-72">
            <Image
              src={posterUrl(posterPath, 500)}
              srcSet={posterSrcSet(posterPath)}
              sizes="(min-width: 1024px) 288px, (min-width: 640px) 240px, 192px"
              alt={`${title} poster`}
              aspect="poster"
              priority
              className="rounded-xl shadow-2xl"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-4 text-center lg:text-left">
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {title}
              </h1>
              {originalTitle && originalTitle !== title && (
                <p className="mt-1 text-sm text-gray-400">
                  Original title: {originalTitle}
                </p>
              )}
              {tagline && (
                <p className="mt-2 text-base italic text-light-blue-300">
                  {tagline}
                </p>
              )}
            </div>

            {facts.length > 0 && (
              <dl className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-300 lg:justify-start">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex gap-1.5">
                    <dt className="sr-only">{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {genres.length > 0 && (
              <ul className="flex flex-wrap justify-center gap-2 lg:justify-start">
                {genres.map((genre) => (
                  <li key={genre.id}>
                    <Badge
                      variant="outline"
                      to={genreHref ? genreHref(genre) : undefined}
                    >
                      {genre.name}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <Rating value={voteAverage} />
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">
                  {formatRating(voteAverage)}
                </span>
                {voteCount > 0 && (
                  <span className="text-gray-400">
                    {" "}
                    from {voteCount.toLocaleString("en-US")} votes
                  </span>
                )}
              </p>
            </div>

            {overview && (
              <div className="mx-auto max-w-prose lg:mx-0">
                <h2 className="mb-1 text-lg font-semibold text-light-blue-400">
                  Overview
                </h2>
                <p className="text-sm leading-relaxed text-gray-200 sm:text-base">
                  {overview}
                </p>
              </div>
            )}

            {children}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 lg:justify-start">
              {onPlayTrailer && (
                <button
                  type="button"
                  onClick={onPlayTrailer}
                  disabled={!trailerAvailable}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-red-500 px-4 py-2 font-semibold text-red-400 transition hover:bg-red-900 hover:text-white disabled:cursor-not-allowed disabled:border-gray-700 disabled:text-gray-500 disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                >
                  <FaCirclePlay aria-hidden="true" className="h-5 w-5" />
                  {trailerAvailable ? "Play trailer" : "No trailer available"}
                </button>
              )}
              <Link
                to="/"
                className="rounded-lg border-2 border-light-blue-500 px-4 py-2 font-semibold text-light-blue-400 transition hover:bg-blue-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
              >
                Browse all
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
