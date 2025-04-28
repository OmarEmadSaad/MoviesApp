import { Button } from "@material-tailwind/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../../Redux/slices/moviesSlice";
import { fetchTvShows } from "../../Redux/slices/seriesSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { motion } from "framer-motion";
import HomeMoviesCard from "./HomeMoviesCard";
import HomeSeriesCard from "./HomeSeriesCard";

const Home = () => {
  const dispatch = useDispatch();
  const {
    movies,
    status: movieStatus,
    error: movieError,
  } = useSelector((state) => state.movies);
  const {
    tvShows,
    status: tvStatus,
    error: tvError,
  } = useSelector((state) => state.series);

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchTvShows());
  }, [dispatch]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    centerMode: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const AnimatedMessage = ({ text, color = "text-white" }) => (
    <motion.p
      className={`text-center text-2xl font-semibold ${color}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}>
      {text}
    </motion.p>
  );

  const sortByButtons = ["Title", "Popularity", "Date", "Rating"];
  const sortOrderButtons = ["Descending", "Ascending"];

  return (
    <div className="flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-blue-500 mb-4 text-center">
        Home
      </h1>

      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-6 px-4">
        <div className="flex flex-col items-center gap-4 w-full md:w-auto">
          <h1 className="text-white text-2xl mb-2">SORT BY</h1>
          <div className="flex gap-4 justify-center">
            {sortByButtons.map((label) => (
              <Button
                key={label}
                variant="outlined"
                size="sm"
                color="white"
                className="capitalize hover:bg-white hover:text-black">
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full md:w-auto">
          <h1 className="text-white text-2xl mb-2">SORT ORDER</h1>
          <div className="flex gap-16 justify-center flex-wrap">
            {sortOrderButtons.map((label) => (
              <Button
                key={label}
                variant="outlined"
                size="sm"
                color="white"
                className="capitalize hover:bg-white hover:text-black">

                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-full mt-12 px-4">
        <h1 className="text-light-blue-800 text-4xl mb-2">Movies</h1>
        {movieStatus === "loading" ? (
          <AnimatedMessage text="Loading Movies 😇..." />
        ) : movieStatus === "failed" ? (
          <AnimatedMessage text={`Error: ${movieError}`} color="text-red-500" />
        ) : (
          <Slider {...settings}>
            {movies.map((movie) => (
              <div key={movie.id} className="p-2 flex justify-center">
                <div className="bg-transparent rounded-lg overflow-hidden w-full max-w-xs sm:max-w-xs md:max-w-xs">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto aspect-[2/3] object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      <div className="w-full max-w-full mt-12 px-4">
        <h1 className="text-light-blue-800 text-4xl mb-2">Series</h1>
        {tvStatus === "loading" ? (
          <AnimatedMessage text="Loading Series 😇..." />
        ) : tvStatus === "failed" ? (
          <AnimatedMessage text={`Error: ${tvError}`} color="text-red-500" />
        ) : (
          <Slider {...settings}>
            {tvShows.map((tvShow) => (
              <div key={tvShow.id} className="p-2 flex justify-center">
                <div className="bg-transparent rounded-lg overflow-hidden w-full max-w-xs sm:max-w-xs md:max-w-xs">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                    alt={tvShow.name}
                    className="w-full h-auto aspect-[2/3] object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      <HomeMoviesCard />
      <HomeSeriesCard />
    </div>
  );
};

export default Home;
