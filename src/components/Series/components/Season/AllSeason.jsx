import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getSeriesDetails } from "../../../Redux/DetailsSeriesSlice/DetailsSeriesSlice";
import Loading from "../../../apiRequestError-Loading/Loading";

const AllSeason = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const seriesDetails = useSelector(
    (state) => state.SeriesDetails.seriesDetails
  );
  const seriesDetailsLoading = useSelector(
    (state) => state.SeriesDetails.seriesDetailsLoading
  );
  const seriesDetailsError = useSelector(
    (state) => state.SeriesDetails.seriesDetailsError
  );

  useEffect(() => {
    if (id && !seriesDetails) {
      dispatch(getSeriesDetails(id));
    }
  }, [dispatch, id, seriesDetails]);

  const seasons = seriesDetails?.seasons || [];

  const handleSeasonClick = (seasonNumber) => {
    navigate(`/series/${id}/season/${seasonNumber}`);
  };

  return (
    <div className="p-4 text-white bg-gray-900 min-h-screen">
      {(seriesDetailsLoading || seriesDetails) && (
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          {seriesDetailsLoading ? (
            <div className="w-32 h-48 bg-gray-700 animate-pulse rounded-md"></div>
          ) : (
            <img
              src={
                seriesDetails?.poster_path
                  ? `https://image.tmdb.org/t/p/w300${seriesDetails.poster_path}`
                  : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg"
              }
              alt={seriesDetails?.name || "Series Poster"}
              className="w-32 sm:w-48 h-auto object-cover rounded-md"
              loading="lazy"
            />
          )}
          <div className="flex flex-col gap-2 text-center sm:text-start">
            {seriesDetailsLoading ? (
              <>
                <div className="h-8 w-48 bg-gray-700 animate-pulse rounded"></div>
                <div className="h-4 w-24 bg-gray-700 animate-pulse rounded"></div>
                <div className="h-10 w-32 bg-gray-700 animate-pulse rounded"></div>
              </>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {seriesDetails?.name || "Unknown Series"}
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  {seriesDetails?.first_air_date
                    ? new Date(seriesDetails.first_air_date).getFullYear()
                    : "N/A"}
                </p>
                <button
                  onClick={() => navigate(-1)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-fit mx-auto sm:mx-0"
                >
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">All Seasons</h2>
      {seriesDetailsLoading ? (
        <Loading />
      ) : seriesDetailsError ? (
        <p className="text-red-500">Error: {seriesDetailsError}</p>
      ) : seasons.length > 0 ? (
        <div className="flex flex-col gap-4">
          {seasons
            .filter((season) => season.season_number !== 0)
            .map((season) => (
              <div
                key={season.id}
                className="flex items-center gap-4 bg-gray-800 rounded-md p-4 cursor-pointer hover:bg-gray-700"
                onClick={() => handleSeasonClick(season.season_number)}
              >
                <img
                  src={
                    season.poster_path
                      ? `https://image.tmdb.org/t/p/w200${season.poster_path}`
                      : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg"
                  }
                  alt={season.name}
                  className="w-24 h-36 object-cover rounded-md"
                  loading="lazy"
                />
                <div>
                  <h3 className="text-lg font-bold">{season.name}</h3>
                  <p className="text-gray-300 text-sm">
                    Season {season.season_number} •{" "}
                    {season.air_date
                      ? new Date(season.air_date).getFullYear()
                      : "N/A"}
                  </p>
                  <p className="text-gray-300 text-sm">
                    Episodes: {season.episode_count || "N/A"}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {season.overview || "No overview available."}
                  </p>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p>No seasons for this series</p>
      )}
    </div>
  );
};

export default AllSeason;
