import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getSeriesReviews } from "../../../Redux/DetailsSeriesSlice/DetailsSeriesSlice";
import Loading from "../../../apiRequestError-Loading/Loading";

const Social = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const seriesReviews = useSelector(
    (state) => state.SeriesDetails.seriesReviews
  );
  const seriesReviewsLoading = useSelector(
    (state) => state.SeriesDetails.seriesReviewsLoading
  );
  const seriesReviewsError = useSelector(
    (state) => state.SeriesDetails.seriesReviewsError
  );

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getSeriesReviews(id));
    }
  }, [dispatch, id]);

  const handleViewAllReviews = () => {
    navigate(`/tv/${id}/reviews`);
  };

  const toggleReviewContent = () => {
    setIsExpanded((prev) => !prev);
  };

  const reviewsToDisplay = seriesReviews?.results?.slice(0, 1) || [];

  return (
    <div className="flex flex-col sm:flex-row sm:justify-start items-center sm:items-start w-full">
      <div className="p-4 pt-0 sm:p-6 text-white w-[80%] sm:w-[55%]">
        <div className="mb-2 sm:mb-4 ml-[-2.2em] sm:ml-[-1em]">
          <h2 className="text-lg sm:text-2xl font-bold text-light-blue-600 mb-2 sm:mb-4 text-left mt-2">
            Social Reviews
          </h2>
        </div>
        {seriesReviewsLoading ? (
          <Loading />
        ) : seriesReviewsError ? (
          <p className="text-red-500 text-sm sm:text-base text-center sm:text-left">
            Error: {seriesReviewsError}
          </p>
        ) : reviewsToDisplay.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {reviewsToDisplay.map((review) => {
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
                    <h3 className="text-lg sm:text-xl font-semibold text-center sm:text-left">
                      A review by:{" "}
                      <span className="text-light-blue-700">
                        {review.author}
                      </span>
                    </h3>
                    <p className="text-red-500 text-sm sm:text-base text-center sm:text-left">
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
                        onClick={toggleReviewContent}
                        className="mt-2 px-3 py-1 text-blue-600 underline hover:text-blue-700 transition self-center sm:self-start"
                      >
                        {isExpanded ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {seriesReviews?.results?.length > 1 && (
              <div className="w-full flex justify-center sm:justify-start mt-2">
                <button
                  onClick={handleViewAllReviews}
                  className="px-4 py-2 text-white rounded hover:text-blue-700 transition"
                >
                  View All Reviews
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm sm:text-base text-gray-400 text-center sm:text-left">
            No reviews available for this series.
          </p>
        )}
      </div>
    </div>
  );
};

export default Social;
