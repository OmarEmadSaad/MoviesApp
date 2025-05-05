// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import {
//   getpersondetails,
//   getpersonKnownFor,
//   getpersonMovieCredits,
//   getpersonSocialLinks,
// } from "../../Redux/DetailsMoviesSlice/movieDetailsSlice";
// import { Button } from "@material-tailwind/react";
// import { BsFacebook, BsWikipedia } from "react-icons/bs";
// import { FaInstagram, FaTwitter } from "react-icons/fa";

// const PersonPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { persondetails, personSocialLinks, personMovieCredits } = useSelector(
//     (state) => {
//       return state.onemoviedetails;
//     }
//   );

//   useEffect(() => {
//     dispatch(getpersondetails(id));
//     dispatch(getpersonSocialLinks(id));
//     dispatch(getpersonMovieCredits(id));
//     dispatch(getpersonKnownFor(persondetails.name));
//   }, [id]);
//   return (
//     <div className="bg-green-500 flex flex-col w-[95%] mx-auto">
//       <div>
//         <div>
//           <img
//             src={`https://image.tmdb.org/t/p/w500${persondetails.profile_path}`}
//             alt="no images"
//           />
//         </div>{" "}
//         {/* <div>social links</div> */}
//         <div className="flex items-center justify-evenly">
//           {" "}
//           {personSocialLinks.facebook_id && (
//             <Link
//               to={`https://www.facebook.com/${personSocialLinks.facebook_id}`}>
//               <span>
//                 <BsFacebook />
//               </span>
//             </Link>
//           )}
//           {personSocialLinks.twitter_id && (
//             <Link
//               to={`https://www.twitter.com/${personSocialLinks.twitter_id}`}>
//               <span>
//                 <FaTwitter />
//               </span>
//             </Link>
//           )}
//           {personSocialLinks.instagram_id && (
//             <Link>
//               <span
//                 to={`https://www.instagram.com/${personSocialLinks.instagram_id}`}>
//                 <FaInstagram />
//               </span>
//             </Link>
//           )}
//           <Link
//             to={
//               personSocialLinks.wikidata_id &&
//               `https://www.wikidata.org/wiki/${personSocialLinks.wikidata_id}`
//             }>
//             <span>
//               <BsWikipedia />
//             </span>
//           </Link>
//         </div>{" "}
//         <div>
//           <h2>Personal Info</h2>and informtion
//           <div>
//             <p>Known For</p>
//             <p>{persondetails.known_for_department}</p>
//           </div>
//           <div>
//             <p>Known Credits</p>
//             <p>{personMovieCredits.length}</p>
//           </div>
//           <div>
//             <p>Gender</p>
//             <p>{persondetails.gender}</p>
//           </div>
//           <div>
//             <p>Birthday</p>
//             <p>{persondetails.birthday}</p>
//           </div>
//           <div>
//             <p>Place of Birth</p>
//             <p>{persondetails.place_of_birth}</p>
//           </div>
//           <div>
//             <p>Also Known As</p>
//             <p>{persondetails.also_known_as}</p>
//           </div>
//         </div>{" "}
//       </div>
//       <div>
//         {" "}
//         <h1>{persondetails.name}</h1>
//         <div>
//           {" "}
//           <h2>and biography</h2>
//           <p>{persondetails.biography}</p>
//         </div>
//         <div>
//           <h2>known for</h2> <div>and known for images</div>
//         </div>{" "}
//         <Button onClick={() => navigate(-1)}>back a step button</Button>
//       </div>
//       PersonPage
//     </div>
//   );
// };

