import { Dialog } from "@material-tailwind/react";

const Videofram = ({ open, handleOpen, videoSrc }) => {
  return (
    <Dialog
      size="xl"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none">
      <div className="relative w-full h-[50vh]">
        <iframe
          className=" border-0 absolute top-0 left-0 w-full h-full"
          src={videoSrc}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Movie Trailer"></iframe>
      </div>
    </Dialog>
  );
};

export default Videofram;
