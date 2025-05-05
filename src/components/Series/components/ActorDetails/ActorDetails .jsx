import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  getPersonDetails,
  getPersonKnownFor,
  getPersonSocialMedia,
} from "../../../Redux/DetailsSeriesSlice/DetailsSeriesSlice";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaImdb,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import Loading from "../../../apiRequestError-Loading/Loading";
import Requesterror from "../../../apiRequestError-Loading/Requesterror";

const ActorDetails = () => {
  const { personId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    PersonDetails,
    PersonDetailsLoading,
    PersonDetailsError,
    PersonKnownFor,
    PersonKnownForLoading,
    PersonKnownForError,
    PersonSocialMedia,
    PersonSocialMediaLoading,
    PersonSocialMediaError,
  } = useSelector((state) => state.SeriesDetails);

  useEffect(() => {
    if (personId) {
      dispatch(getPersonDetails(personId));
      dispatch(getPersonKnownFor(personId));
      dispatch(getPersonSocialMedia(personId));
    } else {
      console.error("Person ID is undefined");
    }
  }, [dispatch, personId]);

  if (PersonDetailsLoading || PersonKnownForLoading || PersonSocialMediaLoading)
    return <Loading />;
  if (PersonDetailsError || PersonKnownForError || PersonSocialMediaError)
    return (
      <div className="py-8">
        <Requesterror />
      </div>
    );
  if (!PersonDetails)
    return <div className="text-white py-8">No details available.</div>;

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <div className="  px-6 py-8 sm:px-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mb-8 ">
          <div className="md:col-span-1">
            <img
              src={
                PersonDetails.profile_path
                  ? `https://image.tmdb.org/t/p/w342${PersonDetails.profile_path}`
                  : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt={PersonDetails.name}
              className="w-full max-w-[300px] h-auto object-cover rounded-lg shadow-md"
            />

            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-4 mt-5">
                {PersonSocialMedia?.facebook_id && (
                  <Link
                    to={`https://www.facebook.com/${PersonSocialMedia.facebook_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-blue-500 transition"
                    aria-label="Facebook"
                  >
                    <FaFacebook size={24} />
                  </Link>
                )}
                {PersonSocialMedia?.twitter_id && (
                  <Link
                    to={`https://www.twitter.com/${PersonSocialMedia.twitter_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-blue-400 transition"
                    aria-label="Twitter"
                  >
                    <FaTwitter size={24} />
                  </Link>
                )}
                {PersonSocialMedia?.instagram_id && (
                  <Link
                    to={`https://www.instagram.com/${PersonSocialMedia.instagram_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-pink-500 transition"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={24} />
                  </Link>
                )}
                {PersonSocialMedia?.youtube_id && (
                  <Link
                    to={`https://www.youtube.com/${PersonSocialMedia.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-red-500 transition"
                    aria-label="YouTube"
                  >
                    <FaYoutube size={24} />
                  </Link>
                )}
                {PersonSocialMedia?.tiktok_id && (
                  <Link
                    to={`https://www.tiktok.com/@${PersonSocialMedia.tiktok_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-red-800 transition"
                    aria-label="TikTok"
                  >
                    <FaTiktok size={24} />
                  </Link>
                )}
                {PersonSocialMedia?.imdb_id && (
                  <Link
                    to={`https://www.imdb.com/name/${PersonSocialMedia.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-yellow-500 transition"
                    aria-label="IMDb"
                  >
                    <FaImdb size={24} />
                  </Link>
                )}
                {!PersonSocialMedia?.facebook_id &&
                  !PersonSocialMedia?.twitter_id &&
                  !PersonSocialMedia?.instagram_id &&
                  !PersonSocialMedia?.youtube_id &&
                  !PersonSocialMedia?.tiktok_id &&
                  !PersonSocialMedia?.imdb_id &&
                  alert("This Page is not found")}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-8 text-white break-words">
              {PersonDetails.name}
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold  mt-4 md:mt-0 text-light-blue-400">
              Biography
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed break-words">
              {PersonDetails.biography || "No biography available."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 ">
          <div className="md:col-span-1">
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-light-blue-400">
                Personal Info
              </h2>
              <div className="space-y-2 text-sm sm:text-base">
                <p className="break-words">
                  <strong className="text-light-blue-400">Known For:</strong>{" "}
                  {PersonDetails.known_for_department || "Acting"}
                </p>
                <p>
                  <strong className="text-light-blue-400">
                    Known Credits:
                  </strong>{" "}
                  {PersonKnownFor.length || "N/A"}
                </p>
                <p>
                  <strong className="text-light-blue-400">Gender:</strong>{" "}
                  {PersonDetails.gender === 2
                    ? "Male"
                    : PersonDetails.gender === 1
                    ? "Female"
                    : "N/A"}
                </p>
                <p>
                  <strong className="text-light-blue-400">Birthday:</strong>{" "}
                  {PersonDetails.birthday || "Sorry No Brithday"}
                </p>
                <p className="break-words">
                  <strong className="text-light-blue-400">
                    Place of Birth:
                  </strong>{" "}
                  {PersonDetails.place_of_birth || "Sorry No place of birth"}
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-light-blue-400">
                Also Known As
              </h2>
              <div className="text-gray-300 text-sm sm:text-base space-y-1">
                {PersonDetails.also_known_as?.length > 0
                  ? PersonDetails.also_known_as.map((name, index) => (
                      <p key={index} className="break-words">
                        {name}
                      </p>
                    ))
                  : "N/A"}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="mb-2">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-light-blue-400">
                Known For
              </h2>
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory">
                {PersonKnownFor.length > 0 ? (
                  PersonKnownFor.map((work) => (
                    <div
                      key={work.id}
                      className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] rounded-lg shadow-sm bg-gray-900 snap-start"
                    >
                      <img
                        src={
                          work.poster_path
                            ? `https://image.tmdb.org/t/p/w185${work.poster_path}`
                            : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                        }
                        alt={work.title || work.name}
                        className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-t-lg cursor-pointer"
                        onClick={() => navigate(`/series/${work.id}`)}
                      />
                      <div className="p-2 text-center">
                        <h3 className="text-sm sm:text-base font-medium text-white truncate">
                          {work.title || work.name}
                        </h3>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm sm:text-base">
                    No known works available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorDetails;
