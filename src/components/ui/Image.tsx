import { useState } from "react";
import { cn } from "@/lib/cn";

type AspectName = "poster" | "backdrop" | "profile" | "still" | "square";

const ASPECT_CLASS: Record<AspectName, string> = {
  poster: "aspect-[2/3]",
  backdrop: "aspect-video",
  profile: "aspect-[2/3]",
  still: "aspect-video",
  square: "aspect-square",
};

export interface ImageProps {
  src: string | null;
  srcSet?: string;

  sizes?: string;
  alt: string;
  aspect?: AspectName;
  className?: string;
  imgClassName?: string;

  priority?: boolean;
  objectFit?: "cover" | "contain";

  fallback?: React.ReactNode;
}


export function Image({
  src,
  srcSet,
  sizes,
  alt,
  aspect = "poster",
  className,
  imgClassName,
  priority = false,
  objectFit = "cover",
  fallback,
}: ImageProps) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-800",
        ASPECT_CLASS[aspect],
        className,
      )}
    >
      {showFallback ? (
        <div
          className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-gray-400"
          role="img"
          aria-label={alt}
        >
          {fallback ?? <span aria-hidden="true">No image</span>}
        </div>
      ) : (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          {...fetchPriorityAttr(priority)}
          decoding={priority ? "sync" : "async"}
          onError={() => setFailed(true)}
          className={cn(
            "h-full w-full",
            objectFit === "cover" ? "object-cover" : "object-contain",
            imgClassName,
          )}
        />
      )}
    </div>
  );
}


function fetchPriorityAttr(priority: boolean) {
  return { fetchpriority: priority ? "high" : "auto" } as Record<string, string>;
}
