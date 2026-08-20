import { FaRegStar, FaStar } from "react-icons/fa";
import { formatRating } from "@/lib/format";

const STARS = [0, 1, 2, 3, 4];

export function Rating({
  value,
  size = "md",
}: {
  value: number | null | undefined;
  size?: "sm" | "md";
}) {
  const clamped = Math.min(Math.max(value ?? 0, 0), 10);
  const percentage = (clamped / 10) * 100;
  const iconSize = size === "sm" ? "text-base" : "text-[1.2em]";

  return (
    <div
      className="relative w-max shrink-0"
      role="img"
      aria-label={`Rated ${formatRating(clamped)} out of 10`}
    >
      <div className="flex" aria-hidden="true">
        {STARS.map((index) => (
          <FaRegStar key={index} className={`${iconSize} w-[1em]`} color="#2196f3" />
        ))}
      </div>
      <div
        style={{ width: `${percentage}%` }}
        className="absolute left-0 top-0 flex overflow-hidden"
        aria-hidden="true"
      >
        {STARS.map((index) => (
          <FaStar key={index} className={`${iconSize} w-[1em] shrink-0`} color="#ffeb3b" />
        ))}
      </div>
    </div>
  );
}
