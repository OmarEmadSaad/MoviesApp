import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import RatingWithStars from "../../Movies/components/RatingWithStars";
import Loading from "../../apiRequestError-Loading/Loading";

const HomeMoviesCard = () => {
  const movies = useSelector((state) => state.movies.movies);
  const loading = useSelector((state) => state.movies.loading);

  if (loading) {
    return <Loading />;
  }

  const filteredMovies = movies.filter((movie) => movie.vote_average > 7);

  if (!filteredMovies.length) {
    return <p>No movies with rating above 7 found.</p>;
  }

  return (
    <div className="p-4 max-w-full">
      <h1 className="text-light-blue-800 text-4xl mb-8 text-left">
        Top Movies
      </h1>

      <div className="flex flex-wrap justify-center gap-8">
        {filteredMovies.map((movie) => (
          <Card
            key={movie.id}
            className="w-72 md:w-80 lg:w-80 shadow-lg bg-gray-900 flex flex-col justify-between"
          >
            <CardHeader
              floated={false}
              color="blue-gray"
              className="relative h-56"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="h-full w-full object-cover"
              />
              <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />
            </CardHeader>
            <CardBody className="flex-grow">
              <div className="mb-3 flex items-center justify-between w-full">
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="font-medium text-white truncate max-w-[150px] text-lg"
                >
                  {movie.title}
                </Typography>

                <div className="w-[120px] flex justify-end">
                  <RatingWithStars rate={movie.vote_average} />{" "}
                </div>
              </div>
              <Typography variant="paragraph" className="text-white text-sm">
                Rate: {movie.vote_average?.toFixed(1)}
              </Typography>
            </CardBody>
            <CardFooter className="pt-3 flex justify-center mt-auto">
              <Button
                className="hover:bg-light-blue-400 hover:text-black"
                size="sm"
                color="blue"
                variant="outlined"
              >
                Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomeMoviesCard;
