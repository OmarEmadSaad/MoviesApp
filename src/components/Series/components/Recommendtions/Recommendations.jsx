import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSeriesRecommendations } from "../../../Redux/DetailsSeriesSlice/DetailsSeriesSlice";
import Loading from "../../../apiRequestError-Loading/Loading";
const Recommendations = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    seriesDetails,
    recommendations,
    recommendationsLoading,
    recommendationsError,
  } = useSelector((state) => state.SeriesDetails);

  useEffect(() => {
    if (id) {
      dispatch(getSeriesRecommendations(id));
    }
  }, [id, dispatch]);

  const currentseries = seriesDetails?.genres?.map((genre) => genre.id);
  const filteredRecommendations = recommendations
    ?.filter((series) =>
      series.genre_ids?.some((genreId) => currentseries.includes(genreId))
    )
    .slice(0, 10);

  return (
    <div className="recommendations px-4 py-6 mt-2 text-white">
      <h2 className="text-2xl font-bold mb-4 text-light-blue-800 ">
        Recommendations
      </h2>
      <div className="w-[95%] sm:w-[55%] overflow-x-auto bg-gray-800">
        {recommendationsLoading ? (
          <Loading />
        ) : recommendationsError ? (
          <p className="text-red-500 text-center">
            Error fetching recommendations: {recommendationsError}
          </p>
        ) : filteredRecommendations?.length > 0 ? (
          <div className="flex gap-4 whitespace-nowrap">
            {filteredRecommendations.map((series) => (
              <div
                key={series.id}
                className="w-[150px] sm:w-[200px] shrink-0 cursor-pointer bg-black border-2"
                onClick={() => navigate(`/series/${series.id}`)}
              >
                <img
                  src={
                    series.poster_path
                      ? `https://image.tmdb.org/t/p/w300${series.poster_path}`
                      : "https://via.placeholder.com/150x225?text=No+Image"
                  }
                  alt={series.name || "Series Poster"}
                  className="w-full aspect-[2/3] object-cover rounded-md"
                />
                <div className="mt-2 px-2 flex justify-between items-center">
                  <h3 className="text-sm sm:text-base font-semibold truncate text-start">
                    {series.name || "Unknown Series"}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 text-end">
                    {series.vote_average
                      ? `${(series.vote_average * 10).toFixed(0)}%`
                      : "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-center">
            No recommendations available for this series.
          </p>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
