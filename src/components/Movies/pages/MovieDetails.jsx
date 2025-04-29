import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";
import { BsDatabaseAdd } from "react-icons/bs";
import { BsFillStarFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { FaCirclePlay } from "react-icons/fa6";
import {
  getMovieDetails,
  getMovieCastDetails,
  getMovieTrialVideo,
} from "../../Redux/DetailsMoviesSlice/movieDetailsSlice";
import Loading from "../../apiRequestError-Loading/Loading";
import Requesterror from "../../apiRequestError-Loading/Requesterror";
import Videofram from "../components/Videofram";
import Topbilledslick from "../components/Topbilledslick";

const MovieDetails = () => {
  const [show, setshow] = useState(false);
  const [fillstar, setfillstar] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onemovie = useSelector((state) => {
    return state.onemoviedetails;
  });

  useEffect(() => {
    dispatch(getMovieDetails(id));
    dispatch(getMovieCastDetails(id));
    dispatch(getMovieTrialVideo(id));
  }, [id]);

  if (onemovie.movieDetailsLoading) {
    return <Loading />;
  }
  if (onemovie.movieDetailsError) {
    return <Requesterror />;
  }

  const converttime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const videoSrc = `https://www.youtube.com/embed/${onemovie.movievideotrailerUrl}?modestbranding=1&autohide=1&showinfo=0`;

  return (
    <div>
      <section
        className="relative bg-cover bg-center bg-no-repeat min-h-[70vh] sm:min-h-[60vh] md:min-h-[70vh]"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${onemovie.movieDetails.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent">
          <h2 className="text-light-blue-500 text-center py-2 text-2xl sm:text-3xl md:text-4xl">
            Movie-Details
          </h2>
        </div>

        <Card className="bg-transparent w-full flex-col justify-evenly items-center lg:flex-row">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-10 md:py-12 flex flex-col lg:flex-row gap-8 sm:gap-12 md:gap-16">
            <div className="w-full lg:w-[320px] flex-shrink-0 flex justify-center lg:justify-start">
              <img
                src={`https://image.tmdb.org/t/p/w500${onemovie.movieDetails.poster_path}`}
                alt="Poster"
                className="rounded-xl w-48 sm:w-64 md:w-72 h-[50vh] md:h-[60vh] lg:h-[70vh] shadow-lg mt-2"
              />
            </div>
            <CardBody className="flex flex-col items-center lg:items-start justify-around h-[80%] gap-3 sm:gap-4 md:gap-5">
              <Typography
                variant="h6"
                color="white"
                className="text-base sm:text-lg md:text-[1.5em] mb-2 sm:mb-3 md:mb-4 uppercase text-center lg:text-left"
              >
                {onemovie.movieDetails.title || "No title available"}
              </Typography>
              <Typography
                variant="h6"
                color="white"
                className="text-sm sm:text-base md:text-[1.2em] mb-2 sm:mb-3 md:mb-4 uppercase text-center lg:text-left"
              >
                {onemovie.movieDetails.release_date ||
                  "No release_date available"}{" "}
                (
                {onemovie.movieDetails.original_language ||
                  "No original_language available"}
                )
              </Typography>
              <Typography
                variant="h6"
                color="white"
                className="text-sm sm:text-base md:text-[1.2em] mb-2 sm:mb-3 md:mb-4 uppercase text-center lg:text-left"
              >
                <span>👉</span>
                {onemovie.movieDetails.genres?.map((genre) => (
                  <span key={genre.id}>{genre.name}, </span>
                )) || "No genres available"}
                <span>👈</span>
              </Typography>
              <Typography
                variant="h4"
                color="white"
                className="text-base sm:text-lg md:text-xl mb-1 sm:mb-2"
              >
                <span>👉</span>
                {converttime(onemovie.movieDetails?.runtime) ||
                  "No runtime available"}
                <span>👈</span>
              </Typography>

              <Typography
                variant="h5"
                color="white"
                className="text-sm sm:text-base md:text-lg mb-1 sm:mb-2"
              >
                <span className="text-[0.9em] sm:text-[0.8em] md:text-[1.2em] text-blue-500">
                  overview :{" "}
                </span>
                {onemovie.movieDetails.overview || "No overview available"}
              </Typography>

              <Typography
                as={"div"}
                variant="h4"
                className="mb-1 sm:mb-2 flex flex-col items-center lg:items-start gap-1 sm:gap-2"
              >
                <span className="text-[0.9em] sm:text-[0.8em] md:text-[1em] text-blue-500">
                  casting :
                </span>
                <div className=" flex flex-col items-center lg:items-start gap-3 sm:gap-4">
                  <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:gap-6 lg:gap-8">
                    {onemovie.moviecastDetails.cast
                      ?.slice(0, 3)
                      .map((artist) => {
                        return (
                          <div
                            key={artist.id}
                            className="flex flex-col text-[0.75em] sm:text-[0.85em] items-center"
                          >
                            <span className="text-white w-fit mb-1 sm:mb-2">
                              {artist.name}
                            </span>
                            <span className="text-yellow-700">
                              {artist.known_for_department}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                  <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:gap-6 lg:gap-8">
                    {onemovie.moviecastDetails.moviecrew
                      ?.slice(0, 3)
                      .map((person, index) => {
                        return (
                          <div
                            key={index}
                            className="flex flex-col text-[0.75em] sm:text-[0.85em] items-center text-center"
                          >
                            <span className="text-white">{person.name}</span>
                            <span className="text-yellow-700">
                              {person.known_for_department}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </Typography>
              <Typography
                as={"div"}
                className="my-3 sm:my-4 md:my-5 font-normal flex gap-6 sm:gap-8 md:gap-10"
              >
                <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300">
                  <span>
                    <BsDatabaseAdd className="text-green-800 text-[1.5em] sm:text-[1.5em]" />
                  </span>
                  <span className="text-white text-[0.5em] sm:text-[0.7em] md:text-[0.8em]">
                    add to wishlist
                  </span>
                </div>
                <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300">
                  {fillstar ? (
                    <span onClick={() => setfillstar(false)}>
                      <BsFillStarFill className="text-yellow-500 text-[1.5em] sm:text-[1.8em] hover:text-bg-red-500" />
                    </span>
                  ) : (
                    <span onClick={() => setfillstar(true)}>
                      <FaRegStar className="text-yellow-500 text-[1.5em] sm:text-[1.5em] hover:text-bg-red-500" />
                    </span>
                  )}
                  <span className="text-white text-[0.5em] sm:text-[0.7em] md:text-[0.8em]">
                    rate movie
                  </span>
                </div>
                <div
                  onClick={() => setshow(!show)}
                  className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  <span>
                    <FaCirclePlay className="text-red-500 text-[1.5em] sm:text-[1.5em]" />
                  </span>
                  <span className="text-white text-[0.5em] sm:text-[0.7em] md:text-[0.8em]">
                    play a trail
                  </span>
                </div>
              </Typography>
              <Button
                onClick={() => navigate(-1)}
                className="border-2 transition whitespace-nowrap px-2 py-2 min-w-[80px] text-light-blue-500 hover:text-white hover:bg-blue-800"
                size="sm"
                color="blue"
                variant="outlined"
              >
                back a step
              </Button>
            </CardBody>
          </div>
        </Card>
        {show && (
          <Videofram
            open={show}
            handleOpen={() => setshow(!show)}
            videoSrc={videoSrc}
          />
        )}
      </section>
      <section className="relative py-6 sm:py-8">
        <span className="text-light-blue-600 text-lg sm:text-xl md:text-[1.5em] font-bold ml-4 sm:ml-9">
          top billed cast
        </span>
        <Topbilledslick
          className="relative"
          topbilledcast={onemovie.topbilledcast}
        />
        <Link to={`/movie/${onemovie.movieDetails.id}/cast_crew`}>
          <span className="text-light-blue-600 ml-4 sm:ml-8 text-sm sm:text-base md:text-[1em] hover:text-light-blue-300">
            Full Cast & Crew
          </span>
        </Link>
      </section>
    </div>
  );
};

export default MovieDetails;
