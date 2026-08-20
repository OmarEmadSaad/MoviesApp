import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-800 bg-gray-950 py-8 text-white">
      <Container className="flex flex-col items-center gap-4 text-center">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <li>
              <FooterLink to="/">Home</FooterLink>
            </li>
            <li>
              <FooterLink to="/movies">Movies</FooterLink>
            </li>
            <li>
              <FooterLink to="/series">TV series</FooterLink>
            </li>
            <li>
              <FooterLink to="/contact-us">Contact us</FooterLink>
            </li>
          </ul>
        </nav>

        <p className="text-xs text-gray-400 sm:text-sm">
          <span suppressHydrationWarning>&copy; {YEAR}</span>{" "}
          <span className="text-base text-blue-500">React Movies</span>. All
          rights reserved.
        </p>

        <p className="max-w-prose text-xs text-gray-500">
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded underline underline-offset-2 transition hover:text-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
          >
            TMDB
          </a>
          .
        </p>
      </Container>
    </footer>
  );
}

function FooterLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="rounded text-red-400 underline-offset-4 transition hover:text-red-300 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
    >
      {children}
    </Link>
  );
}
