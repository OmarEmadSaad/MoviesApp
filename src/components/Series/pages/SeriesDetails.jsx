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
import Loading from "../../apiRequestError-Loading/Loading";
import Requesterror from "../../apiRequestError-Loading/Requesterror";
import {
  getSeriesTrialVideo,
  getSeriesDetails,
  getSeriesCastDetails,
} from "../../Redux/DetailsSeriesSlice/DetailsSeriesSlice";
import Videofram from "../../Movies/components/Videofram";
import SeriesCastPage from "../components/Cast/SeriesCastPage";
import LastSeason from "../components/Season/LastSeason";
import Media from "../components/Media/Media";
import Recommendations from "../components/Recommendtions/Recommendations";
import RightSideDetails from "../components/RightSide/RightSideDetails";
import Social from "../components/Socail/Social";

const SeriesDetails = () => {
  const [show, setshow] = useState(false);
  const [fillstar, setfillstar] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const seriesdetails = useSelector((state) => state.SeriesDetails);

  useEffect(() => {
    dispatch(getSeriesDetails(id));
    dispatch(getSeriesTrialVideo(id));
    dispatch(getSeriesCastDetails(id));
  }, [id, dispatch]);

  if (
    !seriesdetails ||
    seriesdetails.seriesDetailsLoading ||
    seriesdetails.seriescastDetailsLoading
  ) {
    return <Loading />;
  }
  if (
    seriesdetails.seriesDetailsError ||
    !seriesdetails.seriesDetails ||
    seriesdetails.seriescastDetailsError
  ) {
    return <Requesterror />;
  }

  const converttime = (minutes) => {
    if (!minutes) return "No runtime available";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const runtime =
    seriesdetails.seriesDetails.episode_run_time &&
    seriesdetails.seriesDetails.episode_run_time.length > 0
      ? seriesdetails.seriesDetails.episode_run_time[0]
      : null;

  const videoSrc = seriesdetails.seriesvideotrailerUrl
    ? `https://www.youtube.com/embed/${seriesdetails.seriesvideotrailerUrl}?modestbranding=1&autohide=1&showinfo=0`
    : "";

  return (
    <div>
      <section
        className="relative bg-cover bg-center bg-no-repeat min-h-[70vh] sm:min-h-[60vh] md:min-h-[70vh]"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${
            seriesdetails.seriesDetails.backdrop_path || ""
          })`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent">
          <h2 className="text-light-blue-500 text-center py-2 text-2xl sm:text-3xl md:text-4xl">
            Series-Details
          </h2>
        </div>
        <Card className="bg-transparent w-full flex-col justify-evenly items-center lg:flex-row">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-10 md:py-12 flex flex-col lg:flex-row gap-8 sm:gap-12 md:gap-16">
            <div className="w-full lg:w-[320px] flex-shrink-0 flex justify-center lg:justify-start">
              <img
                src={`https://image.tmdb.org/t/p/w500${
                  seriesdetails.seriesDetails.poster_path || ""
                }`}
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
                {seriesdetails.seriesDetails.name || "No name available"}
              </Typography>
              <Typography
                variant="h6"
                color="white"
                className="text-sm sm:text-base md:text-[1.2em] mb-2 sm:mb-3 md:mb-4 uppercase text-center lg:text-left"
              >
                {seriesdetails.seriesDetails.first_air_date ||
                  "No release date available"}{" "}
                (
                {seriesdetails.seriesDetails.original_language ||
                  "No original language available"}
                )
              </Typography>
              <Typography
                variant="h6"
                color="white"
                className="text-sm sm:text-base md:text-[1.2em] mb-2 sm:mb-3 md:mb-4 uppercase text-center lg:text-left"
              >
                <span>👉</span>
                {seriesdetails.seriesDetails.genres?.length > 0
                  ? seriesdetails.seriesDetails.genres.map((genre) => (
                      <span key={genre.id}>{genre.name}, </span>
                    ))
                  : "No genres available"}
                <span>👈</span>
              </Typography>
              <Typography
                variant="h4"
                color="white"
                className="text-base sm:text-lg md:text-xl mb-1 sm:mb-2"
              >
                <span>👉</span>
                {converttime(runtime)}
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
                {seriesdetails.seriesDetails.overview ||
                  "No overview available"}
              </Typography>
              <Typography
                as={"div"}
                variant="h4"
                className="mb-1 sm:mb-2 flex flex-col items-center lg:items-start gap-1 sm:gap-2"
              >
                <span className="text-[0.9em] sm:text-[0.8em] md:text-[1em] text-blue-500">
                  casting :
                </span>
                <div className="flex flex-col items-center lg:items-start gap-3 sm:gap-4">
                  <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:gap-6 lg:gap-8">
                    {seriesdetails.seriescastDetails.cast?.length > 0 ? (
                      seriesdetails.seriescastDetails.cast
                        .slice(0, 3)
                        .map((artist) => (
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
                        ))
                    ) : (
                      <span className="text-white">No cast available</span>
                    )}
                  </div>
                  <span className="text-[0.9em] sm:text-[0.8em] md:text-[1em] text-blue-500">
                    Carw :
                  </span>
                  <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:gap-6 lg:gap-8">
                    {seriesdetails.seriescastDetails.crew?.length > 0 ? (
                      seriesdetails.seriescastDetails.crew
                        .slice(0, 3)
                        .map((person) => (
                          <div
                            key={person.id}
                            className="flex flex-col text-[0.75em] sm:text-[0.85em] items-center text-center"
                          >
                            <span className="text-white">{person.name}</span>
                            <span className="text-yellow-700">
                              {person.known_for_department}
                            </span>
                          </div>
                        ))
                    ) : (
                      <span className="text-white">No crew available</span>
                    )}
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
      <div className="flex flex-col lg:flex-row gap-6 mt-6 px-4">
        <div className="w-full lg:w-[70%]">
          <section className="relative py-6 sm:py-8">
            <span className="text-light-blue-600 text-lg sm:text-xl md:text-[1.5em] font-bold">
              Series Cast
            </span>
            <SeriesCastPage />
            <LastSeason />
            <Social />
            <Media />
            <Recommendations />
          </section>
        </div>
        <div className="w-full lg:w-[30%]">
          <RightSideDetails />
        </div>
      </div>
    </div>
  );
};

export default SeriesDetails;
