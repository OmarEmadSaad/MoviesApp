import { Navigate, useParams } from "react-router-dom";

export function LegacyTvRedirect({ suffix = "" }: { suffix?: string }) {
  const { id } = useParams();
  return <Navigate to={`/series/${id}${suffix}`} replace />;
}

export function LegacyMovieRedirect({ suffix }: { suffix: string }) {
  const { id } = useParams();
  return <Navigate to={`/movie/${id}${suffix}`} replace />;
}

export function LegacySeriesMediaRedirect() {
  const { id } = useParams();
  return <Navigate to={`/series/${id}/media`} replace />;
}
