import Slider from "react-slick";
import TopCastSlickCard from "./TopCastSlickCard";
import { useSelector } from "react-redux";
import { IconButton } from "@material-tailwind/react";
import { Fragment } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    className="!absolute top-1/2 -translate-y-1/2 left-2 z-10 bg-gray-800 hover:bg-gray-700 text-white"
    size="sm">
    <MdChevronLeft className="w-5 h-5" />
  </IconButton>
);

const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    className="!absolute top-1/2 -translate-y-1/2 right-2 z-10 bg-gray-800 hover:bg-gray-700 text-white"
    size="sm">
    <MdChevronRight className="w-5 h-5" />
  </IconButton>
);

const Topbilledslick = () => {
  const { topbilledcast } = useSelector((state) => state.onemoviedetails);

  const modifiedCast = [
    ...topbilledcast,
   
  ].slice(0,8);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="slider-container h-[50vh] w-full flex justify-center sm:justify-start px-4">
      <div className="w-[70%]">
        <Slider {...settings}>
          {modifiedCast.map((topactordetails) => (
            <Fragment key={topactordetails.id}>
              <TopCastSlickCard topactor={topactordetails} />
            </Fragment>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Topbilledslick;
