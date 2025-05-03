import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMovieCastDetails } from "../../Redux/DetailsMoviesSlice/movieDetailsSlice";

const MovieCastCrew = () => {
  const { moviecrew, moviecastDetails } = useSelector((state) => {
    return state.onemoviedetails;
  });
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getMovieCastDetails(id));
  }, [id]);
  return (
    <div className="bg-red-500 h-[50vh]">
      MovieCastCrew
      <div>
        {moviecrew?.map((person, index) => {
          return <div key={`crew${index}`}>{person.name}</div>;
        })}
      </div>
      <div>
        {moviecastDetails.cast?.map((actor) => {
          return <div key={`cast${actor.id}`}>{actor.name} </div>;
        })}
      </div>
    </div>
  );
};

export default MovieCastCrew;

