// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getMoviecollection } from "../../Redux/DetailsMoviesSlice/movieDetailsSlice";
// import { Button } from "@material-tailwind/react";

// const MovieCollection = ({ havecollection, collectiionId }) => {
//   const dispatch = useDispatch();

//   const { movieCollection, movieDetails } = useSelector((state) => {
//     return state.onemoviedetails;
//   });
//   console.log("1111111111", movieCollection);
//   console.log("222222222", movieDetails);

//   useEffect(() => {
//     havecollection && dispatch(getMoviecollection(collectiionId));
//   }, [collectiionId]);

//   return (
//     <div
//       style={{

//       }}
//       className=" text-white flex flex-col items-center text-center py-8 gap-5  ">
//       <h1>{movieCollection.name}</h1>
//       <div>
//         <h2>Includes :</h2>
//         {movieCollection.parts?.map((part, index) => {
//           return (
//             <h2>
//               {+index + 1}: {part.title}
//             </h2>
//           );
//         })}

//         <Button
//           onClick={() => navigate(-1)}
//           variant="text"
//           className=" bg-green-400 items-center  lg:text-[1em]  text-gray-500 hover:text-white ">
//           view the collection
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default MovieCollection;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMoviecollection } from "../../Redux/DetailsMoviesSlice/movieDetailsSlice";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const MovieCollection = ({ havecollection, collectiionId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { movieCollection } = useSelector((state) => state.onemoviedetails);

  useEffect(() => {
    if (havecollection) {
      dispatch(getMoviecollection(collectiionId));
    }
  }, [collectiionId]);

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
          onClick={() => navigate(-1)}
          variant="text"
          className="mt-4 bg-transparent border border-white rounded-full text-gray-700 hover:text-blue-700 hover:text-[1.5em] hover:bg-white  font-extrabold">
          View the Collection
        </Button>
      </div>
    </section>
  );
};

export default MovieCollection;
