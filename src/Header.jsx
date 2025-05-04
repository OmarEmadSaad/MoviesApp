import { useEffect, useRef, useState } from "react";
import { TbLayoutNavbarExpandFilled } from "react-icons/tb";
import { MdOutlineCoronavirus } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  Button,
  Input,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { getMoviebySearch } from "./components/Redux/DetailsMoviesSlice/movieDetailsSlice";

const NavList = () => (
  <ul className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6">
    {[
      { label: "Home", to: "/" },
      { label: "Movies", to: "/movies" },
      { label: "Series", to: "/series" },
      { label: "Contact Us", to: "/contact-us" },
    ].map(({ label, to }) => (
      <Typography
        as={Link}
        to={to}
        key={label}
        variant="small"
        className="p-1 font-medium text-white hover:text-light-blue-900 transition">
        {label}
      </Typography>
    ))}
  </ul>
);

const Header = () => {
  const [openNav, setOpenNav] = useState(false);
  const [searchType, setSearchType] = useState("Movies");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);

  const searchRef = useRef(null);

  // const mockData = [
  //   "Avengers",
  //   "Batman",
  //   "Superman",
  //   "Iron Man",
  //   "Spider Man",
  //   "Guardians of the Galaxy",
  //   "Black Panther",
  // ];

  const handleWindowResize = () => {
    if (window.innerWidth >= 960) {
      setOpenNav(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSearchType = () => {
    setSearchType((prev) => (prev === "Movies" ? "Series" : "Movies"));
  };

  const handleSearch = () => {
    console.log(`Searching ${searchType} for:`, searchQuery);
    setSuggestionsVisible(false);
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const filteredSuggestions = mockData.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setSuggestionsVisible(true);
    } else {
      setSuggestions([]);
      setSuggestionsVisible(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestionsVisible(false);
  };

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setSuggestionsVisible(false);
    }
  };
  // ****************************************** تعديل محمد
  const dispatch = useDispatch();
  const { MoviebySearch } = useSelector((state) => {
    return state.onemoviedetails;
  });
  const mockData = MoviebySearch;
  useEffect(() => {
    dispatch(getMoviebySearch(searchQuery));
  }, [searchQuery]);

  return (
    <div>
      <Navbar
        fullWidth
        className="w-full bg-blue-gray-900 text-white py-3 shadow-md rounded-none">
        <div className="flex items-center justify-between w-full px-6">
          <div className="flex items-center gap-8">
            <Typography
              as={Link}
              to="/"
              variant="h6"
              className="cursor-pointer text-white">
              Movies App
            </Typography>
            <div className="hidden lg:flex">
              <NavList />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2" ref={searchRef}>
            <div className="relative min-w-[200px]">
              <Input
                placeholder={`Search ${searchType}`}
                value={searchQuery}
                onChange={handleInputChange}
                className="text-black bg-white placeholder-black"
                containerProps={{ className: "min-w-[200px]" }}
              />
              {isSuggestionsVisible && suggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full max-w-[300px] z-10">
                  <div className="max-h-40 overflow-auto border-2 border-gray-300 rounded-md w-full bg-blue-gray-900 text-white">
                    <ul>
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="p-2 cursor-pointer hover:bg-gray-100 hover:text-black"
                          onClick={() => handleSuggestionClick(suggestion)}>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleSearch}
              color="red"
              variant="outlined"
              size="sm"
              className="border-2 hover:text-white hover:bg-red-900 transition whitespace-nowrap px-2 py-2 min-w-[80px]">
              Search
            </Button>
            <Button
              onClick={toggleSearchType}
              size="sm"
              color="green"
              variant="outlined"
              className="border-2 border-green-500 text-green-500 hover:bg-green-900 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[120px]">
              {searchType === "Movies" ? "Search Series" : "Search Movies"}
            </Button>
            <Button
              size="sm"
              color="blue"
              variant="outlined"
              className="border-2 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[80px]">
              Login
            </Button>
          </div>

          <IconButton
            variant="text"
            className="lg:hidden text-white"
            onClick={() => setOpenNav(!openNav)}>
            <IoMenu className="h-6 w-6 text-white" />
          </IconButton>
        </div>
      </Navbar>

      <Collapse open={openNav} className="lg:hidden">
        <div className="pt-4">
          <NavList />
          <div
            className="flex flex-col gap-2 mt-4 justify-center items-center w-full"
            ref={searchRef}>
            <div className="relative w-full max-w-[300px]">
              <Input
                placeholder={`Search ${searchType}`}
                value={searchQuery}
                onChange={handleInputChange}
                className="text-black bg-white placeholder-black"
              />
              {isSuggestionsVisible && suggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full max-w-[300px] z-10">
                  <div className="max-h-40 overflow-auto border-2 border-gray-300 rounded-md w-full bg-blue-gray-900 text-white">
                    <ul>
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="p-2 cursor-pointer hover:bg-gray-100 hover:text-black"
                          onClick={() => handleSuggestionClick(suggestion)}>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={toggleSearchType}
              size="sm"
              color="green"
              variant="outlined"
              className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[120px] lg:min-w-[160px] mx-auto">
              {searchType === "Movies" ? "Search Series" : "Search Movies"}
            </Button>
            <Button
              onClick={handleSearch}
              size="sm"
              color="red"
              variant="outlined"
              className="border-2 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[80px] lg:min-w-[120px] mx-auto">
              Search
            </Button>
            <Button
              size="sm"
              color="blue"
              variant="outlined"
              className="border-2 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[80px] lg:min-w-[120px] mx-auto">
              Login
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Header;

// // import { useEffect, useRef, useState } from "react";
// // import { TbLayoutNavbarExpandFilled } from "react-icons/tb";
// // import { MdOutlineCoronavirus } from "react-icons/md";
// // import { IoMenu } from "react-icons/io5";
// // import { Link } from "react-router-dom";
// // import {
// //   Navbar,
// //   Collapse,
// //   Typography,
// //   IconButton,
// //   Button,
// //   Input,
// // } from "@material-tailwind/react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { getMoviebySearch } from "./components/Redux/DetailsMoviesSlice/movieDetailsSlice";

// // const NavList = () => (
// //   <ul className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6">
// //     {[
// //       { label: "Home", to: "/" },
// //       { label: "Movies", to: "/movies" },
// //       { label: "Series", to: "/series" },
// //       { label: "Contact Us", to: "/contact-us" },
// //     ].map(({ label, to }) => (
// //       <Typography
// //         as={Link}
// //         to={to}
// //         key={label}
// //         variant="small"
// //         className="p-1 font-medium text-white hover:text-light-blue-900 transition">
// //         {label}
// //       </Typography>
// //     ))}
// //   </ul>
// // );

// // const Header = () => {
// //   const [openNav, setOpenNav] = useState(false);
// //   const [searchType, setSearchType] = useState("Movies");
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [suggestions, setSuggestions] = useState([]);
// //   const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);
// //   const dispatch = useDispatch();
// //   const { MoviebySearch } = useSelector((state) => {
// //     return state.onemoviedetails;
// //   });
// //   console.log(MoviebySearch);
// //   const searchRef = useRef(null);

// //   const mockData = MoviebySearch

// //   // const mockData = [
// //   //   "Avengers",
// //   //   "Batman",
// //   //   "Superman",
// //   //   "Iron Man",
// //   //   "Spider Man",
// //   //   "Guardians of the Galaxy",
// //   //   "Black Panther",
// //   // ];

// //   const handleWindowResize = () => {
// //     if (window.innerWidth >= 960) {
// //       setOpenNav(false);
// //     }
// //   };

// //   useEffect(() => {
// //     window.addEventListener("resize", handleWindowResize);
// //     document.addEventListener("mousedown", handleClickOutside);

// //     return () => {
// //       window.removeEventListener("resize", handleWindowResize);
// //       document.removeEventListener("mousedown", handleClickOutside);
// //     };
// //   }, []);

// //   // ******************mohamed
// //   useEffect(() => {
// //     dispatch(getMoviebySearch(searchQuery));
// //   }, [searchQuery]);

// //   // *******************
// //   const toggleSearchType = () => {
// //     setSearchType((prev) => (prev === "Movies" ? "Series" : "Movies"));
// //   };

// //   const handleSearch = () => {
// //     console.log(`Searching ${searchType} for:`, searchQuery);
// //     setSuggestionsVisible(false);
// //   };

// //   const handleInputChange = (e) => {
// //     const query = e.target.value;
// //     setSearchQuery(query);

// //     if (query) {
// //       const filteredSuggestions = mockData.filter((item) =>
// //         item.toLowerCase().includes(query.toLowerCase())
// //       );
// //       setSuggestions(filteredSuggestions);
// //       setSuggestionsVisible(true);
// //     } else {
// //       setSuggestions([]);
// //       setSuggestionsVisible(false);
// //     }
// //   };

// //   const handleSuggestionClick = (suggestion) => {
// //     setSearchQuery(suggestion);
// //     setSuggestionsVisible(false);
// //   };

// //   const handleClickOutside = (e) => {
// //     if (searchRef.current && !searchRef.current.contains(e.target)) {
// //       setSuggestionsVisible(false);
// //     }
// //   };

// //   return (
// //     <div>
// //       <Navbar
// //         fullWidth
// //         className="w-full bg-blue-gray-900 text-white py-3 shadow-md rounded-none">
// //         <div className="flex items-center justify-between w-full px-6">
// //           <div className="flex items-center gap-8">
// //             <Typography
// //               as={Link}
// //               to="/"
// //               variant="h6"
// //               className="cursor-pointer text-white">
// //               Movies App
// //             </Typography>
// //             <div className="hidden lg:flex">
// //               <NavList />
// //             </div>
// //           </div>

// //           <div className="hidden lg:flex items-center gap-2" ref={searchRef}>
// //             <div className="relative min-w-[200px]">
// //               <Input
// //                 placeholder={`Search ${searchType}`}
// //                 value={searchQuery}
// //                 onChange={handleInputChange}
// //                 className="text-black bg-white placeholder-black"
// //                 containerProps={{ className: "min-w-[200px]" }}
// //               />

// //               {isSuggestionsVisible && suggestions.length > 0 && (
// //                 <div className="absolute top-full left-0 mt-2 w-full max-w-[300px] z-10">
// //                   <div className="max-h-40 overflow-auto border-2 border-gray-300 rounded-md w-full bg-blue-gray-900 text-white">
// //                     <ul>
// //                       {suggestions.map((suggestion, index) => (
// //                         <li
// //                           key={index}
// //                           className="p-2 cursor-pointer hover:bg-gray-100 hover:text-black"
// //                           onClick={() => handleSuggestionClick(suggestion)}>
// //                           {suggestion}
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             <Button
// //               onClick={handleSearch}
// //               color="red"
// //               variant="outlined"
// //               size="sm"
// //               className="border-2 hover:text-white hover:bg-red-900 transition whitespace-nowrap px-2 py-2 min-w-[80px]">
// //               Search
// //             </Button>
// //             <Button
// //               onClick={toggleSearchType}
// //               size="sm"
// //               color="green"
// //               variant="outlined"
// //               className="border-2 border-green-500 text-green-500 hover:bg-green-900 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[120px]">
// //               {searchType === "Movies" ? "Search Series" : "Search Movies"}
// //             </Button>
// //             <Button
// //               size="sm"
// //               color="blue"
// //               variant="outlined"
// //               className="border-2 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[80px]">
// //               Login
// //             </Button>
// //           </div>

// //           <IconButton
// //             variant="text"
// //             className="lg:hidden text-white"
// //             onClick={() => setOpenNav(!openNav)}>
// //             <IoMenu className="h-6 w-6 text-white" />
// //           </IconButton>
// //         </div>
// //       </Navbar>

// //       <Collapse open={openNav} className="lg:hidden">
// //         <div className="pt-4">
// //           <NavList />
// //           <div
// //             className="flex flex-col gap-2 mt-4 justify-center items-center w-full"
// //             ref={searchRef}>
// //             <div className="relative w-full max-w-[300px]">
// //               <Input
// //                 placeholder={`Search ${searchType}`}
// //                 value={searchQuery}
// //                 onChange={handleInputChange}
// //                 className="text-black bg-white placeholder-black"
// //               />
// //               {isSuggestionsVisible && suggestions.length > 0 && (
// //                 <div className="absolute top-full left-0 mt-2 w-full max-w-[300px] z-10">
// //                   <div className="max-h-40 overflow-auto border-2 border-gray-300 rounded-md w-full bg-blue-gray-900 text-white">
// //                     <ul>
// //                       {suggestions.map((suggestion, index) => (
// //                         <li
// //                           key={index}
// //                           className="p-2 cursor-pointer hover:bg-gray-100 hover:text-black"
// //                           onClick={() => handleSuggestionClick(suggestion)}>
// //                           {suggestion}
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             <Button
// //               onClick={toggleSearchType}
// //               size="sm"
// //               color="green"
// //               variant="outlined"
// //               className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[120px] lg:min-w-[160px] mx-auto">
// //               {searchType === "Movies" ? "Search Series" : "Search Movies"}
// //             </Button>
// //             <Button
// //               onClick={handleSearch}
// //               size="sm"
// //               color="red"
// //               variant="outlined"
// //               className="border-2 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[80px] lg:min-w-[120px] mx-auto">
// //               Search
// //             </Button>
// //             <Button
// //               size="sm"
// //               color="blue"
// //               variant="outlined"
// //               className="border-2 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[80px] lg:min-w-[120px] mx-auto">
// //               Login
// //             </Button>
// //           </div>
// //         </div>
// //       </Collapse>
// //     </div>
// //   );
// // };

// // export default Header;
// import { useEffect, useRef, useState } from "react";
// import { IoMenu } from "react-icons/io5";
// import { Link } from "react-router-dom";
// import {
//   Navbar,
//   Collapse,
//   Typography,
//   IconButton,
//   Button,
//   Input,
// } from "@material-tailwind/react";
// import { useDispatch, useSelector } from "react-redux";
// import { getMoviebySearch } from "./components/Redux/DetailsMoviesSlice/movieDetailsSlice";

// const NavList = () => (
//   <ul className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6">
//     {[
//       { label: "Home", to: "/" },
//       { label: "Movies", to: "/movies" },
//       { label: "Series", to: "/series" },
//       { label: "Contact Us", to: "/contact-us" },
//     ].map(({ label, to }) => (
//       <Typography
//         as={Link}
//         to={to}
//         key={label}
//         variant="small"
//         className="p-1 font-medium text-white hover:text-light-blue-900 transition">
//         {label}
//       </Typography>
//     ))}
//   </ul>
// );

// const Header = () => {
//   const [openNav, setOpenNav] = useState(false);
//   const [searchType, setSearchType] = useState("Movies");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);
//   const dispatch = useDispatch();
//   const { MoviebySearch } = useSelector((state) => state.onemoviedetails);

//   const searchRef = useRef(null);

//   const handleWindowResize = () => {
//     if (window.innerWidth >= 960) {
//       setOpenNav(false);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("resize", handleWindowResize);
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       window.removeEventListener("resize", handleWindowResize);
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     if (searchQuery.trim()) {
//       dispatch(getMoviebySearch(searchQuery));
//     }
//   }, [searchQuery]);

//   const toggleSearchType = () => {
//     setSearchType((prev) => (prev === "Movies" ? "Series" : "Movies"));
//   };

//   const handleSearch = () => {
//     console.log(`Searching ${searchType} for:`, searchQuery);
//     setSuggestionsVisible(false);
//   };

//   const handleInputChange = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);

//     if (query.trim()) {
//       setSuggestionsVisible(true);
//     } else {
//       setSuggestionsVisible(false);
//     }
//   };

//   const handleSuggestionClick = (title) => {
//     setSearchQuery(title);
//     setSuggestionsVisible(false);
//   };

//   const handleClickOutside = (e) => {
//     if (searchRef.current && !searchRef.current.contains(e.target)) {
//       setSuggestionsVisible(false);
//     }
//   };
//   // const renderSuggestions = () =>
//   //   isSuggestionsVisible &&
//   //   MoviebySearch?.length > 0 && (
//   //     <div className="absolute top-full left-0 mt-2 w-full z-5 bg-white shadow-lg rounded-lg border border-gray-300 max-h-72 overflow-y-auto">
//   //       <ul className="bg-blue-gray-900 text-white">
//   //         {MoviebySearch.map((movie) => (
//   //           <li
//   //             key={movie.id}
//   //             className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 hover:text-black transition-colors"
//   //             onClick={() => handleSuggestionClick(movie.title)}>
//   //             {movie.poster_path ? (
//   //               <img
//   //                 src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
//   //                 alt={movie.title}
//   //                 className="w-8 h-10 object-cover rounded"
//   //               />
//   //             ) : (
//   //               <div className="w-8 h-10 bg-gray-500 rounded flex items-center justify-center text-xs">
//   //                 not found
//   //               </div>
//   //             )}
//   //             <span className="text-sm">{movie.title}</span>
//   //           </li>
//   //         ))}
//   //       </ul>
//   //     </div>
//   //   );

//   // const renderSuggestions = () =>
//   //   isSuggestionsVisible &&
//   //   MoviebySearch?.length > 0 && (
//   //     <div className="absolute top-full left-0 mt-2 w-full max-w-[300px] z-50 bg-white shadow-lg rounded-lg border border-gray-300">
//   //       <div className="h-auto overflow-y-scroll border-2 border-gray-300 rounded-md bg-blue-gray-900 text-white">
//   //         <ul>
//   //           {MoviebySearch?.map((movie) => (
//   //             <li
//   //               key={movie.id}
//   //               className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 hover:text-black"
//   //               onClick={() => handleSuggestionClick(movie.title)}>
//   //               {movie.poster_path ? (
//   //                 <img
//   //                   src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
//   //                   alt={movie.title}
//   //                   className="w-8 h-10 object-cover rounded"
//   //                 />
//   //               ) : (
//   //                 <div className="w-8 h-10 bg-gray-500 rounded flex items-center justify-center text-xs">
//   //                  not found
//   //                 </div>
//   //               )}
//   //               <span>{movie.title}</span>
//   //             </li>
//   //           ))}
//   //         </ul>
//   //       </div>
//   //     </div>
//   //   );

//   const renderSuggestions = () =>
//     isSuggestionsVisible &&
//     MoviebySearch?.length > 0 && (
//       <div className="absolute top-full left-0 mt-1 w-full z-100000000 bg-blue-gray-900 text-white border border-cyan-500 rounded-md max-h-64 overflow-y-auto shadow-md">
//         <ul>
//           {MoviebySearch.map((movie) => (
//             <li
//               key={movie.id}
//               className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-cyan-100 hover:text-black border-b border-cyan-500"
//               onClick={() => handleSuggestionClick(movie.title)}>
//               {movie.poster_path ? (
//                 <img
//                   src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
//                   alt={movie.title}
//                   className="w-10 h-14 object-cover rounded"
//                 />
//               ) : (
//                 <div className="w-10 h-14 bg-gray-500 rounded flex items-center justify-center text-xs">
//                   N/A
//                 </div>
//               )}
//               <span className="text-sm font-medium">{movie.title}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );

//   return (
//     <div>
//       <Navbar
//         fullWidth
//         className="w-full bg-blue-gray-900 text-white py-3 shadow-md rounded-none">
//         <div className="flex items-center justify-between w-full px-6">
//           <div className="flex items-center gap-8">
//             <Typography
//               as={Link}
//               to="/"
//               variant="h6"
//               className="cursor-pointer text-white">
//               Movies App
//             </Typography>
//             <div className="hidden lg:flex">
//               <NavList />
//             </div>
//           </div>

//           <div className="hidden lg:flex items-center gap-2" ref={searchRef}>
//             {/* <div className="relative min-w-[200px]">
//               <Input
//                 placeholder={`Search ${searchType}`}
//                 value={searchQuery}
//                 onChange={handleInputChange}
//                 className="text-black bg-white placeholder-black"
//                 containerProps={{ className: "min-w-[200px]" }}
//               />
//               {renderSuggestions()}
//             </div> */}
//             <div className="relative min-w-[200px]" ref={searchRef}>
//               <Input
//                 placeholder={`Search ${searchType}`}
//                 value={searchQuery}
//                 onChange={handleInputChange}
//                 className="text-black bg-white placeholder-black"
//                 containerProps={{ className: "min-w-[200px]" }}
//               />
//               {renderSuggestions()}
//             </div>

//             <Button
//               onClick={handleSearch}
//               color="red"
//               variant="outlined"
//               size="sm"
//               className="border-2 hover:text-white hover:bg-red-900 transition px-2 py-2 min-w-[80px]">
//               Search
//             </Button>
//             <Button
//               onClick={toggleSearchType}
//               size="sm"
//               color="green"
//               variant="outlined"
//               className="border-2 border-green-500 text-green-500 hover:bg-green-900 hover:text-white transition px-2 py-2 min-w-[120px]">
//               {searchType === "Movies" ? "Search Series" : "Search Movies"}
//             </Button>
//             <Button
//               size="sm"
//               color="blue"
//               variant="outlined"
//               className="border-2 hover:text-white transition px-2 py-2 min-w-[80px]">
//               Login
//             </Button>
//           </div>

//           <IconButton
//             variant="text"
//             className="lg:hidden text-white"
//             onClick={() => setOpenNav(!openNav)}>
//             <IoMenu className="h-6 w-6 text-white" />
//           </IconButton>
//         </div>
//       </Navbar>

//       <Collapse open={openNav} className="lg:hidden">
//         <div className="pt-4">
//           <NavList />
//           <div
//             className="flex flex-col gap-2 mt-4 justify-center items-center w-full"
//             ref={searchRef}>
//             <div className="relative w-full max-w-[300px]">
//               <Input
//                 placeholder={`Search ${searchType}`}
//                 value={searchQuery}
//                 onChange={handleInputChange}
//                 className="text-black bg-white placeholder-black"
//               />
//               {renderSuggestions()}
//             </div>

//             <Button
//               onClick={toggleSearchType}
//               size="sm"
//               color="green"
//               variant="outlined"
//               className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition px-2 py-2 min-w-[120px] lg:min-w-[160px] mx-auto">
//               {searchType === "Movies" ? "Search Series" : "Search Movies"}
//             </Button>
//             <Button
//               onClick={handleSearch}
//               size="sm"
//               color="red"
//               variant="outlined"
//               className="border-2 hover:text-white transition px-2 py-2 min-w-[80px] lg:min-w-[120px] mx-auto">
//               Search
//             </Button>
//             <Button
//               size="sm"
//               color="blue"
//               variant="outlined"
//               className="border-2 hover:text-white transition px-2 py-2 min-w-[80px] lg:min-w-[120px] mx-auto">
//               Login
//             </Button>
//           </div>
//         </div>
//       </Collapse>
//     </div>
//   );
// };

// export default Header;
