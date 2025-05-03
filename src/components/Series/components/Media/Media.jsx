import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSeriesAllVideos,
  getSeriesImages,
} from "../../../Redux/DetailsSeriesSlice/DetailsSeriesSlice";
import Loading from "../../../apiRequestError-Loading/Loading";

const Media = () => {
  const [activeTab, setActiveTab] = useState("videos");

  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const {
    seriesAllVideos,
    seriesAllVideosLoading,
    seriesAllVideosError,
    seriesImages,
    seriesImagesLoading,
    seriesImagesError,
  } = useSelector((state) => state.SeriesDetails);

  useEffect(() => {
    if (id) {
      dispatch(getSeriesAllVideos(id));
      dispatch(getSeriesImages(id));
    }
  }, [id, dispatch]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="media-section px-4 py-6 ">
      <div className="tabs flex space-x-4 mb-4 overflow-x-auto">
        {["videos", "backdrops", "posters"].map((tab) => (
          <button
            key={tab}
            className={`uppercase text-white font-semibold px-4 py-2 rounded ${
              activeTab === tab ? "border-b-2 border-purple-500" : ""
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} (
            {tab === "videos"
              ? seriesAllVideos?.length
              : tab === "backdrops"
              ? seriesImages?.backdrops?.length
              : seriesImages?.posters?.length}
            )
          </button>
        ))}
      </div>

      <div className="content w-[90%] mx-auto sm:w-[53%] sm:mx-0 bg-gray-800  p-4 rounded flex justify-center items-center">
        {activeTab == "videos" && (
          <div className="flex gap-4 overflow-x-auto whitespace-nowrap">
            {seriesAllVideosLoading ? (
              <Loading />
            ) : seriesAllVideosError ? (
              <p className="text-red-500">
                Error fetching videos: {seriesAllVideosError}
              </p>
            ) : seriesAllVideos?.length > 0 ? (
              <>
                {seriesAllVideos.slice(0, 2).map((video) => (
                  <div key={video.id} className="video-item w-[300px] shrink-0">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      className="w-full h-48 rounded"
                      allowFullScreen
                    />
                  </div>
                ))}
                {seriesAllVideos.length > 1 && (
                  <div className="flex items-center justify-center bg-gray-700 rounded w-[300px] h-48 shrink-0">
                    <button
                      onClick={() =>
                        navigate(`/series/${effectiveSeriesId}/videos`)
                      }
                      className="text-white font-medium hover:text-purple-400 transition w-full h-full"
                    >
                      Show more
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-white">No videos available for this series.</p>
            )}
          </div>
        )}

        {activeTab == "backdrops" && (
          <div className="flex gap-4 overflow-x-auto whitespace-nowrap">
            {seriesImagesLoading ? (
              <Loading />
            ) : seriesImagesError ? (
              <p className="text-red-500">
                Error fetching images: {seriesImagesError}
              </p>
            ) : seriesImages?.backdrops?.length > 0 ? (
              <>
                {seriesImages.backdrops.slice(0, 3).map((backdrop, index) => (
                  <img
                    key={index}
                    src={`https://image.tmdb.org/t/p/w500${backdrop.file_path}`}
                    alt="Backdrop"
                    className="w-[200px] aspect-[2/3] object-cover rounded shrink-0"
                  />
                ))}
                {seriesImages.backdrops.length > 3 && (
                  <div className="flex items-center justify-center bg-gray-700 rounded w-[200px] h-[300px] shrink-0">
                    <button
                      onClick={() =>
                        navigate(`/series/${effectiveSeriesId}/backdrops`)
                      }
                      className="text-white font-medium hover:text-purple-400 transition"
                    >
                      Show more
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-white">
                No backdrops available for this series.
              </p>
            )}
          </div>
        )}

        {activeTab == "posters" && (
          <div className="flex gap-4 overflow-x-auto whitespace-nowrap">
            {seriesImagesLoading ? (
              <Loading />
            ) : seriesImagesError ? (
              <p className="text-red-500">
                Error fetching images: {seriesImagesError}
              </p>
            ) : seriesImages?.posters?.length > 0 ? (
              <>
                {seriesImages.posters.slice(0, 3).map((poster, index) => (
                  <img
                    key={index}
                    src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                    alt="Poster"
                    className="w-[200px] aspect-[2/3] object-cover rounded shrink-0"
                  />
                ))}
                {seriesImages.posters.length > 3 && (
                  <div className="flex items-center justify-center bg-gray-700 rounded w-[200px] aspect-[2/3] shrink-0">
                    <button
                      onClick={() =>
                        navigate(`/series/${effectiveSeriesId}/posters`)
                      }
                      className="text-white font-medium hover:text-purple-400 transition"
                    >
                      Show more
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-white">
                No posters available for this series.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Media;
