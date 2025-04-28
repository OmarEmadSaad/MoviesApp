// import { Spinner } from "@material-tailwind/react";

// const Loading = () => {
//   return (
//     <div>
//       <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
//         <Spinner className="h-16 w-16 text-blue-500" />
//         <h2 className="mt-6 text-white text-xl font-semibold animate-pulse">
//           Loading, please wait...
//         </h2>
//       </div>
//     </div>
//   );
// };

// export default Loading;

// import { Card, CardHeader, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";

// const LoadingCard = () => {
//   return (
//     <Card className="w-72 md:w-80 lg:w-80 shadow-lg bg-gray-900 animate-pulse">
//       <CardHeader floated={false} color="blue-gray" className="h-96 bg-gray-800">
//         <div className="w-full h-full bg-gray-700 rounded-md"></div>
//       </CardHeader>

//       <CardBody className="p-2 space-y-3">
//         <div className="h-4 bg-gray-700 rounded w-2/3"></div>

//         <div className="flex items-center justify-between py-2">
//           <div className="h-3 bg-gray-700 rounded w-1/4"></div>
//           <div className="h-3 bg-gray-700 rounded w-1/4"></div>
//         </div>

//         <div className="space-y-2">
//           <div className="h-2 bg-gray-700 rounded w-full"></div>
//           <div className="h-2 bg-gray-700 rounded w-5/6"></div>
//           <div className="h-2 bg-gray-700 rounded w-2/3"></div>
//         </div>
//       </CardBody>

//       <CardFooter className="pt-3 flex justify-center">
//         <Button
//           className="bg-gray-700 text-gray-700 cursor-default"
//           size="sm"
//           variant="outlined"
//           disabled
//         >
//           Loading...
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default LoadingCard;

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute w-10 h-10 bg-white rounded-full animate-pulse"></div>

        <div className="absolute w-20 h-20 flex items-center justify-center animate-ping">
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
