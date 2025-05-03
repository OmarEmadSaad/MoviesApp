import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import {
  getSeriesDetails,
  getSeriesReviews,
} from "../../../Redux/DetailsSeriesSlice/DetailsSeriesSlice";
import Loading from "../../../apiRequestError-Loading/Loading";

const AllReview = () => {
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
  const seriesReviews = useSelector(
    (state) => state.SeriesDetails.seriesReviews
  );
  const seriesReviewsLoading = useSelector(
    (state) => state.SeriesDetails.seriesReviewsLoading
  );
  const seriesReviewsError = useSelector(
    (state) => state.SeriesDetails.seriesReviewsError
  );

  const [expandedReviews, setExpandedReviews] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(getSeriesReviews(id));
      dispatch(getSeriesDetails(id));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleReviewContent = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const releaseYear = seriesDetails?.first_air_date
    ? new Date(seriesDetails.first_air_date).getFullYear()
    : "N/A";

  return (
    <div className="p-4 sm:p-6 text-white w-[95%] sm:w-[95%] mx-auto">
      {(seriesDetailsLoading || seriesReviewsLoading) && <Loading />}
      {seriesDetailsError && (
        <p className="text-red-500 text-sm sm:text-base mb-4 text-center sm:text-left">
          Error fetching series details: {seriesDetailsError}
        </p>
      )}
      {seriesDetails && (
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-start gap-4">
          <img
            src={
              seriesDetails.poster_path
                ? `https://image.tmdb.org/t/p/w200${seriesDetails.poster_path}`
                : "https://placehold.co/200x300?text=No+Image"
            }
            alt={seriesDetails.name || "Series Poster"}
            className="w-32 h-48 sm:w-40 sm:h-60 rounded-lg object-cover mx-auto sm:mx-0"
            loading="lazy"
          />
          <div className="flex flex-col gap-4 flex-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-light-blue-800 text-center sm:text-left">
                A review by : {seriesDetails.name || "Series Name"}
              </h1>
              <p className="text-gray-400 text-sm sm:text-base text-center sm:text-left">
                {releaseYear}
              </p>
            </div>
            <button
              onClick={handleBack}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition self-center sm:self-start"
            >
              Back
            </button>
          </div>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold text-light-blue-800 mb-4 sm:mb-6 text-center sm:text-left">
        Social
      </h2>
      {seriesReviewsError && (
        <p className="text-red-500 text-sm sm:text-base text-center sm:text-left">
          Error: {seriesReviewsError}
        </p>
      )}
      {seriesReviews &&
      seriesReviews.results &&
      seriesReviews.results.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {seriesReviews.results.map((review) => {
            const isExpanded = expandedReviews[review.id];
            const isLongContent = review.content.length > 200;
            return (
              <div
                key={review.id}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-gray-800 rounded-lg p-4 sm:p-6 shadow-md"
              >
                <img
                  src={
                    review.author_details.avatar_path
                      ? `https://image.tmdb.org/t/p/w200${review.author_details.avatar_path}`
                      : "https://placehold.co/100x100?text=No+Avatar"
                  }
                  alt={review.author}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover self-center sm:self-start"
                  loading="lazy"
                />
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-white text-center sm:text-left">
                    {review.author}
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base text-center sm:text-left">
                    {new Date(review.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p
                    className={`text-gray-300 text-sm sm:text-base mt-2 text-center sm:text-left ${
                      isExpanded || !isLongContent ? "" : "line-clamp-4"
                    }`}
                  >
                    {review.content}
                  </p>
                  {isLongContent && (
                    <button
                      onClick={() => toggleReviewContent(review.id)}
                      className="mt-2 px-3 py-1 text-blue-600 underline hover:text-blue-700 transition self-center sm:self-start"
                    >
                      {isExpanded ? "Show Less" : "Show More"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm sm:text-base text-gray-400 text-center sm:text-left">
          No reviews available for this series.
        </p>
      )}
    </div>
  );
};

export default AllReview;
