import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const TopCastSlickCard = ({ topactor }) => {
  
  return (
    <div className="px-2 mx-auto sm:mx-0 mt-2">
      <Link to={`/person/${topactor.id}`}>
        <Card
          shadow={false}
          className="w-48 h-72 flex flex-col items-center justify-end text-center hover:scale-110 transition-all duration-300 overflow-hidden">
          <div
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w500${topactor.profile_path})`,
            }}
            className="absolute inset-0 h-full w-full bg-cover bg-center rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </div>
          <CardBody className="relative z-10 px-4 py-4">
            <Typography
              variant="h5"
              className="mb-1 text-white text-sm truncate w-full drop-shadow-md">
              {topactor.name}
            </Typography>
            <Typography
              variant="h6"
              className="text-white text-xs truncate w-full drop-shadow-md">
              {topactor.character}
            </Typography>
          </CardBody>
        </Card>
      </Link>
    </div>
  );
};

export default TopCastSlickCard;
