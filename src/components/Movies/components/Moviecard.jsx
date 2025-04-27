import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import MovieRating from "./RatingWithStars";

export function Moviecard({ poster_path, title, vote_count, vote_average }) {
  return (
    <div className="flex items-center justify-center mb-7">
      <Card className="w-full max-w-[26rem] shadow-lg bg-gray-900  ">
        <CardHeader floated={false} color="blue-gray">
          <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} />

          <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60 " />
        </CardHeader>
        <CardBody>
          <Typography
            className="text-gray-400 mb-1 font-bold h-[2.7em] "
            variant="h4">
            title : <span className="text-white">{title}</span>
          </Typography>

          <div className=" flex items-center justify-between">
            <Typography variant="h3" className=" text-gray-400 font-medium">
              rate :{" "}
              <span className="text-white">
                {Number(vote_average).toFixed(2)}
              </span>
            </Typography>

            <MovieRating rate={vote_average} />
          </div>
        </CardBody>
        <CardFooter className="pt-3">
          <Button
            className="text-black bg-gray-500 "
            size="lg"
            fullWidth={true}>
            details
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
