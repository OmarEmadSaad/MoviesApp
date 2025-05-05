import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CastCrewPageHeader from "../components/CastCrewPageHeader";
import ReviewCard from "../components/ReviewCard";
import {
  getMovieDetails,
  getMovieReviews,
} from "../../Redux/DetailsMoviesSlice/movieDetailsSlice";
import { useParams } from "react-router-dom";

const MovieReviewPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { movieDetails, MovieReviews } = useSelector((state) => {
    return state.onemoviedetails;
  });



  useEffect(() => {
    dispatch(getMovieDetails(id));
    dispatch(getMovieReviews(id));
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
      <div>
        {MovieReviews.map((review) => {
          return <ReviewCard key={review.id} all={true} MovieReviews={review} />;
        })}
      </div>
    </div>
  );
};

export default MovieReviewPage;
