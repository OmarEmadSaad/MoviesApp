import { cn } from "@/lib/cn";

type Width = "narrow" | "default" | "wide" | "full";

const WIDTHS: Record<Width, string> = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
  full: "max-w-[1600px]",
};

export function Container({
  children,
  width = "wide",
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  width?: Width;
  className?: string;
  as?: "div" | "section" | "main" | "header" | "footer" | "article";
}) {
  return (
    <Tag className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", WIDTHS[width], className)}>
      {children}
    </Tag>
  );
}
