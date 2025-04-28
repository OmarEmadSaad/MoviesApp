import { Moviecard } from "../components/Moviecard";
import PaginationFooter from "../../PaginationFooter/PaginationFooter";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  next,
  prev,
  goToFirstPage,
  goToLastPage,
} from "../../Redux/MoviesSlice/footerPaginationmoviesSlice";
import Requesterror from "../../apiRequestError-Loading/Requesterror";
import Loading from "../../apiRequestError-Loading/Loading";
import { getonepagemovies } from "../../Redux/MoviesSlice/moviesPagesSlice";

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
      <div className="flex flex-col items-center m-10 text-white font-bold">
        <h1 className="text-3xl md:text-[2.2em] lg:text-[2.5em]">Movies</h1>

        <h2 className="flex flex-col md:flex-row justify-center items-center gap-2 mt-4 text-2xl md:text-[1.5em] lg:text-[1.8em]">
          <span>PAGE NUMBER</span>

          <div className="flex items-center gap-2">
            <span className="text-light-blue-600">
              {footerPaginationmovies.moviesactive}
            </span>
            <span>FROM</span>
            <span className="text-light-blue-600">500</span>
          </div>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
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
