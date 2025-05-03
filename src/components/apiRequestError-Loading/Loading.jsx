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
