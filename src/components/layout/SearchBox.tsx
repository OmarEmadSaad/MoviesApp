import { useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchInput } from "@/components/ui/SearchInput";
import { Spinner } from "@/components/ui/states";
import { Image } from "@/components/ui/Image";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useSearchMoviesQuery, useSearchSeriesQuery } from "@/lib/tmdb/api";
import { posterUrl } from "@/lib/tmdb/images";
import { formatYear } from "@/lib/format";
import { mediaPath } from "@/lib/slug";
import type { MediaSummary } from "@/types/tmdb";
import { cn } from "@/lib/cn";

export type SearchScope = "movies" | "series";

const MAX_SUGGESTIONS = 8;

export function SearchBox({
  scope,
  onScopeChange,
  onNavigate,
  className,
  inputIdSuffix,
}: {
  scope: SearchScope;
  onScopeChange: (scope: SearchScope) => void;

  onNavigate?: () => void;
  className?: string;

  inputIdSuffix: string;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const reactId = useId();
  const inputId = `search-${inputIdSuffix}-${reactId}`;
  const listboxId = `${inputId}-listbox`;

  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  const shouldSearch = debouncedQuery.length > 1;

  const movieResults = useSearchMoviesQuery(debouncedQuery, {
    skip: !shouldSearch || scope !== "movies",
  });
  const seriesResults = useSearchSeriesQuery(debouncedQuery, {
    skip: !shouldSearch || scope !== "series",
  });

  const active = scope === "movies" ? movieResults : seriesResults;
  const suggestions: MediaSummary[] = (active.data ?? []).slice(
    0,
    MAX_SUGGESTIONS,
  );
  const mediaType = scope === "movies" ? "movie" : "tv";
  const showList = open && shouldSearch;

  useOnClickOutside(containerRef, () => setOpen(false), showList);

  const reset = () => {
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
  };

  const goTo = (item: MediaSummary) => {
    const title = item.title ?? item.name ?? item.original_name ?? "";
    navigate(mediaPath(mediaType, item.id, title));
    reset();
    onNavigate?.();
  };

  const submit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      goTo(suggestions[activeIndex]);
      return;
    }
    navigate(`/search/${scope}/${encodeURIComponent(trimmed)}`);
    reset();
    onNavigate?.();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showList || !suggestions.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (index) => (index - 1 + suggestions.length) % suggestions.length,
      );
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const toggleScope = () => {
    onScopeChange(scope === "movies" ? "series" : "movies");
    reset();
  };

  const scopeLabel = scope === "movies" ? "movies" : "series";

  return (
    <div ref={containerRef} className={cn("flex flex-col gap-2 sm:flex-row sm:items-start", className)}>
      <div className="relative flex-1">
        <SearchInput
          id={inputId}
          value={query}
          onChange={(value) => {
            setQuery(value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onClear={reset}
          onSubmit={submit}
          label={`Search ${scopeLabel}`}
          placeholder={`Search ${scopeLabel}`}
          listboxId={listboxId}
          expanded={showList && suggestions.length > 0}
          activeOptionId={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          onKeyDown={onKeyDown}
        />

        {showList && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-gray-700 bg-blue-gray-900 shadow-2xl">
            {active.isFetching && !suggestions.length ? (
              <p className="p-3">
                <Spinner label={`Searching ${scopeLabel}`} />
              </p>
            ) : active.isError ? (
              <p role="alert" className="p-3 text-sm text-red-400">
                Could not load suggestions.
              </p>
            ) : suggestions.length ? (
              <ul id={listboxId} role="listbox" aria-label={`${scopeLabel} suggestions`} className="max-h-72 overflow-auto">
                {suggestions.map((item, index) => {
                  const title =
                    item.title ?? item.name ?? item.original_name ?? "Untitled";
                  const year = formatYear(
                    item.release_date ?? item.first_air_date,
                  );
                  return (
                    <li
                      key={item.id}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}

                      onMouseDown={(event) => {
                        event.preventDefault();
                        goTo(item);
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 p-2 text-white",
                        index === activeIndex && "bg-gray-100 text-black",
                      )}
                    >
                      <div className="w-8 shrink-0">
                        <Image
                          src={posterUrl(item.poster_path, 92)}
                          alt=""
                          aspect="poster"
                          className="rounded"
                        />
                      </div>
                      <span className="truncate text-sm">
                        {title}
                        {year && (
                          <span className="ml-1 opacity-70">({year})</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="p-3 text-sm text-gray-300">
                No {scopeLabel} match &ldquo;{debouncedQuery}&rdquo;.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          className="whitespace-nowrap rounded-lg border-2 border-red-500 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
        >
          Search
        </button>
        <button
          type="button"
          onClick={toggleScope}
          className="whitespace-nowrap rounded-lg border-2 border-green-500 px-3 py-2 text-sm font-semibold text-green-500 transition hover:bg-green-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
        >
          {scope === "movies" ? "Search series" : "Search movies"}
        </button>
      </div>
    </div>
  );
}
