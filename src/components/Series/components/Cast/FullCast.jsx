import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FullCast = () => {
  const navigate = useNavigate();
  const cast = useSelector(
    (state) => state.SeriesDetails.seriescastDetails.cast
  );
  const crew = useSelector(
    (state) => state.SeriesDetails.seriescastDetails.crew
  );
  const seriesDetails = useSelector(
    (state) => state.SeriesDetails.seriesDetails
  );

  const posterUrl = seriesDetails?.poster_path
    ? `https://image.tmdb.org/t/p/w300${seriesDetails.poster_path}`
    : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  const releaseYear = seriesDetails?.first_air_date
    ? new Date(seriesDetails.first_air_date).getFullYear()
    : "N/A";

  const groupedCrew = crew.reduce((acc, member) => {
    const department = member.department || "Other";
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(member);
    return acc;
  }, {});

  return (
    <div className="p-4 text-white min-h-screen">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 px-5">
        <img
          src={posterUrl}
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
            Back To Series
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12 px-5">
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">
            Cast <span className="text-blue-900">{cast.length}</span>
          </h2>
          <div className="flex flex-col gap-4">
            {cast.length > 0 ? (
              cast.map((actor) => (
                <div
                  key={actor.id}
                  className="max-w-[200px] bg-blue-gray-600 rounded-md shadow-md"
                >
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                        : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                    }
                    alt={actor.name}
                    className="w-full h-60 object-cover rounded-t-md"
                    onClick={() => {
                      navigate(
                        `/person/${actor.id}/hisname/${actor.name
                          .replace(/\s+/g, "-")
                          .toLowerCase()}`
                      );
                    }}
                  />
                  <div className="p-2 text-center">
                    <h3 className="text-white text-xl">{actor.name}</h3>
                    <p className="text-[13px] text-gray-300">
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <h1>No cast records available.</h1>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">
            Crew <span className="text-blue-900">{crew.length}</span>
          </h2>
          <div className="flex flex-col gap-8">
            {Object.keys(groupedCrew).length > 0 ? (
              Object.keys(groupedCrew).map((department) => (
                <div key={department} className="w-full">
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    {department}{" "}
                    <span className="text-light-blue-800 text-2xl">
                      ({department.length})
                    </span>
                  </h3>
                  <div className="flex flex-col gap-4">
                    {groupedCrew[department].map((member) => (
                      <div
                        key={member.credit_id}
                        className="max-w-[150px] bg-blue-gray-600 rounded-md shadow-md"
                      >
                        <img
                          src={
                            member.profile_path
                              ? `https://image.tmdb.org/t/p/w300${member.profile_path}`
                              : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                          }
                          alt={member.name}
                          className="w-full h-60 object-cover rounded-t-md hover:cursor-pointer"
                          onClick={() => {
                            navigate(
                              `/person/${actor.id}/hisname/${actor.name
                                .replace(/\s+/g, "-")
                                .toLowerCase()}`
                            );
                          }}
                        />
                        <div className="p-2 text-center">
                          <h4 className="text-white text-lg">{member.name}</h4>
                          <p className="text-[12px] text-gray-300">
                            {member.job}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <h1>There are no crew records added.</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullCast;