// export default PersonPage;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getpersondetails,
  getpersonMovieCredits,
  getpersonSocialLinks,
} from "../../Redux/DetailsMoviesSlice/movieDetailsSlice";
import { Button } from "@material-tailwind/react";
import { BsFacebook, BsWikipedia } from "react-icons/bs";
import { FaInstagram, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";
import { ImUser } from "react-icons/im";

const PersonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { persondetails, personSocialLinks, personMovieCredits } = useSelector(
    (state) => state.onemoviedetails
  );

  useEffect(() => {
    dispatch(getpersondetails(id));
    dispatch(getpersonSocialLinks(id));
    dispatch(getpersonMovieCredits(id));
  }, [id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 2 }}
      className="bg-transparent  text-black w-[95%] mx-auto py-6 px-4 flex flex-col lg:flex-row gap-8">
      <div className=" flex flex-col items-center lg:w-1/3 w-full">
        <img
          src={`https://image.tmdb.org/t/p/w500${persondetails.profile_path}`}
          alt="No images"
          className="rounded-xl shadow-md w-full max-w-xs object-cover"
        />

        <div className="flex gap-4 mt-4 text-2xl text-blue-600">
          {personSocialLinks.facebook_id && (
            <Link
              to={`https://www.facebook.com/${personSocialLinks.facebook_id}`}
              target="_blank">
              <BsFacebook />
            </Link>
          )}
          {personSocialLinks.twitter_id && (
            <Link
              to={`https://www.twitter.com/${personSocialLinks.twitter_id}`}
              target="_blank">
              <FaTwitter />
            </Link>
          )}
          {personSocialLinks.instagram_id && (
            <Link
              to={`https://www.instagram.com/${personSocialLinks.instagram_id}`}
              target="_blank">
              <FaInstagram />
            </Link>
          )}
          {personSocialLinks.wikidata_id && (
            <Link
              to={`https://www.wikidata.org/wiki/${personSocialLinks.wikidata_id}`}
              target="_blank">
              <BsWikipedia />
            </Link>
          )}
        </div>

        <div className="mt-6 w-full text-sm space-y-3">
          <h2 className="text-lg font-semibold border-b pb-1 text-white">
            Personal Info
          </h2>
          <div>
            <p className="font-bold text-[1.5em] mb-2  text-blue-600">
              Known For:
            </p>
            <p className="text-white text-[1.2em]">
              {persondetails.known_for_department || "not yet"}
            </p>
          </div>
          <div>
            <p className="font-bold text-[1.5em] mb-2  text-blue-600">
              Known Credits:
            </p>
            <p className="text-white text-[1.2em]">
              {personMovieCredits.length || "there is no credits"}
            </p>
          </div>
          <div>
            <p className="font-bold text-[1.5em] mb-2  text-blue-600">
              Gender:
            </p>
            <p className="text-white text-[1.2em]">
              {persondetails.gender || "no gender provided"}
            </p>
          </div>
          <div>
            <p className="font-bold text-[1.5em] mb-2  text-blue-600 ">
              Birthday:
            </p>
            <p className="text-white text-[1.2em]">
              {persondetails.birthday || "there is no birth day detected"}
            </p>
          </div>
          <div>
            <p className="font-bold text-[1.5em] mb-2  text-blue-600">
              Place of Birth:
            </p>
            <p className="text-white text-[1.2em]">
              {persondetails.place_of_birth ||
                "there is no place_of_birth detected "}
            </p>
          </div>
          <div>
            <p className="font-bold text-[1.5em] mb-2 text-blue-600  ">
              Also Known As:
            </p>
            <p className="text-white text-[1.2em] flex flex-col gap-2">
              {persondetails.also_known_as?.map((name, index) => {
                return <span key={index}> {name} </span>;
              }) || "not yet"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1  flex flex-col items-center ">
        <h1 className="text-[1.5em] font-bold mb-4 text-blue-600 ">
          {persondetails.name}
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semi bold mb-2 text-blue-600">
            Biography
          </h2>
          <p className="text-justify whitespace-pre-wrap text-white  ">
            {persondetails.biography || "there is no bio yet "}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Known For</h2>
          <div className="flex flex-wrap gap-4">
            {personMovieCredits?.slice(0, 3).map((item) => (
              <Link to={`/movie/${item.id}`}>
                <div
                  key={item.id}
                  className="w-[150px] sm:w-[180px] bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-2xl">
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      alt={item.title || item.name}
                      className="w-full h-[220px] object-cover"
                    />
                  ) : (
                    <div className="w-56 h-56 flex justify-center md:pr-7">
                      {" "}
                      <ImUser className=" text-[10em]  text-white" />
                    </div>
                  )}

                  <div className="p-2 text-center">
                    <h3 className="text-sm font-semibold ">
                      {item.title || item.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Button
          onClick={() => navigate(-1)}
          className=" w-[20%] rounded-full transition-all duration-300 bg-transparent hover:bg-blue-500 border text-blue-600 hover:text-white  border-blue-600">
          Back a step
        </Button>
      </div>
    </motion.div>
  );
};

export default PersonPage;
