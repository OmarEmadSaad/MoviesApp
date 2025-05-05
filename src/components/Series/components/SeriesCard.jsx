import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import RatingWithStars from "../../Movies/components/RatingWithStars";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SeriesCard({
  poster_path,
  name,
  vote_average,
  overview,
  id,
}) {
  const [showmore, setshowmore] = useState(true);

  return (
    <div className="flex items-center justify-center mb-7">
      <Card className="w-72 md:w-80 lg:w-80 shadow-lg bg-gray-900">
        <CardHeader floated={false} color="blue-gray">
          <img
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={name}
            className="w-full h-96 object-cover"
            loading="lazy"
          />
          <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />
        </CardHeader>
        <CardBody className="p-2">
          <Typography
            className="font-medium text-white truncate max-w-[150px] text-lg"
            variant="h4"
          >
            Title: <span className="text-gray-400 text-base">{name}</span>
          </Typography>
          <div className="flex items-center justify-between py-2">
            <Typography
              variant="h3"
              className="text-white font-medium text-base"
            >
              Rate:{" "}
              <span className="text-gray-400 text-base">
                {Number(vote_average).toFixed(1)}
              </span>
            </Typography>
            <RatingWithStars rate={vote_average} className="text-base" />
          </div>
          {showmore ? (
            <Typography className="text-gray-400 text-sm">
              <span className="text-[1.1em] text-white">Overview</span>:{" "}
              {overview.slice(0, 14)}...
              <button
                className="underline text-blue-500"
                onClick={() => setshowmore(false)}
              >
                Show more
              </button>
            </Typography>
          ) : (
            <Typography className="text-white text-sm">
              <span className="text-gray-400">Overview</span>: {overview}
              <button
                className="underline text-blue-500"
                onClick={() => setshowmore(true)}
              >
                Show less
              </button>
            </Typography>
          )}
        </CardBody>
        <CardFooter className="pt-3 flex justify-center">
          <Link to={`/series/${id}`}>
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
