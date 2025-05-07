import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";

export default function ColectionMovieCarddown({
  overview,
  release_date,
  title,
  poster_path,
}) {
  return (
    <Card className=" bg-gray-800 mx-auto w-[90%] sm:w-[80%] md:w-[45%]   items-center   shadow-lg text-white">
      <CardHeader floated={false} color="white">
        <img
          className="h-96 "
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          alt="ui/ux review check"
        />
      </CardHeader>
      <CardBody className=" flex flex-col  items-center ">
        <div className="mb- 3 flex items-center justify-between">
          <Typography variant="h5" color="white" className="font-medium">
            {title}
          </Typography>
        </div>
        <Typography variant="h5" color="white" className="font-medium">
          {release_date}
        </Typography>
        <Typography color="white">
          {overview.slice(0, 150) + " ...."}{" "}
        </Typography>
        <div className="group mt-8 inline-flex flex-wrap items-center gap-3"></div>
      </CardBody>
    </Card>
  );
}
