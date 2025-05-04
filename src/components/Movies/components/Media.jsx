import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSeriesAllVideos,
  getSeriesImages,
} from "../../Redux/DetailsSeriesSlice/DetailsSeriesSlice";

const Media = ({ seriesId }) => {
  const [activeTab, setActiveTab] = useState("videos");

  const dispatch = useDispatch();
  const { seriesAllVideos, seriesImages } = useSelector(
    (state) => state.SeriesDetails
  );

  useEffect(() => {
    if (seriesId) {
      dispatch(getSeriesAllVideos(seriesId));
      dispatch(getSeriesImages(seriesId));
    }
  }, [seriesId, dispatch]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="media-section">
      <div className="tabs flex space-x-4 mb-4">
        <button
          className={`uppercase text-white font-semibold px-4 py-2 rounded ${
            activeTab === "videos" ? "border-b-2 border-purple-500" : ""
          }`}
          onClick={() => handleTabChange("videos")}>
          Videos ({seriesAllVideos?.length || 0})
        </button>
        <button
          className={`uppercase text-white font-semibold px-4 py-2 rounded ${
            activeTab === "backdrops" ? "border-b-2 border-purple-500" : ""
          }`}
          onClick={() => handleTabChange("backdrops")}>
          Backdrops ({seriesImages?.backdrops?.length || 0})
        </button>
        <button
          className={`uppercase text-white font-semibold px-4 py-2 rounded ${
            activeTab === "posters" ? "border-b-2 border-purple-500" : ""
          }`}
          onClick={() => handleTabChange("posters")}>
          Posters ({seriesImages?.posters?.length || 0})
        </button>
      </div>

      <div className="content w-[55%] overflow-auto max-h-[500px] bg-gray-800 p-4 rounded">
        {activeTab === "videos" && (
          <div className="videos-grid grid grid-cols-1 gap-4">
            {seriesAllVideos?.length > 0 ? (
              seriesAllVideos.map((video) => (
                <div key={video.id} className="video-item">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    className="w-full h-64"
                    allowFullScreen
                  />
                  <p className="text-white mt-2">{video.name}</p>
                </div>
              ))
            ) : (
              <p className="text-white">No videos available.</p>
            )}
          </div>
        )}

        {activeTab === "backdrops" && (
          <div className="backdrops-grid grid grid-cols-2 gap-4">
            {seriesImages?.backdrops?.length > 0 ? (
              seriesImages.backdrops.map((backdrop, index) => (
                <img
                  key={index}
                  src={`https://image.tmdb.org/t/p/w500${backdrop.file_path}`}
                  alt="Backdrop"
                  className="w-full h-auto rounded"
                />
              ))
            ) : (
              <p className="text-white">No backdrops available.</p>
            )}
          </div>
        )}

        {activeTab === "posters" && (
          <div className="posters-grid grid grid-cols-2 gap-4">
            {seriesImages?.posters?.length > 0 ? (
              seriesImages.posters.map((poster, index) => (
                <img
                  key={index}
                  src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                  alt="Poster"
                  className="w-full h-auto rounded"
                />
              ))
            ) : (
              <p className="text-white">No posters available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Media;
