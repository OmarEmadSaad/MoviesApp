const Footer = () => {
  return (
    <div className="flex flex-col items-center text-white p-4">
      <div className="text-center text-xs sm:text-sm">
        <span className="flex items-center gap-2">
          ©2025
          <p className="text-2xl text-blue-900 inline-block">React Movies</p>,
          All Rights Reserved
        </span>
      </div>

      <div className="flex justify-center gap-4 mt-2 sm:mt-4 text-red-500 text-xs sm:text-sm flex-wrap">
        <p>About Us</p>
        <p>Terms of Use</p>
        <p>Privacy</p>
      </div>
    </div>
  );
};

export default Footer;
