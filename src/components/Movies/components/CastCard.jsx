import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
export function CastCard({ collectionpage, character, name, profile_path }) {
  return (
    <div>
      {collectionpage ? (
        <Card className="mb-7 py-5 w-70 md:w-96  shadow-lg flex  items-center justify-center md:justify-evenly bg-gray-700">
          <CardHeader
            floated={false}
            color="transparent"
            className="shadow-none  ">
            <Link>
              <img
                src={
                  `https://image.tmdb.org/t/p/w500${profile_path}` ||
                  "not found"
                }
                alt={"no image"}
                className="w-56 h-56 object-contain"
                loading="lazy"
              />
            </Link>
          </CardHeader>
          <CardBody className="p-2 flex flex-col items-center md:mr-6  ">
            <Link>
              <Typography
                className=" text-center  font-medium text-white text-[1.8em]"
                variant="h4">
                {name || "not found"}
              </Typography>
            </Link>
            <div className="flex items-center justify-between text-center">
              <Typography
                variant="h3"
                className="text-gray-400  font-medium text-[1.4em]">
                {character || "not found"}
              </Typography>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="mb-7 py-5 w-70 md:w-96 lg:w-[90%] shadow-lg flex md:flex-row  items-center justify-center md:justify-evenly bg-gray-700">
          <CardHeader
            floated={false}
            color="transparent"
            className="shadow-none  ">
            <Link>
              <img
                src={
                  `https://image.tmdb.org/t/p/w500${profile_path}` ||
                  "not found"
                }
                alt={"no image"}
                className="w-56 h-56 object-contain"
                loading="lazy"
              />
            </Link>
          </CardHeader>
          <CardBody className="p-2 flex flex-col items-center md:mr-6  ">
            <Link>
              <Typography
                className=" text-center  font-medium text-white text-[1.8em]"
                variant="h4">
                {name || "not found"}
              </Typography>
            </Link>
            <div className="flex items-center justify-between text-center">
              <Typography
                variant="h3"
                className="text-gray-400  font-medium text-[1.4em]">
                {character || "not found"}
              </Typography>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}