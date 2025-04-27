import { Moviecard } from "../components/Moviecard";
import PaginationFooter from "../../PaginationFooter/PaginationFooter";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  next,
  prev,
  goToFirstPage,
  goToLastPage,
} from "../../Redux/slices/footerPaginationmoviesSlice";
import Requesterror from "../../apiRequestError-Loading/Requesterror";
import Loading from "../../apiRequestError-Loading/Loading";
import { getonepagemovies } from "../../Redux/slices/moviesPagesSlice";

const Movies = () => {
  const onepagmoviesapi = useSelector((state) => {
    return state.onepagmoviesapi;
  });
  const footerPaginationmovies = useSelector((state) => {
    return state.footerPaginationmovies;
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getonepagemovies(footerPaginationmovies.moviesactive));
  }, [footerPaginationmovies.moviesactive]);

  if (onepagmoviesapi.onepagemoviesloading) {
    return <Loading />;
  }
  if (onepagmoviesapi.onepagemoviesfailedrequest) {
    return <Requesterror />;
  }

  return (
    <div>
      <div className="flex flex-col items-center m-10   text-[1.9em] md:text-[2.2em] lg:text-[2.5em] font-bold text-white">
        <h1 className="">MOVIES</h1>
        <h2 className="">
          PAGE NUMBER {footerPaginationmovies.moviesactive} FROM 500
        </h2>
      </div>
      <div className="flex flex-col md:flex-row flex-wrap justify-evenly">
        {onepagmoviesapi.onepagemovies?.map((movie) => {
          return (
            <Moviecard
              key={movie.id}
              title={movie.title}
              poster_path={movie.poster_path}
              vote_count={movie.vote_count}
              vote_average={movie.vote_average}
              backdrop_path={movie.backdrop_path}
            />
          );
        })}
      </div>

      <PaginationFooter
        next={next}
        prev={prev}
        goToFirstPage={goToFirstPage}
        goToLastPage={goToLastPage}
        page={footerPaginationmovies.moviesactive}
      />
    </div>
  );
};

export default Movies;
