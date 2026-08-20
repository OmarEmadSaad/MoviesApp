import { useCallback, useEffect, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { cn } from "@/lib/cn";


export function Carousel({
  children,
  label,
  className,
}: {

  children: React.ReactNode;

  label: string;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;


    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();


    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateArrows, children]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className={cn("group relative", className)}>
      <ul
        ref={scrollerRef}
        onScroll={updateArrows}
        aria-label={label}
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4",


          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400",
          "[scrollbar-width:thin] motion-reduce:scroll-auto",
        )}
        tabIndex={0}
      >
        {children}
      </ul>

      <CarouselArrow
        side="left"
        onClick={() => scrollByPage(-1)}
        disabled={!canScrollLeft}
        label={`Scroll ${label} left`}
      />
      <CarouselArrow
        side="right"
        onClick={() => scrollByPage(1)}
        disabled={!canScrollRight}
        label={`Scroll ${label} right`}
      />
    </div>
  );
}

function CarouselArrow({
  side,
  onClick,
  disabled,
  label,
}: {
  side: "left" | "right";
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  const Icon = side === "left" ? MdChevronLeft : MdChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}


      tabIndex={-1}
      className={cn(
        "absolute top-[38%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-900/90 text-white shadow-lg transition",
        "hover:bg-gray-700 disabled:pointer-events-none disabled:opacity-0",
        "md:flex",
        side === "left" ? "left-0 -ml-2" : "right-0 -mr-2",
      )}
    >
      <Icon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
}


export function CarouselItem({
  children,
  className = "w-40 sm:w-48",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <li className={cn("shrink-0 snap-start", className)}>{children}</li>;
}
