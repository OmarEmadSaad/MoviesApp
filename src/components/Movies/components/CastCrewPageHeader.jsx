import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function CastCrewPageHeader({
  poster_path,
  release_date,
  title,
}) {
  const navigate = useNavigate();

  return (
    <Card className=" bg-transparent flex flex-col items-center bg-gray-700 w-full  md:flex-row   ">
      <div className="flex flex-col items-center ">
        <CardHeader
          shadow={false}
          floated={false}
          className="m-2 w-2/5 shrink-0 rounded-r-none hover:shadow-md hover:scale-105 transition-all duration-200">
          <img
            src={`https://image.tmdb.org/t/p/w500${poster_path}` || "not found"}
            alt="card-image"
            className="h-full w-full  object-cover "
          />
        </CardHeader>
      </div>
      <CardBody>
        <div className=" flex flex-col items-center  justify-center   ">
          <Typography
            variant="h6"
            className="flex flex-col text-[1.1em] md:text-[1.7em] lg:text-[2em] lg:whitespace-nowrap  px-5  items-center text-center  mb-1 uppercase">
            <span className="text-white whitespace-nowrap  ">{title}</span>
            <span className="text-gray-400">
              {" "}
              ({release_date?.slice(0, 7)})
            </span>
          </Typography>

          <a href="#" className="inline-block">
            <Button
              onClick={() => navigate(-1)}
              variant="text"
              className="flex items-center gap-2 lg:text-[1em]  text-gray-500 hover:text-white ">
              back to main
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </Button>
          </a>
        </div>
      </CardBody>
    </Card>
  );
}
