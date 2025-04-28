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

export default function SeriesCard({
  poster_path,
  name,

  vote_average,
  overview,
}) {
  const [showmore, setshowmore] = useState(true);

  return (
    <div className="flex items-center justify-center mb-7">
      <Card className="w-full max-w-[27rem] shadow-lg bg-gray-900  ">
        <CardHeader floated={false} color="blue-gray">
          <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} />

          <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60 " />
        </CardHeader>
        <CardBody className="relative">
          <Typography
            className="text-gray-400 mb-1 font-bold h-[2.7em] "
            variant="h4">
            title : <span className="text-white">{name}</span>
          </Typography>

          {showmore ? (
            <Typography className="text-white" variant="h5">
              <span className="text-[1.1em] text-gray-400">overview</span> :{" "}
              {overview.slice(0, 14)}...
              <button
                className="underline text-blue-500"
                onClick={() => {
                  setshowmore(false);
                }}>
                {" "}
                show more
              </button>
            </Typography>
          ) : (
            <Typography className="text-white" variant="h5">
              <span className="text-gray-400">overview</span>:{overview}
              <button
                className="underline text-blue-500"
                onClick={() => {
                  setshowmore(true);
                }}>
                {" "}
                show less
              </button>
            </Typography>
          )}
          <div className=" flex items-center justify-between py-5">
            <Typography variant="h3" className="text-gray-400 font-medium">
              rate :
              <span className="text-white">
                {" "}
                {Number(vote_average).toFixed(2)}
              </span>
            </Typography>

            <RatingWithStars rate={vote_average} />
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
