import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { getMoviebySearch } from "../../../Redux/DetailsMoviesSlice/movieDetailsSlice";
import { getSeriesBySearch } from "../../../Redux/DetailsSeriesSlice/DetailsSeriesSlice";
import RatingWithStars from "../../../Movies/components/RatingWithStars";
import Loading from "../../../apiRequestError-Loading/Loading";

const SearchResults = () => {
  const { type, query } = useParams();
  const decodedQuery = decodeURIComponent(query);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMoreMap, setShowMoreMap] = useState({});

  const dispatch = useDispatch();
  const { MoviebySearch, getMoviebySearchError } = useSelector(
    (state) => state.onemoviedetails
  );
  const { getSeriesBySearch: seriesSearchData, getSeriesBySearchError } =
    useSelector((state) => state.SeriesDetails);

  const [results, setResults] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    if (type === "movies") {
      dispatch(getMoviebySearch(query)).finally(() => setIsLoading(false));
    } else if (type === "series") {
      dispatch(getSeriesBySearch(query)).finally(() => setIsLoading(false));
    }
  }, [dispatch, query, type]);

  useEffect(() => {
    if (getMoviebySearchError || getSeriesBySearchError) {
      setError("Failed to fetch results");
      setResults([]);
    } else {
      if (type === "movies") {
        setResults(MoviebySearch || []);
      } else {
        setResults(seriesSearchData || []);
      }
    }
  }, [
    getMoviebySearchError,
    getSeriesBySearchError,
    MoviebySearch,
    seriesSearchData,
    type,
  ]);

  const toggleShowMore = (id) => {
    setShowMoreMap((prev) => ({
      ...prev,
      [id]: !prev[id] || false,
    }));
  };

  return (
    <div className="relative min-h-screen p-6">
      <div className="relative z-10 bg-black bg-opacity-50 p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">
          Search Results for "
          <span className="text-light-blue-500">{decodedQuery}</span>"
        </h1>
        {error && <span className="text-red-500 mb-4 block">{error}</span>}
        {isLoading ? (
          <Loading />
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-center mb-7"
              >
                <Card className="w-72 md:w-80 lg:w-80 shadow-lg bg-gray-900">
                  <CardHeader floated={false} color="blue-gray">
                    <img
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
                      }
                      alt={
                        item.title ||
                        item.name ||
                        item.original_name ||
                        "No title"
                      }
                      className="w-full h-96 object-cover"
                      loading="lazy"
                    />
                    <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />
                  </CardHeader>
                  <CardBody className="p-2">
                    <Typography
                      className="font-medium text-white truncate max-w-[150px] text-lg"
                      variant="h4"
                    >
                      Title:{" "}
                      <span className="text-gray-400 text-base">
                        {item.title ||
                          item.name ||
                          item.original_name ||
                          "No title"}
                      </span>
                    </Typography>
                    <div className="flex items-center justify-between py-2">
                      <Typography
                        variant="h3"
                        className="text-white font-medium text-base"
                      >
                        Rate:{" "}
                        <span className="text-gray-400 text-base">
                          {Number(item.vote_average || 0).toFixed(1)}
                        </span>
                      </Typography>
                      <RatingWithStars
                        rate={item.vote_average || 0}
                        className="text-base"
                      />
                    </div>
                    {showMoreMap[item.id] ? (
                      <Typography className="text-white text-sm">
                        <span className="text-gray-400">Overview</span>:{" "}
                        {item.overview || "No overview available"}
                        <button
                          className="underline text-blue-500"
                          onClick={() => toggleShowMore(item.id)}
                        >
                          Show less
                        </button>
                      </Typography>
                    ) : (
                      <Typography className="text-gray-400 text-sm">
                        <span className="text-[1.1em] text-white">
                          Overview
                        </span>
                        :{" "}
                        {item.overview
                          ? item.overview.slice(0, 14) + "..."
                          : "No overview available"}
                        <button
                          className="underline text-blue-500"
                          onClick={() => toggleShowMore(item.id)}
                        >
                          Show more
                        </button>
                      </Typography>
                    )}
                  </CardBody>
                  <CardFooter className="pt-3 flex justify-center">
                    <Link
                      to={
                        type === "movies"
                          ? `/movie/${item.id}`
                          : `/series/${item.id}`
                      }
                    >
                      <Button
                        className="hover:bg-light-blue-500 hover:text-black mt-2"
                        size="sm"
                        color="blue"
                        variant="outlined"
                      >
                        Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white">
            No {type === "movies" ? "movies" : "series"} found for "
            {decodedQuery}".
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
