import { FaRegStar, FaStar } from "react-icons/fa";

export default function RatingWithStars({ rate }) {
  const precentage = (rate / 10) * 100;

  return (
    <div className="relative w-max">
      <div className="flex">
        <FaRegStar className="text-[1.8em]" color="blue" />
        <FaRegStar className="text-[1.8em]" color="blue" />
        <FaRegStar className="text-[1.8em]" color="blue" />
        <FaRegStar className="text-[1.8em]" color="blue" />
        <FaRegStar className="text-[1.8em]" color="blue" />
      </div>
      <div
        style={{ width: `${precentage}%` }}
        className="flex  absolute top-0 left-0 overflow-hidden">
        <div>
          {" "}
          <FaStar className=" w-[1em] text-[1.8em]" color="yellow" />
        </div>
        <div>
          {" "}
          <FaStar className=" w-[1em] text-[1.8em]" color="yellow" />
        </div>
        <div>
          {" "}
          <FaStar className=" w-[1em] text-[1.8em]" color="yellow" />
        </div>
        <div>
          {" "}
          <FaStar className=" w-[1em] text-[1.8em]" color="yellow" />
        </div>
        <div>
          {" "}
          <FaStar className=" w-[1em] text-[1.8em]" color="yellow" />
        </div>
      </div>
    </div>
  );
}
