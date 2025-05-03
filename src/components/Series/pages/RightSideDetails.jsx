import { useSelector, useDispatch } from "react-redux";
import { FaHome, FaVideo } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { getSeriesKeywords } from "../../Redux/DetailsSeriesSlice/DetailsSeriesSlice";

const RightSideDetails = () => {
  const dispatch = useDispatch();
  const seriesDetails = useSelector(
    (state) => state.SeriesDetails.seriesDetails
  );
  const seriesKeywords = useSelector(
    (state) => state.SeriesDetails.seriesKeywords
  );
  const seriesKeywordsError = useSelector(
    (state) => state.SeriesDetails.seriesKeywordsError
  );
  const languages = useSelector(
    (state) => state.SeriesDetails.seriesDetails?.spoken_languages
  );

  useEffect(() => {
    if (seriesDetails?.id) {
      dispatch(getSeriesKeywords(seriesDetails.id));
    }
  }, [dispatch, seriesDetails]);

  const tmdbUrl = seriesDetails?.id
    ? `https://www.themoviedb.org/tv/${seriesDetails.id}`
    : "#";

  const homepageUrl = seriesDetails?.homepage || "#";

  const languageInfo = languages?.find(
    (lang) => lang.iso_639_1 === seriesDetails?.original_language
  );
  const languageDisplay = languageInfo
    ? `${seriesDetails?.original_language?.toUpperCase()}: ${
        languageInfo.english_name
      }: ${languageInfo.name}`
    : "Not available";

  return (
    <div className="p-4 rounded text-white w-full">
      <div className="flex space-x-4 mb-4">
        <Link
          to={homepageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300"
        >
          <FaHome size={20} />
        </Link>
        <Link
          to={tmdbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-400"
        >
          <FaVideo size={20} />
        </Link>
      </div>

      <h3 className="text-white text-lg font-semibold mb-2">Original Name</h3>
      <p className="mb-4 text-blue-400">
        {seriesDetails?.original_name || "Not available"}
      </p>

      <h3 className="text-white text-lg font-semibold mb-2">Status</h3>
      <p className="mb-4 text-blue-400">
        {seriesDetails?.status || "Not available"}
      </p>

      <h3 className="text-white text-lg font-semibold mb-2">Network</h3>
      <p className="mb-4 text-blue-400">
        {seriesDetails?.networks && seriesDetails.networks.length > 0
          ? seriesDetails.networks[0].name || "Not available"
          : "Not available"}
      </p>

      <h3 className="text-white text-lg font-semibold mb-2">Type</h3>
      <p className="mb-4 text-blue-400">
        {seriesDetails?.type || "Not available"}
      </p>

      <h3 className="text-white text-lg font-semibold mb-2">
        Original Language
      </h3>
      <p className="mb-4 text-blue-400">{languageDisplay}</p>

      <h3 className="text-blue-400 text-lg font-semibold mb-2">Keywords</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {seriesKeywordsError ? (
          <p className="text-red-400">Error: {seriesKeywordsError}</p>
        ) : seriesKeywords && seriesKeywords.length > 0 ? (
          seriesKeywords.map((keyword) => (
            <span
              key={keyword.id}
              className="bg-white hover:scale-125 text-black hover:text-light-blue-700 hover:cursor-pointer px-2 py-1 rounded text-sm"
            >
              {keyword.name}
            </span>
          ))
        ) : (
          <p className="text-blue-400">No keywords available</p>
        )}
      </div>
    </div>
  );
};

export default RightSideDetails;
