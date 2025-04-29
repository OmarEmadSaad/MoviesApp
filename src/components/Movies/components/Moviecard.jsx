import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import MovieRating from "./RatingWithStars";
import { Link } from "react-router-dom";

export function Moviecard({
  id,
  poster_path,
  title,
  vote_count,
  vote_average,
}) {
  return (
    <div className="flex items-center justify-center mb-7">
      <Card className="w-72 md:w-80 lg:w-80 shadow-lg bg-gray-900">
        <CardHeader floated={false} color="blue-gray">
          <img
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={title}
            className="w-96 h-96 object-cover"
            loading="lazy"
          />
          <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />
        </CardHeader>
        <CardBody className="p-2">
          <Typography
            className="font-medium text-white truncate max-w-[150px] text-lg"
            variant="h4"
          >
            Title: <span className="text-gray-400 text-base">{title}</span>
          </Typography>
          <div className="flex items-center justify-between">
            <Typography
              variant="h3"
              className="text-white font-medium text-base"
            >
              Rate:{" "}
              <span className="text-gray-400 text-base">
                {Number(vote_average).toFixed(1)}
              </span>
            </Typography>
            <MovieRating rate={vote_average} className="text-base" />
          </div>
        </CardBody>
        <CardFooter className="pt-3 flex justify-center">
          <Link to={`/movie/${id}`}>
            <Button
              className="hover:bg-light-blue-500 hover:text-black mt-2"
              size="sm"
              color="blue"
              variant="outlined"
            >
              details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
