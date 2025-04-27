import SeriesCard from "../components/SeriesCard";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getseries } from "../../Redux/slices/seriesPagesSlice";
import PaginationFooter from "../../PaginationFooter/PaginationFooter";
import {
  next,
  prev,
  goToFirstPage,
  goToLastPage,
} from "../../Redux/slices/footerPaginationSeriesSlice";
import Loading from "../../apiRequestError-Loading/Loading";
import Requesterror from "../../apiRequestError-Loading/Requesterror";

const Series = () => {
  const dispatch = useDispatch();
  const footerPaginationseries = useSelector((state) => {
    return state.footerPaginationseries;
  });
  const onepageseriesapi = useSelector((state) => {
    return state.onepageseriesapi;
  });

  useEffect(() => {
    dispatch(getseries(footerPaginationseries.seriesactive));
  }, [footerPaginationseries.seriesactive]);

  if (onepageseriesapi.onepageseriesloading) {
    return <Loading />;
  }
  if (onepageseriesapi.onepageseriesfailedrequest) {
    return <Requesterror />;
  }

  return (
    <div>
      <div className="flex flex-col items-center m-10   text-[1.9em] md:text-[2.2em] lg:text-[2.5em] font-bold text-white">
        <h1 className="">Series</h1>
        <h2 className="">
          PAGE NUMBER {footerPaginationseries.seriesactive} FROM 500
        </h2>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap justify-evenly">
        {onepageseriesapi.onepageseries.map((item) => {
          return (
            <SeriesCard
              key={item.id}
              vote_average={item.vote_average}
              name={item.name}
              poster_path={item.poster_path}
              overview={item.overview}
            />
          );
        })}
      </div>
      <PaginationFooter
        page={footerPaginationseries.seriesactive}
        next={next}
        prev={prev}
        goToFirstPage={goToFirstPage}
        goToLastPage={goToLastPage}
      />
    </div>
  );
};

export default Series;
