// // import React from "react";

// // const RecomindationCard = () => {
// //   return <div className="bg-red-700 text-white">RecomindationCard</div>;
// // };

// export default RecomindationCard;

// function RecomindationCard() {
//   const settings = {
//     dots: true,
//     infinite: true,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     speed: 2000,
//     autoplaySpeed: 2000,
//     cssEase: "linear",
//     responsive: [
//       {
//         breakpoint: 1024, // أقل من lg
//         settings: {
//           slidesToShow: 2,
//         },
//       },
//       {
//         breakpoint: 768, // أقل من md
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//     ],
//   };
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   const { movieRecommendations } = useSelector((state) => {
//     return state.onemoviedetails;
//   });
//   console.log("movieRecommendations", movieRecommendations);

//   useEffect(() => {
//     dispatch(getMovieRecommendatios(id));
//   }, [id]);
//   return (
//     <div className="slider-container   ">
//       <Slider {...settings}>
//         {movieRecommendations.map((movie) => {
//           return (
//             <div
//               key={movie.id}
//               className="  text-center bg-red-500  px-10 py-5  hover:scale-110 translation-all duration-300  w-full    ">
//               <img
//                 className="w-full h-[22em] object-cover object-center "
//                 src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//                 alt="no image"
//               />
//               <div className="flex items-center justify-between">
//                 <span className="text-white text-[2em]">{movie.title}</span>
//                 <span className="text-[2em]">
//                   {((+movie.vote_average / 10) * 100).toFixed(0)}
//                 </span>
//               </div>
//             </div>
//           );
//         })}
//       </Slider>
//     </div>
//   );
// }

// export default RecomindationCard;

// export default function RecomindationCard() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const { movieRecommendations } = useSelector(
//     (state) => state.onemoviedetails
//   );

//   useEffect(() => {
//     dispatch(getMovieRecommendatios(id));
//   }, [id]);

//   return (
//     <div className="px-4 py-6">
//       <h2 className="text-2xl text-white font-bold mb-4">Recommendations</h2>
//       <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {movieRecommendations.map((movie) => (
//           <div
//             key={movie.id}
//             className="bg-red-500 rounded-md overflow-hidden p-4 hover:scale-105 transition-all duration-300">
//             <img
//               className="w-full h-[22em] object-cover object-center rounded"
//               src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//               alt={movie.title}
//             />
//             <div className="flex items-center justify-between mt-4">
//               <span className="text-white text-lg font-semibold">
//                 {movie.title}
//               </span>
//               <span className="text-white text-lg font-bold">
//                 {((+movie.vote_average / 10) * 100).toFixed(0)}%
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";
import { getMovieRecommendatios } from "../../Redux/DetailsMoviesSlice/movieDetailsSlice";

export default function RecomindationCard() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { movieRecommendations } = useSelector(
    (state) => state.onemoviedetails
  );

  useEffect(() => {
    dispatch(getMovieRecommendatios(id));
  }, [id]);

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl text-white font-bold mb-4">Recommendations</h2>
      <div className="flex overflow-x-auto overflow-hidden space-x-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {movieRecommendations.map((movie) => (
          <div
            key={movie.id}
            className=" bg-gray-800 rounded-md overflow-hidden p-4 flex-shrink-0 hover:scale-105 transition-all duration-300">
            <Link to={`/movie/${movie.id}`}>
              <img
                className="w-full h-[22em] object-cover object-center rounded"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-white text-lg font-semibold">
                  {movie.title}
                </span>
                <span className="text-white text-lg font-bold">
                  {((+movie.vote_average / 10) * 100).toFixed(0)}%
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
