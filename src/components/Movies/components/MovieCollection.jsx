import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMoviecollection } from "../../Redux/DetailsMoviesSlice/movieDetailsSlice";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const MovieCollection = ({ collectionId, movieId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { movieCollection } = useSelector((state) => state.onemoviedetails);

  useEffect(() => {
    dispatch(getMoviecollection(collectionId));
  }, [collectionId]);

  return (
    <section className="min-h-[50vh]  flex flex-col items-center justify-center text-white text-center px-4 py-8 gap-5">
      <h1 className="text-[2em] font-bold">{movieCollection.name}</h1>
      <div>
        <h2 className=" mb-4 text-[1.8em] text-blue-500 font-semibold">
          Includes:
        </h2>
        {movieCollection.parts?.map((part, index) => (
          <h2 key={part.id} className="text-base text-[1.5em]">
            <span className="text-blue-500 text-[1.5em] font-semibold">
              {index + 1}:
            </span>{" "}
            <span className="text-[1.5em]">{part.title}</span>
          </h2>
        ))}
        <Button
          onClick={() =>
            navigate(`/movie/${movieId}/collection/${collectionId}`)
          }
          variant="text"
          className="mt-4 bg-transparent border border-white rounded-full text-gray-700 hover:text-blue-700 hover:text-[1.5em] hover:bg-white  font-extrabold">
          View the Collection
        </Button>
      </div>
    </section>
  );
};

export default MovieCollection;
