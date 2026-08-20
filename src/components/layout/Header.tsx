import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import { SearchBox, type SearchScope } from "./SearchBox";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Movies", to: "/movies" },
  { label: "Series", to: "/series" },
  { label: "Contact us", to: "/contact-us" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scope, setScope] = useState<SearchScope>("movies");
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 bg-blue-gray-900 text-white shadow-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>

      <Container width="full" className="py-3">
        <div className="flex items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-8">
            <Link
              to="/"
              className="shrink-0 rounded text-lg font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
            >
              React Movies
            </Link>
            <nav aria-label="Main" className="hidden lg:block">
              <NavList />
            </nav>
          </div>

          <SearchBox
            scope={scope}
            onScopeChange={setScope}
            inputIdSuffix="desktop"
            className="hidden min-w-[420px] max-w-xl lg:flex"
          />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-blue-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400 lg:hidden"
          >
            {menuOpen ? (
              <IoClose className="h-6 w-6" aria-hidden="true" />
            ) : (
              <IoMenu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        <div
          id="mobile-menu"
          hidden={!menuOpen}
          className={cn("lg:hidden", menuOpen && "pb-4 pt-4")}
        >
          <nav aria-label="Main (mobile)" className="mb-4">
            <NavList />
          </nav>
          <SearchBox
            scope={scope}
            onScopeChange={setScope}
            onNavigate={() => setMenuOpen(false)}
            inputIdSuffix="mobile"
          />
        </div>
      </Container>
    </header>
  );
}

function NavList() {
  return (
    <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-6">
      {NAV_ITEMS.map(({ label, to }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "block rounded px-2 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400",
                isActive
                  ? "text-light-blue-400"
                  : "text-white hover:text-light-blue-300",
              )
            }
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
