import { Link } from "react-router-dom";
import { Seo } from "@/lib/seo/Seo";

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page not found"
        description="The page you are looking for does not exist."
        canonicalPath="/404"
        noindex
      />

      <div
        style={{ backgroundImage: "url(/404-Andromo-AI-Design-2.webp)" }}
        className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-900 bg-cover bg-center px-4 text-center text-white"
      >
        <div className="rounded-2xl bg-black/60 px-6 py-10 backdrop-blur-sm">
          <p className="animate-fade-in-up text-6xl font-bold sm:text-7xl">
            404
          </p>
          <h1 className="animate-fade-in mt-4 text-xl sm:text-2xl">
            We could not find that page
          </h1>
          <p className="animate-fade-in mx-auto mt-2 max-w-md text-sm text-gray-300">
            The movie, series or person you were looking for may have been
            removed, or the link may be wrong.
          </p>
          <div className="animate-pop-in mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              Back to home
            </Link>
            <Link
              to="/movies"
              className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Browse movies
            </Link>
            <Link
              to="/series"
              className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Browse series
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
