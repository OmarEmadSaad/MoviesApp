import { MdOutlineStarPurple500 } from "react-icons/md";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useState } from "react";
import { CiMoneyCheck1 } from "react-icons/ci";

export default function ReviewCard({ MovieReviews, all }) {
  const [showmore, setshowmore] = useState(true);
  return (
    <div className="flex items-center justify-center my-3    ">
      <Card className="w-[90%] lg:w-[70%]   flex-col items-center md:flex-row bg-gray-900">
        <div>
          {" "}
          <CiMoneyCheck1 className="text-[10em] text-white" />
        </div>

        <CardBody>
          <div className="text-center mb-4">
            <div className="text-[1.8em] font-semibold text-white flex flex-col items-center mb-3 md:flex-row  md:justify-between">
              <div className=" ">
                <span>A review by </span>
                <span className="text-blue-500 whitespace-nowrap">
                  {MovieReviews?.author_details.name
                    ? MovieReviews?.author_details.name
                    : MovieReviews?.author_details.username}
                </span>{" "}
              </div>
              {all && (
                <div className="w-[20%]  flex items-center justify-center border border-white">
                  <span>
                    <MdOutlineStarPurple500 />
                  </span>
                  <span>{MovieReviews?.author_details.rating}</span>
                </div>
              )}
            </div>{" "}
            <h3
              className="
            text-[1.2em] text-white">
              Written by{" "}
              <span className="text-blue-500">
                {MovieReviews?.author_details.username}{" "}
              </span>
              on{" "}
              <span
                className="
                text-blue-500 ">
                {MovieReviews?.created_at.slice(0, 7)}
              </span>
            </h3>
          </div>

          <Typography variant="h6" className="text-blue-500 mb-4 uppercase">
            Content :-
          </Typography>
          <div className="mb-8 font-normal text-white">
            {showmore
              ? MovieReviews?.content.slice(0, 300) + "......."
              : MovieReviews?.content}

            <Button
              onClick={() => setshowmore(!showmore)}
              variant="text"
              className="inline text-blue-500 underline ml-5   ">
              {showmore ? "show more" : "show less"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
