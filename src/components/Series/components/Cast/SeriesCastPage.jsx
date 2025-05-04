import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SeriesCastPage = () => {
  const cast = useSelector(
    (state) => state.SeriesDetails.seriescastDetails.cast
  );
  const seriesDetails = useSelector(
    (state) => state.SeriesDetails.seriesDetails
  );
  const navigate = useNavigate();

  const goToFullCastPage = () => {
    const seriesId = seriesDetails?.id;
    navigate(`/series/${seriesId}/cast`);
  };

  return (
    <div className="p-2 flex justify-center sm:justify-start">
      {cast.length > 0 ? (
        <div className="flex overflow-x-auto sm:w-[55%] w-[75%] gap-4 pb-4 mt-2 ml-3">
          {cast.slice(0, 10).map((actor) => (
            <div
              key={actor.id}
              className="min-w-[150px] w-auto bg-gray-800 rounded-md shadow-sm hover:shadow-md transition"
            >
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                    : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                }
                alt={actor.name}
                className="w-80 h-56 object-cover rounded-t-md hover:cursor-pointer"
                onClick={() => {
                  navigate(
                    `/person/${actor.id}/hisname/${actor.name
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`
                  );
                }}
              />
              <div className="p-2 text-center">
                <h3 className="font-normal text-white">{actor.name}</h3>
                <p className="text-xs text-white font-normal">
                  {actor.character}
                </p>
              </div>
            </div>
          ))}
          <div className="min-w-[150px] w-auto flex flex-col items-center justify-center bg-blue-gray-600 rounded-md shadow-sm hover:shadow-md transition">
            <button
              onClick={goToFullCastPage}
              className="px-4 py-2 text-white font-medium  rounded hover:text-blue-700 transition"
            >
              Show more
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600"> Sorry No Cast & Craw</p>
      )}
    </div>
  );
};

export default SeriesCastPage;
