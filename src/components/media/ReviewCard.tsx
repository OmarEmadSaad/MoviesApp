import { useState } from "react";
import { MdStar } from "react-icons/md";
import { Image } from "@/components/ui/Image";
import { profileUrl } from "@/lib/tmdb/images";
import { formatDate } from "@/lib/format";
import type { Review } from "@/types/tmdb";

const PREVIEW_LENGTH = 400;

export function ReviewCard({
  review,
  showRating = true,
}: {
  review: Review;
  showRating?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const author =
    review.author_details.name?.trim() ||
    review.author_details.username ||
    review.author;
  const rating = review.author_details.rating;
  const isLong = review.content.length > PREVIEW_LENGTH;
  const body =
    expanded || !isLong
      ? review.content
      : `${review.content.slice(0, PREVIEW_LENGTH).trimEnd()}...`;
  const written = formatDate(review.created_at);

  return (
    <article className="rounded-lg bg-gray-900 p-4 shadow-md sm:p-6">
      <header className="mb-3 flex flex-wrap items-center gap-3">
        <div className="w-12 shrink-0">
          <Image
            src={profileUrl(review.author_details.avatar_path, 185)}
            alt=""
            aspect="square"
            className="rounded-full"
            fallback={
              <span
                aria-hidden="true"
                className="text-lg font-semibold text-gray-300"
              >
                {author.charAt(0).toUpperCase()}
              </span>
            }
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-white">
            A review by{" "}
            <span className="text-light-blue-400">{author}</span>
          </h3>
          {written && (
            <p className="text-sm text-gray-400">
              Written on <time dateTime={review.created_at}>{written}</time>
            </p>
          )}
        </div>
        {showRating && rating != null && (
          <p className="flex items-center gap-1 rounded border border-gray-600 px-2 py-1 text-sm text-white">
            <MdStar aria-hidden="true" className="h-4 w-4 text-yellow-500" />
            <span>
              {rating}
              <span className="sr-only"> out of 10</span>
            </span>
          </p>
        )}
      </header>

      <p className="whitespace-pre-line text-sm leading-relaxed text-gray-200">
        {body}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-3 rounded text-sm font-medium text-light-blue-400 underline underline-offset-4 transition hover:text-light-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </article>
  );
}
