import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../apiRequestError-Loading/Loading";

const AllPoster = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const seriesDetails = useSelector(
    (state) => state.SeriesDetails.seriesDetails
  );
  const { seriesImages, seriesImagesLoading, seriesImagesError } = useSelector(
    (state) => state.SeriesDetails
  );

  const releaseYear = seriesDetails?.first_air_date
    ? new Date(seriesDetails.first_air_date).getFullYear()
    : "N/A";

  return (
    <div className="p-4 text-white bg-black min-h-screen">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 px-5">
        <img
          src={
            seriesDetails?.poster_path
              ? `https://image.tmdb.org/t/p/w300${seriesDetails.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={seriesDetails?.name || "Series Poster"}
          className="w-48 h-72 object-cover rounded-md"
        />
        <div className="text-center md:text-left mt-5">
          <h1 className="text-3xl font-bold mb-2">
            {seriesDetails?.name || "Series Name"}
          </h1>
          <p className="text-gray-300 mb-4">Year: {releaseYear}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Back to Series
          </button>
        </div>
      </div>

      <div className="px-5">
        <h2 className="text-2xl font-bold mb-4">
          Posters{" "}
          <span className="text-blue-700">
            ({seriesImages?.posters?.length})
          </span>
        </h2>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {seriesImagesLoading ? (
            <Loading />
          ) : seriesImagesError ? (
            <p className="text-red-500">
              Error fetching images: {seriesImagesError}
            </p>
          ) : seriesImages?.posters?.length > 0 ? (
            seriesImages.posters.map((poster, index) => (
              <img
                key={index}
                src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                alt="Poster"
                className="w-full aspect-[2/3] object-cover rounded"
              />
            ))
          ) : (
            <p className="text-white">No posters available for this series.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPoster;
