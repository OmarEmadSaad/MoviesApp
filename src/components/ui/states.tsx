import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <span
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2 text-sm text-gray-300"
    >
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-light-blue-400 motion-reduce:animate-none"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-gray-800 motion-reduce:animate-none",
        className,
      )}
    />
  );
}

export function MediaCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-gray-900">
      <Skeleton className="aspect-[2/3] w-full rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function MediaGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <MediaCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PageLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-light-blue-500 motion-reduce:animate-none"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/60 px-6 py-10 text-center">
      <p className="text-lg font-semibold text-white">{title}</p>
      {description && <p className="max-w-prose text-sm text-gray-400">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn’t load this from The Movie Database. Please try again.",
  onRetry,
  compact = false,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  compact?: boolean;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-red-900/60 bg-red-950/30 text-center",
        compact ? "px-4 py-6" : "px-6 py-12",
      )}
    >
      <p className={cn("font-bold text-red-400", compact ? "text-base" : "text-2xl")}>
        {title}
      </p>
      <p className="max-w-prose text-sm text-gray-300">{description}</p>
      <div className="flex flex-wrap justify-center gap-3 pt-1">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-red-700 px-5 py-2 font-semibold text-white transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            Try again
          </button>
        )}
        <Link
          to="/"
          className="rounded-lg border border-gray-600 px-5 py-2 font-semibold text-white transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
