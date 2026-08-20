import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

export function SectionHeader({
  title,
  count,
  linkTo,
  linkLabel = "See all",
  as: Tag = "h2",
  className,
  id,
}: {
  title: string;
  count?: number;
  linkTo?: string;
  linkLabel?: string;
  as?: "h2" | "h3" | "h4";
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1",
        className,
      )}
    >
      <Tag
        id={id}
        className="text-xl font-bold text-light-blue-600 sm:text-2xl"
      >
        {title}
        {count != null && (
          <span className="ml-2 text-base font-semibold text-gray-400">
            {count}
          </span>
        )}
      </Tag>
      {linkTo && (
        <Link
          to={linkTo}
          className="rounded text-sm font-medium text-light-blue-400 underline-offset-4 transition hover:text-light-blue-200 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
