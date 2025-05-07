import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getMovieCastDetails,
  getMoviecollection,
  getMovieDetails,
} from "../../Redux/DetailsMoviesSlice/movieDetailsSlice";

import { CastCard } from "../components/CastCard";
import { CrewCard } from "../components/CrewCard";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import ColectionMovieCarddown from "../components/ColectionMovieCarddown";

const MovieCollectionPage = () => {
  const { movieId, id } = useParams();
  const dispatch = useDispatch();
  const { moviecastDetails, movieCollection, movieDetails } = useSelector(
    (state) => {
      return state.onemoviedetails;
    }
  );

  useEffect(() => {
    dispatch(getMoviecollection(id));
    getMovieDetails(movieId);
    getMovieCastDetails(movieId);
  }, [id, movieId]);

  return (
    <div>
      <section
        className="relative bg-cover bg-center bg-no-repeat min-h-[70vh] sm:min-h-[60vh] md:min-h-[70vh]"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movieCollection.backdrop_path})`,
        }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent">
          <h2 className="text-light-blue-500 text-center py-2 text-2xl sm:text-3xl md:text-4xl">
            Movie-Details
          </h2>
        </div>

        <Card className="bg-transparent w-full flex-col justify-evenly items-center lg:flex-row">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-10 md:py-12 flex flex-col lg:flex-row gap-8 sm:gap-12 md:gap-16">
            <div className="w-full lg:w-[320px] flex-shrink-0 flex justify-center lg:justify-start">
              <img
                src={`https://image.tmdb.org/t/p/w500${movieCollection.poster_path}`}
                alt="Poster"
                className="rounded-xl w-48 sm:w-64 md:w-72 h-[50vh] md:h-[60vh] lg:h-[70vh] shadow-lg mt-2"
              />
            </div>
            <CardBody className="flex flex-col items-center lg:items-start justify-around h-[80%] gap-3 sm:gap-4 md:gap-5">
              <Typography
                variant="h6"
                color="white"
                className="text-base sm:text-lg md:text-[1.5em] mb-2 sm:mb-3 md:mb-4 uppercase text-center lg:text-left">
                {movieCollection.name || "No name available"}
              </Typography>

              <Typography
                variant="h6"
                color="white"
                className="text-sm sm:text-base md:text-[1.2em] mb-2 sm:mb-3 md:mb-4 uppercase text-center lg:text-left">
                <span>👉</span>
                {movieDetails.genres?.map((genre) => (
                  <span key={genre.id}>{genre.name}, </span>
                )) || "No genres available"}
                <span>👈</span>
              </Typography>

              <Typography
                variant="h5"
                color="white"
                className="text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                <span className="text-[0.9em] sm:text-[0.8em] md:text-[1.2em] text-blue-500">
                  overview :{" "}
                </span>
                {movieCollection.overview || "No overview available"}
              </Typography>
              <Typography
                variant="h5"
                color="white"
                className="text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                <span className="text-[0.9em] sm:text-[0.8em] md:text-[1.2em] text-blue-500">
                  number of movies :{" "}
                </span>
                {movieCollection.parts?.length || "Not available"}
              </Typography>
              <Typography
                variant="h5"
                color="white"
                className="text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                <span className="text-[0.9em] sm:text-[0.8em] md:text-[1.2em] text-blue-500">
                  revenue :{" "}
                </span>
                $ {movieDetails.revenue || "No revenue available"}
              </Typography>
            </CardBody>
          </div>
        </Card>
      </section>
      <section className="flex flex-col items-center">
        <h1 className="text-white text-[1.8em] my-5 font-extrabold ">
          Featured Cast
        </h1>
        <div className="flex flex-wrap gap-2 items-center justify-evenly">
          {moviecastDetails.cast?.map((actor, index) => {
            return (
              <CastCard
                collectionpage={true}
                character={actor.character}
                name={actor.name}
                profile_path={actor.profile_path}
                key={index - 1}
              />
            );
          })}
        </div>
      </section>
      <section className="flex flex-col items-center">
        <h1 className="text-white text-[1.8em] my-5 font-extrabold ">
          Featured Crew
        </h1>
        <div className="flex flex-wrap gap-2 items-center justify-evenly">
          {moviecastDetails.crew?.map((person, index) => {
            return (
              <CrewCard
                collectionpage={true}
                key={index}
                job={person.job}
                name={person.name}
                profile_path={person.profile_path}
              />
            );
          })}
        </div>
      </section>

      <section className="flex flex-col md:flex-row">
        {movieCollection.parts?.map((part) => {
          return (
            <ColectionMovieCarddown
              key={part.id}
              overview={part.overview}
              release_date={part.release_date}
              title={part.title}
              poster_path={part.poster_path}
            />
          );
        })}
      </section>
    </div>
  );
};

export default MovieCollectionPage;
