import { Link } from "react-router-dom";
import { Image } from "@/components/ui/Image";
import { Container } from "@/components/ui/Container";
import { posterSrcSet, posterUrl } from "@/lib/tmdb/images";
import { formatYear } from "@/lib/format";

export function SubPageHeader({
  title,
  posterPath,
  date,
  parentPath,
  parentLabel,
  subtitle,
}: {
  title: string;
  posterPath: string | null;
  date?: string | null;
  parentPath: string;
  parentLabel: string;
  subtitle?: string;
}) {
  const year = formatYear(date);

  return (
    <Container as="header" className="py-6">
      <div className="flex flex-col items-center gap-6 rounded-lg bg-gray-900 p-4 sm:flex-row sm:items-start">
        <div className="w-28 shrink-0 sm:w-36">
          <Image
            src={posterUrl(posterPath, 342)}
            srcSet={posterSrcSet(posterPath)}
            sizes="144px"
            alt={`${title} poster`}
            aspect="poster"
            priority
            className="rounded-md"
          />
        </div>
        <div className="text-center sm:text-left">
          {subtitle && (
            <p className="text-sm uppercase tracking-wide text-gray-400">
              {subtitle}
            </p>
          )}
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {title}
            {year && (
              <span className="ml-2 font-normal text-gray-400">({year})</span>
            )}
          </h1>
          <Link
            to={parentPath}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-light-blue-400 hover:text-light-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
          >
            <span aria-hidden="true">&larr;</span> Back to {parentLabel}
          </Link>
        </div>
      </div>
    </Container>
  );
}
