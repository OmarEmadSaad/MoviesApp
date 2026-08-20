import { forwardRef } from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import { cn } from "@/lib/cn";

export interface SearchInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  label: string;
  placeholder: string;
  className?: string;

  listboxId?: string;
  expanded?: boolean;
  activeOptionId?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      id,
      value,
      onChange,
      onClear,
      onSubmit,
      label,
      placeholder,
      className,
      listboxId,
      expanded = false,
      activeOptionId,
      onKeyDown,
    },
    ref,
  ) {
    return (
      <div className={cn("relative", className)}>
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <IoSearch
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600"
        />
        <input
          id={id}
          ref={ref}
          type="search"
          role="combobox"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          aria-controls={listboxId}
          aria-expanded={expanded}
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSubmit();
            }
            onKeyDown?.(event);
          }}
          className="w-full rounded-md bg-white py-2 pl-9 pr-9 text-black placeholder-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label={`Clear ${label.toLowerCase()}`}
            className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-light-blue-600"
          >
            <IoClose className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  },
);
