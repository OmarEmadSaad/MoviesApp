import React from "react";
import { Spinner } from "@material-tailwind/react";

const Loading = () => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
        <Spinner className="h-16 w-16 text-blue-500" />
        <h2 className="mt-6 text-white text-xl font-semibold animate-pulse">
          Loading, please wait a second...
        </h2>
      </div>
    </div>
  );
};

export default Loading;
