import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Rating } from "react-simple-star-rating";

const HomeSeriesCard = () => {
  const tvShows = useSelector((state) => state.series.tvShows);
  const loading = useSelector((state) => state.series.status) === "loading";

  if (loading) {
    return <p>Loading...</p>;
  }

  const filteredSeries = tvShows.filter((show) => show.vote_average > 7.5);

  if (!filteredSeries.length) {
    return <p>No TV shows with rating above 7 found.</p>;
  }

  return (
    <div className="p-4 max-w-full">
      <h1 className="text-light-blue-800 text-4xl mb-8 text-left">
        Top Series
      </h1>

      <div className="flex flex-wrap justify-center gap-8">
        {filteredSeries.map((show) => (
          <Card
            key={show.id}
            className="w-96 max-w-[20rem] shadow-lg bg-gray-900 flex flex-col justify-between"
          >
            <CardHeader
              floated={false}
              color="blue-gray"
              className="relative h-56"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                className="h-full w-full object-cover"
              />
              <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />
            </CardHeader>
            <CardBody className="flex-grow">
              <div className="mb-3 flex items-center justify-between w-full">
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="font-medium text-white truncate max-w-[150px] text-lg"
                >
                  {show.name}
                </Typography>

                <div className="w-[120px] flex justify-end">
                  <Rating
                    readonly
                    initialValue={show.vote_average / 2}
                    size={20}
                    SVGstyle={{ display: "inline" }}
                    fillColor="#ffd700"
                    emptyColor="#d1d5db"
                  />
                </div>
              </div>
              <Typography variant="paragraph" className="text-white text-sm">
                Rate: {show.vote_average?.toFixed(1)}
              </Typography>
            </CardBody>
            <CardFooter className="pt-3 flex justify-center mt-auto">
              <Button
                size="sm"
                color="blue"
                variant="outlined"
                className="hover:bg-blue-600 hover:text-black"
              >
                Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomeSeriesCard;
