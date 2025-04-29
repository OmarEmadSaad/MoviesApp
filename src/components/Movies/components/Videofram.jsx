import { Dialog } from "@material-tailwind/react";

const Videofram = ({ open, handleOpen, videoKey }) => {
  return (
    <Dialog
      size="xl"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <div className="relative w-full h-[50vh]">
        <iframe
          className=" border-0 absolute top-0 left-0 w-full h-full"
          src={videoKey}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Movie Trailer"
        ></iframe>
      </div>
    </Dialog>
  );
};

export default Videofram;

// import { Dialog } from "@material-tailwind/react";
// import { useState, useEffect } from "react";

// const Videofram = ({ open, handleOpen, videoSrc }) => {
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     // Reset error state when dialog opens or videoSrc changes
//     setError(false);
//   }, [open, videoSrc]);

//   const handleError = () => {
//     setError(true);
//   };

//   return (
//     <Dialog
//       size="xl"
//       open={open}
//       handler={handleOpen}
//       className="bg-transparent shadow-none"
//     >
//       <div className="relative w-full h-[50vh]">
//         {videoSrc && !error ? (
//           <iframe
//             className="border-0 absolute top-0 left-0 w-full h-full"
//             src={`${videoSrc}&autoplay=1&mute=0`} // Add autoplay and mute parameters
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             allowFullScreen
//             frameBorder="0"
//             title="Movie Trailer"
//             onError={handleError} // Detect errors in iframe loading
//           ></iframe>
//         ) : (
//           <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
//             <p className="text-white text-center">
//               {error
//                 ? "This video cannot be played (embedding may be disabled)."
//                 : "No trailer available to display."}
//             </p>
//           </div>
//         )}
//       </div>
//     </Dialog>
//   );
// };

// export default Videofram;
