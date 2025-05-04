import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { SlUser } from "react-icons/sl";
import { ImUser } from "react-icons/im";

export function CrewCard({ job, name, profile_path }) {
  
  return (
    <Card className="mb-7 py-5 w-70 md:w-96 lg:w-[90%] shadow-lg flex md:flex-row  items-center justify-between md:justify-evenly bg-gray-700">
      <CardHeader
        floated={false}
        color="transparent"
        className="shadow-none  ml-0 pl-0 ">
        <Link>
          {profile_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${profile_path}`}
              alt={"no image"}
              className="w-56 h-56 object-contain"
              loading="lazy"
            />
          ) : (
            <div className="w-56 h-56 flex justify-center md:pr-7">
              {" "}
              <ImUser className=" text-[10em]  text-white" />
            </div>
          )}
        </Link>
      </CardHeader>
      <CardBody className="p-2 flex flex-col items-center md:mr-6">
        <Link>
          <Typography
            className=" text-center  font-medium text-white text-[1.8em]"
            variant="h4">
            {name || "not found"}

            <span className="text-gray-400 text-base whitespace-nowrap "></span>
          </Typography>
        </Link>
        <div className="flex items-center justify-between">
          <Typography variant="h3" className="text-gray-400 font-medium text-[1.4em] text-center ">
            {job || "not found"}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
}
