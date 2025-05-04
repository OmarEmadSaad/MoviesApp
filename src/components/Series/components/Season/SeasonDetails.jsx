import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import Loading from "../../../apiRequestError-Loading/Loading";
import Requesterror from "../../../apiRequestError-Loading/Requesterror";
import {
  getSeasonDetails,
  getSeriesDetails,
} from "../../../Redux/DetailsSeriesSlice/DetailsSeriesSlice";

const SeasonDetails = () => {
  const { id, seasonNumber } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const seasonDetails = useSelector(
    (state) => state.SeriesDetails.seasonDetails
  );
  const seasonDetailsLoading = useSelector(
    (state) => state.SeriesDetails.seasonDetailsLoading
  );
  const seasonDetailsError = useSelector(
    (state) => state.SeriesDetails.seasonDetailsError
  );
  const seriesDetails = useSelector(
    (state) => state.SeriesDetails.seriesDetails
  );

  useEffect(() => {
    dispatch(getSeasonDetails({ seriesId: id, seasonNumber }));
    if (!seriesDetails) {
      dispatch(getSeriesDetails(id));
    }
  }, [dispatch, id, seasonNumber, seriesDetails]);

  if (seasonDetailsLoading || !seriesDetails) {
    return <Loading />;
  }

  if (seasonDetailsError || !seasonDetails) {
    return <Requesterror />;
  }

  return (
    <div>
      <section
        className="relative bg-cover bg-center bg-no-repeat min-h-[60vh]"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${
            seriesDetails.backdrop_path || seasonDetails.poster_path || ""
          })`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent">
          <h2 className="text-light-blue-500 text-center py-2 text-2xl md:text-3xl">
            {seriesDetails.name} - {seasonDetails.name}
          </h2>
        </div>
        <Card className="bg-transparent w-full flex-col md:flex-row">
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-[320px] flex-shrink-0 flex justify-center">
              <img
                src={
                  seasonDetails.poster_path
                    ? `https://image.tmdb.org/t/p/w500${seasonDetails.poster_path}`
                    : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg"
                }
                alt={seasonDetails.name}
                className="rounded-xl w-48  mt-3 md:w-72 h-[50vh] md:h-[60vh] shadow-lg"
              />
            </div>
            <CardBody className="flex flex-col items-center md:items-start gap-4">
              <Typography
                variant="h6"
                color="white"
                className="text-lg md:text-xl uppercase text-center md:text-left"
              >
                {seasonDetails.name || "No name available"}
              </Typography>
              <Typography
                variant="h6"
                color="white"
                className="text-base md:text-lg text-center md:text-left"
              >
                Season {seasonDetails.season_number} •{" "}
                {seasonDetails.air_date
                  ? new Date(seasonDetails.air_date).getFullYear()
                  : "N/A"}{" "}
                • {seasonDetails.episodes?.length || "N/A"} Episodes
              </Typography>
              <Typography
                variant="h5"
                color="white"
                className="text-base md:text-lg text-center md:text-left"
              >
                <span className="text-blue-500">Overview: </span>
                {seasonDetails.overview || "No overview available"}
              </Typography>
              <Typography
                variant="h5"
                color="white"
                className="text-base md:text-lg text-center md:text-left"
              >
                <span className="text-blue-500">Episodes: </span>
                {seasonDetails.episodes?.length > 0 ? (
                  <div className="flex flex-col gap-4 mt-2">
                    {seasonDetails.episodes.map((episode) => (
                      <div
                        key={episode.id}
                        className="flex gap-4 bg-gray-900 p-3 rounded-md"
                      >
                        <img
                          src={
                            episode.still_path
                              ? `https://image.tmdb.org/t/p/w200${episode.still_path}`
                              : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg"
                          }
                          alt={episode.name}
                          className="w-24 h-22 object-cover rounded-md"
                          loading="lazy"
                        />
                        <div className="flex flex-col gap-2">
                          <p className="text-white font-bold">
                            {episode.episode_number}. {episode.name}
                          </p>
                          <p className="text-gray-300 text-sm">
                            {episode.runtime ? `${episode.runtime} min` : "N/A"}
                          </p>
                          <p className="text-gray-300 font-normal text-sm line-clamp-2">
                            {episode.overview || "No overview available"}
                          </p>
                          <Button
                            onClick={() => navigate(`/series/${id}/cast`)}
                            className="border-2 px-2 py-1  normal-case font-extralight text-light-blue-500 hover:text-white hover:bg-blue-800 w-fit"
                            size="sm"
                            color="blue"
                            variant="outlined"
                          >
                            Full Cast & Crew
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  "No episodes available"
                )}
              </Typography>
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate(`/series/${id}`)}
                  className="border-2 px-2 py-2 normal-case text-light-blue-500 hover:text-white hover:bg-blue-800"
                  size="sm"
                  color="blue"
                  variant="outlined"
                >
                  Back to Series
                </Button>
                <Button
                  onClick={() => navigate(`/series/${id}/seasons`)}
                  className="border-2 px-2 normal-case py-2 text-light-blue-500 hover:text-white hover:bg-blue-800"
                  size="sm"
                  color="blue"
                  variant="outlined"
                >
                  View All Seasons
                </Button>
              </div>
            </CardBody>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default SeasonDetails;
