import { MediaCard } from "./MediaCard";
import { MediaGridSkeleton, EmptyState, ErrorState } from "@/components/ui/states";
import type { MediaSummary, MediaType } from "@/types/tmdb";

export interface MediaGridProps {
  items: MediaSummary[] | undefined;
  mediaType: MediaType;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  showOverview?: boolean;

  priorityCount?: number;

  label: string;
}

export function MediaGrid({
  items,
  mediaType,
  isLoading = false,
  isError = false,
  onRetry,
  emptyTitle = "Nothing to show",
  emptyDescription,
  showOverview = false,
  priorityCount = 4,
  label,
}: MediaGridProps) {
  if (isLoading) return <MediaGridSkeleton />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (!items?.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <ul
      aria-label={label}
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {items.map((item, index) => (
        <li key={item.id} className="h-full">
          <MediaCard
            item={item}
            mediaType={mediaType}
            priority={index < priorityCount}
            showOverview={showOverview}
          />
        </li>
      ))}
    </ul>
  );
}
