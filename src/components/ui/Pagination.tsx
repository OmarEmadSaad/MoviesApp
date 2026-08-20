import { Link } from "react-router-dom";
import {
  MdChevronLeft,
  MdChevronRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { cn } from "@/lib/cn";


export function Pagination({
  page,
  totalPages,
  buildHref,
  label,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;

  label: string;
}) {
  const first = 1;
  const last = totalPages;
  const isFirst = page <= first;
  const isLast = page >= last;

  return (
    <nav aria-label={label} className="flex justify-center py-8">
      <ul className="flex items-center gap-3 sm:gap-6">
        <PageLink
          to={buildHref(first)}
          disabled={isFirst}
          label="Go to first page"
        >
          <MdKeyboardDoubleArrowLeft className="h-5 w-5" aria-hidden="true" />
        </PageLink>
        <PageLink
          to={buildHref(page - 1)}
          disabled={isFirst}
          label="Go to previous page"
          rel="prev"
        >
          <MdChevronLeft className="h-5 w-5" aria-hidden="true" />
        </PageLink>

        <li>
          <p className="whitespace-nowrap text-sm text-gray-300 sm:text-base">
            Page <strong className="text-white">{page}</strong> of{" "}
            <strong className="text-white">{totalPages}</strong>
          </p>
        </li>

        <PageLink
          to={buildHref(page + 1)}
          disabled={isLast}
          label="Go to next page"
          rel="next"
        >
          <MdChevronRight className="h-5 w-5" aria-hidden="true" />
        </PageLink>
        <PageLink
          to={buildHref(last)}
          disabled={isLast}
          label="Go to last page"
        >
          <MdKeyboardDoubleArrowRight className="h-5 w-5" aria-hidden="true" />
        </PageLink>
      </ul>
    </nav>
  );
}

function PageLink({
  to,
  disabled,
  label,
  rel,
  children,
}: {
  to: string;
  disabled: boolean;
  label: string;
  rel?: string;
  children: React.ReactNode;
}) {
  const classes = cn(
    "flex h-10 w-10 items-center justify-center rounded-lg border transition",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400",
    disabled
      ? "cursor-not-allowed border-gray-800 text-gray-600"
      : "border-gray-500 text-white hover:border-light-blue-400 hover:text-light-blue-300",
  );

  return (
    <li>
      {disabled ? (
        <span className={classes} aria-disabled="true" aria-label={label}>
          {children}
        </span>
      ) : (
        <Link to={to} rel={rel} aria-label={label} className={classes}>
          {children}
        </Link>
      )}
    </li>
  );
}
