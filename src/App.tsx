import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageLoading } from "@/components/ui/states";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ConfigNotice } from "@/components/ConfigNotice";
import { Toaster } from "@/components/Toaster";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { routes } from "@/routes";

export default function App() {
  useScrollToTop();
  const element = useRoutes(routes);

  return (
    <div className="flex min-h-dvh flex-col bg-black">
      <ConfigNotice />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <ErrorBoundary>
          <Suspense fallback={<PageLoading label="Loading page" />}>
            {element}
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
