import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getMovieCastDetails,
  getMovieDetails,
} from "../../Redux/DetailsMoviesSlice/movieDetailsSlice";
import { CrewCard } from "../components/CrewCard";
import { CastCard } from "../components/CastCard";
import CastCrewPageHeader from "../components/CastCrewPageHeader";

const MovieCastCrew = () => {
  const {
    movieDetails,
    moviecrew,
    moviecastDetails,
    arrangecrewacordingtorole,
  } = useSelector((state) => {
    return state.onemoviedetails;
  });
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(getMovieDetails(id));
    dispatch(getMovieCastDetails(id));
  }, [id]);

  return (
    <div>
      <div>
        <CastCrewPageHeader
          poster_path={movieDetails.poster_path}
          release_date={movieDetails.release_date}
          title={movieDetails.title}
        />
      </div>
      <div className="flex flex-col items-center justify-center lg:flex-row  lg:items-start lg:justify-evenly  bg-transparent ">
        <section className=" flex flex-col items-center">
          <div className="text-white flex gap-2 self-start pl-10 items-center">
            <span className="text-[1.9em] ml-2 ">cast </span>{" "}
            <span className="text-blue-500 text-[1.8em] ">
              {moviecastDetails.cast?.length}
            </span>
          </div>
          {moviecastDetails.cast?.map((actor, index) => {
            return (
              <CastCard
                character={actor.character}
                name={actor.name}
                profile_path={actor.profile_path}
                key={index - 1}
              />
            );
          })}
        </section>

        <section className="  flex flex-col items-center">
          <div className="text-white self-start pl-10">
            <span className="text-[1.9em] ">crew </span>{" "}
            <span className="text-blue-500 text-[1.8em]">
              {moviecrew.length}
            </span>
          </div>
          {Object.entries(arrangecrewacordingtorole).map((jobArr, index) => {
            return (
              <Fragment key={index}>
                <h2 className="text-blue-500 text-center text-[1.5em] md:text-[2em] font-bold ">
                  {jobArr[0]}
                </h2>
                {jobArr[1].map((person, index) => {
                  return (
                    <CrewCard
                      key={index}
                      job={person.job}
                      name={person.name}
                      profile_path={person.profile_path}
                    />
                  );
                })}
              </Fragment>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default MovieCastCrew;
