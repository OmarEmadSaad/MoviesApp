import React, { useEffect } from "react";
import { AiFillHome } from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { BsWikipedia } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMovieSocialLinks } from "../../Redux/DetailsMoviesSlice/movieDetailsSlice";

const Social = ({ moviedetails }) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { MovieSocialLinks } = useSelector((state) => {
    return state.onemoviedetails;
  });

  useEffect(() => {
    dispatch(getMovieSocialLinks(id));
  }, [id]);

  return (
    <div className="w-[300px] flex flex-col gap-4   ">
      <div className="flex items-center justify-evenly">
        {" "}
        {MovieSocialLinks.facebook_id && (
          <Link to={`https://www.facebook.com/${MovieSocialLinks.facebook_id}`}>
            <span>
              <BsFacebook />
            </span>
          </Link>
        )}
        {MovieSocialLinks.twitter_id && (
          <Link to={`https://www.twitter.com/${MovieSocialLinks.twitter_id}`}>
            <span>
              <FaTwitter />
            </span>
          </Link>
        )}
        {MovieSocialLinks.instagram_id && (
          <Link>
            <span
              to={`https://www.instagram.com/${MovieSocialLinks.instagram_id}`}>
              <FaInstagram />
            </span>
          </Link>
        )}
        <Link
          to={
            MovieSocialLinks.wikidata_id &&
            `https://www.wikidata.org/wiki/${MovieSocialLinks.wikidata_id}`
          }>
          <span>
            <BsWikipedia />
          </span>
        </Link>
        <Link to={moviedetails.homepage}>
          <span>
            <AiFillHome />
          </span>
        </Link>{" "}
      </div>
      <div>
        <p className="flex flex-col">
          <span>Status</span>{" "}
          <span className="text-blue-600">{moviedetails.status}</span>
        </p>{" "}
        <p className="flex flex-col">
          <span>Original Language</span>{" "}
          <span className="text-blue-600">
            {moviedetails.original_language}
          </span>
        </p>{" "}
        <p className="flex flex-col">
          <span>Budget</span>{" "}
          <span className="text-blue-600">${moviedetails.budget}</span>
        </p>{" "}
        <p className="flex flex-col">
          <span>Revenue</span>{" "}
          <span className="text-blue-600">${moviedetails.revenue}</span>
        </p>{" "}
      </div>
    </div>
  );
};

export default Social;
