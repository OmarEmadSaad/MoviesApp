import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMovieImages,
  getMovieVideos,
} from "../../Redux/DetailsMoviesSlice/movieDetailsSlice";
import { useParams } from "react-router-dom";

const Moviemedia = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("videos");

  const dispatch = useDispatch();
  const { movievideos, movieImages } = useSelector(
    (state) => state.onemoviedetails
  );
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    dispatch(getMovieVideos(id));
    dispatch(getMovieImages(id));
  }, [id]);

  return (
    <div className="media-section">
      <div className="tabs flex space-x-4 mb-4">
        <button
          className={`uppercase text-white font-semibold px-4 py-2 rounded ${
            activeTab === "videos" ? "border-b-2 border-purple-500" : ""
          }`}
          onClick={() => handleTabChange("videos")}>
          Videos ({movievideos?.length || 0})
        </button>
        <button
          className={`uppercase text-white font-semibold px-4 py-2 rounded ${
            activeTab === "backdrops" ? "border-b-2 border-purple-500" : ""
          }`}
          onClick={() => handleTabChange("backdrops")}>
          Backdrops ({movieImages?.backdrops?.length || 0})
        </button>
        <button
          className={`uppercase text-white font-semibold px-4 py-2 rounded ${
            activeTab === "posters" ? "border-b-2 border-purple-500" : ""
          }`}
          onClick={() => handleTabChange("posters")}>
          Posters ({movieImages?.posters?.length || 0})
        </button>
      </div>

      <div className="content w-[100%] overflow-y-hidden   bg-gray-800 p-4 rounded   ">
        {activeTab === "videos" && (
          <div className=" gap-10 flex overflow-y-hidden ">
            {movievideos?.length > 0 ? (
              movievideos.map((video) => (
                <div key={video.id} className="video-item ">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    className="w-96 h-96"
                    allowFullScreen
                    // loading={"lazy"}
                  />
                  {/* <p className="text-white mt-2">{video.name}</p> */}
                </div>
              ))
            ) : (
              <p className="text-white">No videos available.</p>
            )}
          </div>
        )}

        {activeTab === "backdrops" && (
          <div className="flex gap-10  ">
            {movieImages?.backdrops?.length > 0 ? (
              movieImages.backdrops.map((backdrop, index) => (
                <img
                  key={index}
                  src={`https://image.tmdb.org/t/p/w500${backdrop.file_path}`}
                  alt="Backdrop"
                  className=" w-96 h-96 object-contain rounded"
                  loading={"lazy"}
                />
              ))
            ) : (
              <p className="text-white">No backdrops available.</p>
            )}
          </div>
        )}

        {activeTab === "posters" && (
          <div className="flex gap-10  ">
            {movieImages?.posters?.length > 0 ? (
              movieImages.posters.map((poster, index) => (
                <img
                  key={index}
                  src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                  alt="Poster"
                  className="w-96 h-96 flex-shrink-0 object-cover rounded"
                  loading={"lazy"}
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

export default Moviemedia;
