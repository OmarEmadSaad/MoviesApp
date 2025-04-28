import SeriesCard from "../components/SeriesCard";
import PaginationFooter from "../../PaginationFooter/PaginationFooter";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getseries } from "../../Redux/SeriesSlice/seriesPagesSlice";
import {
  next,
  prev,
  goToFirstPage,
  goToLastPage,
} from "../../Redux/SeriesSlice/footerPaginationSeriesSlice";
import Loading from "../../apiRequestError-Loading/Loading";
import Requesterror from "../../apiRequestError-Loading/Requesterror";

const Series = () => {
  const dispatch = useDispatch();
  const footerPaginationseries = useSelector(
    (state) => state.footerPaginationseries
  );
  const onepageseriesapi = useSelector((state) => state.onepageseriesapi);

  useEffect(() => {
    dispatch(getseries(footerPaginationseries.seriesactive));
  }, [footerPaginationseries.seriesactive, dispatch]);

  if (onepageseriesapi.onepageseriesloading) {
    return <Loading />;
  }
  if (onepageseriesapi.onepageseriesfailedrequest) {
    return <Requesterror />;
  }

  return (
    <div>
      <div className="flex flex-col items-center m-10 text-white font-bold">
        <h1 className="text-3xl md:text-[2.2em] lg:text-[2.5em]">Series</h1>

        <h2 className="flex flex-col md:flex-row justify-center items-center gap-2 mt-4 text-2xl md:text-[1.5em] lg:text-[1.8em]">
          <span>PAGE NUMBER</span>

          <div className="flex items-center gap-2">
            <span className="text-light-blue-600">
              {footerPaginationseries.seriesactive}
            </span>
            <span>FROM</span>
            <span className="text-light-blue-600">500</span>
          </div>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
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
