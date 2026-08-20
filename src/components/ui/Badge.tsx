import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

export function Badge({
  children,
  to,
  variant = "solid",
  className,
}: {
  children: React.ReactNode;
  to?: string;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const classes = cn(
    "inline-flex items-center rounded px-2 py-1 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400",
    variant === "solid"
      ? "bg-white text-black hover:bg-light-blue-100 hover:text-light-blue-900"
      : "border border-gray-500 text-gray-200 hover:border-light-blue-400 hover:text-light-blue-300",
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }
  return <span className={classes}>{children}</span>;
}
