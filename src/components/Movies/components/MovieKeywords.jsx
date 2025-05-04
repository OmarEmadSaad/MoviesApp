import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMovieKeywords } from "../../Redux/DetailsMoviesSlice/movieDetailsSlice";
import { Button } from "@material-tailwind/react";

const MovieKeywords = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { movieKeywords } = useSelector((state) => {
    return state.onemoviedetails;
  });

  useEffect(() => {
    dispatch(getMovieKeywords(id));
  }, [id]);

  return (
    <div className="flex justify-evenly flex-wrap gap-3 items-center">
      {movieKeywords.map((keyword) => {
        return (
          <span key={keyword.id}>
            <Button className="bg-white text-black hover:bg-gray-800 hover:text-white">
              {keyword.name}
            </Button>{" "}
          </span>
        );
      })}
    </div>
  );
};

export default MovieKeywords;
