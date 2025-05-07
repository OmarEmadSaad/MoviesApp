import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSeriesDetails } from "../../../Redux/DetailsSeriesSlice/DetailsSeriesSlice";
import Loading from "../../../apiRequestError-Loading/Loading";

const LastSeason = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { seriesDetails, seriesDetailsLoading, seriesDetailsError } =
    useSelector((state) => state.SeriesDetails);

  useEffect(() => {
    if (id && !seriesDetails) {
      dispatch(getSeriesDetails(id));
    }
  }, [dispatch, id, seriesDetails]);

  const seasons = seriesDetails?.seasons || [];
  const firstSeason = seasons
    .filter((season) => season.season_number != 0)
    .sort((a, b) => a.season_number - b.season_number)[0];

  const handleSeasonClick = (seasonNumber) => {
    navigate(`/series/${id}/season/${seasonNumber}`);
  };

  return (
    <div className="w-[75%] sm:w-[55%] px-4 sm:px-8 py-6 mx-auto sm:mx-0">
      <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-4">
        Last Season
      </h2>

      {seriesDetailsLoading ? (
        <Loading />
      ) : seriesDetailsError ? (
        <p className="text-red-500 text-sm">Error: {seriesDetailsError}</p>
      ) : firstSeason ? (
        <div
          className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-gray-900 hover:bg-gray-800 transition rounded-md p-4 w-full cursor-pointer mx-auto sm:mx-0"
          onClick={() => handleSeasonClick(firstSeason.season_number)}
        >
          <img
            src={
              firstSeason.poster_path
                ? `https://image.tmdb.org/t/p/w200${firstSeason.poster_path}`
                : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg"
            }
            alt={firstSeason.name || "No Image"}
            className="w-36 h-52 object-cover rounded-md"
            loading="lazy"
          />
          <div className="flex flex-col justify-start gap-1 w-full text-white">
            <h3 className="text-lg font-bold">{firstSeason.name}</h3>
            <p className="text-sm text-gray-300">
              Season {firstSeason.season_number} •{" "}
              {firstSeason.air_date
                ? new Date(firstSeason.air_date).getFullYear()
                : "N/A"}
            </p>
            <p className="text-sm text-gray-300">
              Episodes: {firstSeason.episode_count || "N/A"}
            </p>
            <p className="text-sm text-gray-300 line-clamp-3">
              {firstSeason.overview || "No overview available."}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-white">No seasons for this series.</p>
      )}

      <div className="mt-4 flex justify-center sm:justify-start">
        <button
          onClick={() => navigate(`/series/${id}/seasons`)}
          className="text-white hover:text-cyan-500 text-sm transition"
        >
          View All Seasons
        </button>
      </div>
    </div>
  );
};

export default LastSeason;
