import { useId, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { Image } from "@/components/ui/Image";
import { EmptyState } from "@/components/ui/states";
import {
  backdropSrcSet,
  backdropUrl,
  posterSrcSet,
  posterUrl,
  youtubeEmbedUrl,
  youtubeThumbnailUrl,
} from "@/lib/tmdb/images";
import type { Images, Video } from "@/types/tmdb";
import { cn } from "@/lib/cn";

type Tab = "videos" | "backdrops" | "posters";

export function MediaTabs({
  videos,
  images,
  title,
}: {
  videos: Video[] | undefined;
  images: Images | undefined;
  title: string;
}) {
  const [active, setActive] = useState<Tab>("videos");
  const baseId = useId();

  const youtubeVideos = (videos ?? []).filter(
    (video) => video.site === "YouTube",
  );
  const backdrops = images?.backdrops ?? [];
  const posters = images?.posters ?? [];

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "videos", label: "Videos", count: youtubeVideos.length },
    { id: "backdrops", label: "Backdrops", count: backdrops.length },
    { id: "posters", label: "Posters", count: posters.length },
  ];

  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = tabs.findIndex((tab) => tab.id === active);
    if (event.key === "ArrowRight") {
      setActive(tabs[(index + 1) % tabs.length].id);
    } else if (event.key === "ArrowLeft") {
      setActive(tabs[(index - 1 + tabs.length) % tabs.length].id);
    } else {
      return;
    }
    event.preventDefault();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={`Media for ${title}`}
        onKeyDown={onKeyDown}
        className="mb-4 flex gap-2 overflow-x-auto border-b border-gray-800"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            id={`${baseId}-tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            className={cn(
              "whitespace-nowrap border-b-2 px-4 py-2 text-sm font-semibold uppercase transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400",
              active === tab.id
                ? "border-purple-500 text-white"
                : "border-transparent text-gray-400 hover:text-white",
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${active}`}
        aria-labelledby={`${baseId}-tab-${active}`}
        tabIndex={0}
        className="rounded-lg bg-gray-800 p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
      >
        {active === "videos" &&
          (youtubeVideos.length ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {youtubeVideos.slice(0, 12).map((video) => (
                <li key={video.id}>
                  <VideoEmbed video={video} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No videos available" />
          ))}

        {active === "backdrops" &&
          (backdrops.length ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {backdrops.slice(0, 12).map((image) => (
                <li key={image.file_path}>
                  <Image
                    src={backdropUrl(image.file_path, 780)}
                    srcSet={backdropSrcSet(image.file_path)}
                    sizes="(min-width: 640px) 45vw, 90vw"
                    alt={`Backdrop image from ${title}`}
                    aspect="backdrop"
                    className="rounded-md"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No backdrops available" />
          ))}

        {active === "posters" &&
          (posters.length ? (
            <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {posters.slice(0, 18).map((image) => (
                <li key={image.file_path}>
                  <Image
                    src={posterUrl(image.file_path, 342)}
                    srcSet={posterSrcSet(image.file_path)}
                    sizes="(min-width: 768px) 15vw, 30vw"
                    alt={`Poster artwork for ${title}`}
                    aspect="poster"
                    className="rounded-md"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No posters available" />
          ))}
      </div>
    </div>
  );
}

export function VideoEmbed({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-md bg-black">
        <iframe
          src={`${youtubeEmbedUrl(video.key)}&autoplay=1`}
          title={video.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block w-full overflow-hidden rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
    >
      <Image
        src={youtubeThumbnailUrl(video.key)}
        alt=""
        aspect="backdrop"
        imgClassName="transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
          <FaPlay className="ml-1 h-5 w-5" />
        </span>
      </span>
      <span className="block bg-gray-900 p-2 text-left text-sm text-white">
        Play: {video.name}
      </span>
    </button>
  );
}
