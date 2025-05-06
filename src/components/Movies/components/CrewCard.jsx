import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { SlUser } from "react-icons/sl";
import { ImUser } from "react-icons/im";

export function CrewCard({ job, name, profile_path }) {
  return (
    <Card className="mb-7 py-5 w-70 md:w-96 lg:w-[90%] shadow-lg flex md:flex-row  items-center justify-between md:justify-evenly bg-gray-800">
      <CardHeader
        floated={false}
        color="transparent"
        className="shadow-none  ml-0 pl-0 "
      >
        <Link>
          {profile_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${profile_path}`}
              alt={"no image"}
              className="w-56 h-56 object-contain"
              loading="lazy"
            />
          ) : (
            <div className="w-56 h-56 flex justify-center md:pr-7">
              {" "}
              <ImUser className=" text-[10em]  text-white" />
            </div>
          )}
        </Link>
      </CardHeader>
      <CardBody className="p-2 flex flex-col items-center md:mr-6">
        <Link>
          <Typography
            className=" text-center  font-medium text-white text-[1.8em]"
            variant="h4"
          >
            {name || "not found"}

            <span className="text-gray-400 text-base whitespace-nowrap "></span>
          </Typography>
        </Link>
        <div className="flex items-center justify-between">
          <Typography
            variant="h3"
            className="text-gray-400 font-medium text-[1.4em] text-center "
          >
            {job || "not found"}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
}

// import { useEffect, useRef, useState } from "react";
// import { IoMenu } from "react-icons/io5";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import {
//   Navbar,
//   Collapse,
//   Typography,
//   IconButton,
//   Button,
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
//         className="p-1 font-medium text-white hover:text-light-blue-900 transition"
//       >
//         {label}
//       </Typography>
//     ))}
//   </ul>
// );

// const Header = () => {
//   const [openNav, setOpenNav] = useState(false);
//   const [searchType, setSearchType] = useState("Movies");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);
//   const searchRef = useRef(null);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { MoviebySearch } = useSelector((state) => state.onemoviedetails);
//   const mockData = MoviebySearch;

//   const handleWindowResize = () => {
//     if (window.innerWidth >= 960) setOpenNav(false);
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
//     if (searchQuery) {
//       dispatch(getMoviebySearch(searchQuery));
//       setSuggestionsVisible(true);
//     } else {
//       setSuggestions([]);
//       setSuggestionsVisible(false);
//     }
//   }, [searchQuery, dispatch]);

//   useEffect(() => {
//     if (mockData && searchQuery) {
//       const filtered = mockData.filter((item) =>
//         (item.title || item.name || item.original_name || "")
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase())
//       );
//       setSuggestions(filtered);
//       setSuggestionsVisible(true);
//     } else {
//       setSuggestions([]);
//       setSuggestionsVisible(false);
//     }
//   }, [mockData, searchQuery]);

//   const toggleSearchType = () => {
//     setSearchType((prev) => (prev === "Movies" ? "Series" : "Movies"));
//   };

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);
//   };

//   const handleSuggestionClick = (suggestion) => {
//     const title =
//       suggestion.title || suggestion.name || suggestion.original_name;
//     if (title) {
//       setSearchQuery(title);
//       setSuggestionsVisible(false);
//     } else {
//       setSearchQuery("");
//     }
//   };

//   const handleClickOutside = (e) => {
//     if (searchRef.current && !searchRef.current.contains(e.target)) {
//       setSuggestionsVisible(false);
//     }
//   };

//   const handleSearch = () => {
//     if (searchQuery.trim() === "") return;

//     const matchedItem = suggestions.find((item) => {
//       const itemName = item.title || item.name || item.original_name || "";
//       return itemName.toLowerCase() === searchQuery.toLowerCase();
//     });

//     if (matchedItem) {
//       const id = matchedItem.id;
//       const path = searchType === "Movies" ? `/movie/${id}` : `/series/${id}`;
//       navigate(path);
//     } else {
//       navigate(
//         `/search/${searchType.toLowerCase()}/${encodeURIComponent(searchQuery)}`
//       );
//     }

//     setSuggestionsVisible(false);
//   };

//   const renderSuggestions = () => {
//     return (
//       isSuggestionsVisible &&
//       suggestions.length > 0 && (
//         <div className="lg:fixed lg:top-[70px] lg:left-1/2 lg:transform lg:-translate-x-1/2 absolute top-full left-0 w-full max-w-[400px] lg:max-w-[400px] z-[10000]">
//           <div className="max-h-72 overflow-auto border border-gray-300 rounded-md bg-blue-gray-900 text-white shadow-2xl">
//             <ul>
//               {suggestions.map((suggestion, index) => (
//                 <li
//                   key={index}
//                   className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 hover:text-black"
//                   onMouseDown={() => handleSuggestionClick(suggestion)}
//                 >
//                   <img
//                     src={
//                       suggestion.poster_path
//                         ? `https://image.tmdb.org/t/p/w92/${suggestion.poster_path}`
//                         : "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
//                     }
//                     alt={
//                       suggestion.title ||
//                       suggestion.name ||
//                       suggestion.original_name ||
//                       "No title"
//                     }
//                     className="w-10 h-14 object-cover rounded"
//                   />
//                   <span>
//                     {suggestion.title ||
//                       suggestion.name ||
//                       suggestion.original_name ||
//                       "No title"}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )
//     );
//   };

//   return (
//     <div>
//       <Navbar
//         fullWidth
//         className="w-full bg-blue-gray-900 text-white py-3 shadow-md rounded-none"
//       >
//         <div className="flex items-center justify-between w-full px-6">
//           <div className="flex items-center gap-8">
//             <Typography
//               as={Link}
//               to="/"
//               variant="h6"
//               className="cursor-pointer text-white"
//             >
//               Movies App
//             </Typography>
//             <div className="hidden lg:flex">
//               <NavList />
//             </div>
//           </div>

//           <div className="hidden lg:flex items-center gap-2" ref={searchRef}>
//             <div className="relative min-w-[200px]">
//               <input
//                 placeholder={`Search ${searchType}`}
//                 value={searchQuery}
//                 onChange={handleInputChange}
//                 className="text-black bg-white placeholder-black w-full min-w-[200px] p-2 rounded-md"
//               />
//               {renderSuggestions()}
//             </div>

//             <Button
//               onClick={handleSearch}
//               color="red"
//               variant="outlined"
//               size="sm"
//               className="border-2 hover:text-white hover:bg-red-900 transition whitespace-nowrap px-2 py-2 min-w-[80px]"
//             >
//               Search
//             </Button>
//             <Button
//               onClick={toggleSearchType}
//               size="sm"
//               color="green"
//               variant="outlined"
//               className="border-2 border-green-500 text-green-500 hover:bg-green-900 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[120px]"
//             >
//               {searchType === "Movies" ? "Search Series" : "Search Movies"}
//             </Button>
//             <Button
//               size="sm"
//               color="blue"
//               variant="outlined"
//               className="border-2 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[80px]"
//             >
//               Login
//             </Button>
//           </div>

//           <IconButton
//             variant="text"
//             className="lg:hidden text-white"
//             onClick={() => setOpenNav(!openNav)}
//           >
//             <IoMenu className="h-6 w-6 text-white" />
//           </IconButton>
//         </div>
//       </Navbar>

//       <Collapse open={openNav} className="lg:hidden">
//         <div className="pt-4">
//           <NavList />
//           <div
//             className="flex flex-col gap-2 mt-4 justify-center items-center w-full"
//             ref={searchRef}
//           >
//             <div className="relative w-full max-w-[300px]">
//               <input
//                 placeholder={`Search ${searchType}`}
//                 value={searchQuery}
//                 onChange={handleInputChange}
//                 className="text-black bg-white placeholder-black w-full p-2 rounded-md"
//               />
//               {renderSuggestions()}
//             </div>

//             <Button
//               onClick={toggleSearchType}
//               size="sm"
//               color="green"
//               variant="outlined"
//               className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[120px] mx-auto"
//             >
//               {searchType === "Movies" ? "Search Series" : "Search Movies"}
//             </Button>
//             <Button
//               onClick={handleSearch}
//               size="sm"
//               color="red"
//               variant="outlined"
//               className="border-2 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[80px] mx-auto"
//             >
//               Search
//             </Button>
//             <Button
//               size="sm"
//               color="blue"
//               variant="outlined"
//               className="border-2 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[80px] mx-auto"
//             >
//               Login
//             </Button>
//           </div>
//         </div>
//       </Collapse>
//     </div>
//   );
// };

// export default Header;

// import { useEffect, useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import { IoMenu } from "react-icons/io5";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import {
//   Navbar,
//   Collapse,
//   Typography,
//   IconButton,
//   Button,
// } from "@material-tailwind/react";
// import { useDispatch, useSelector } from "react-redux";
// import { searchMovieByName } from "./components/Redux/DetailsMoviesSlice/movieDetailsSlice";
// import { searchSeriesByName } from "./components/Redux/DetailsSeriesSlice/DetailsSeriesSlice";

// // import {
// //   searchMovieByName,
// //   searchSeriesByName,
// // } from "./components/Redux/DetailsMoviesSlice/movieDetailsSlice";

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
//         className="p-1 font-medium text-white hover:text-light-blue-900 transition"
//       >
//         {label}
//       </Typography>
//     ))}
//   </ul>
// );

// const Header = () => {
//   const [openNav, setOpenNav] = useState(false);
//   const [searchType, setSearchType] = useState("Movies");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);
//   const [selectedItemId, setSelectedItemId] = useState(null);
//   const searchRef = useRef(null);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { MoviebySearch } = useSelector((state) => state.onemoviedetails);
//   const mockData = MoviebySearch;

//   const handleWindowResize = () => {
//     if (window.innerWidth >= 960) setOpenNav(false);
//   };

//   useEffect(() => {
//     window.addEventListener("resize", handleWindowResize);
//     return () => window.removeEventListener("resize", handleWindowResize);
//   }, []);

//   useEffect(() => {
//     if (searchQuery.trim()) {
//       if (searchType === "Movies") {
//         dispatch(searchMovieByName(searchQuery));
//       } else {
//         dispatch(searchSeriesByName(searchQuery));
//       }
//       setSuggestionsVisible(true);
//     } else {
//       setSuggestions([]);
//       setSuggestionsVisible(false);
//       setSelectedItemId(null);
//     }
//   }, [searchQuery, searchType, dispatch]);

//   useEffect(() => {
//     if (mockData && searchQuery.trim() && isSuggestionsVisible) {
//       const filtered = mockData.filter((item) =>
//         (item.title || item.name || item.original_name || "")
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase())
//       );
//       setSuggestions(filtered);
//     } else {
//       setSuggestions([]);
//     }
//   }, [mockData, searchQuery, isSuggestionsVisible]);

//   const toggleSearchType = () => {
//     setSearchType((prev) => (prev === "Movies" ? "Series" : "Movies"));
//     setSelectedItemId(null);
//   };

//   const handleInputChange = (e) => {
//     setSearchQuery(e.target.value);
//     setSelectedItemId(null);
//   };

//   const handleSuggestionClick = (suggestion) => {
//     const title =
//       suggestion.title || suggestion.name || suggestion.original_name;
//     if (title && suggestion.id) {
//       setSearchQuery(title);
//       setSelectedItemId(suggestion.id);
//       setSuggestions([]);
//       setSuggestionsVisible(false);
//     } else {
//       setSearchQuery("");
//       setSelectedItemId(null);
//       setSuggestions([]);
//       setSuggestionsVisible(false);
//     }
//   };

//   const handleSearch = () => {
//     if (!searchQuery.trim()) return;

//     if (selectedItemId) {
//       navigate(
//         searchType === "Movies"
//           ? `/movie/${selectedItemId}`
//           : `/series/${selectedItemId}`
//       );
//     } else {
//       const matchedItem = suggestions.find((item) => {
//         const itemName = item.title || item.name || item.original_name || "";
//         return itemName.toLowerCase().includes(searchQuery.toLowerCase());
//       });

//       if (matchedItem && matchedItem.id) {
//         navigate(
//           searchType === "Series"
//             ? `/series/${matchedItem.id}`
//             : `/movie/${matchedItem.id}`
//         );
//       } else {
//         navigate(
//           `/search/${searchType.toLowerCase()}/${encodeURIComponent(
//             searchQuery
//           )}`
//         );
//       }
//     }

//     setSuggestionsVisible(false);
//     setSuggestions([]);
//   };

//   const renderSuggestions = () => {
//     const isSmallScreen = window.innerWidth < 960;
//     const content = (
//       <div className="max-h-72 overflow-auto border border-gray-300 rounded-md bg-blue-gray-900 text-white shadow-2xl">
//         <ul>
//           {suggestions.map((suggestion, index) => (
//             <li
//               key={index}
//               className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 hover:text-black"
//               onMouseDown={() => handleSuggestionClick(suggestion)}
//             >
//               <img
//                 src={
//                   suggestion.poster_path
//                     ? `https://image.tmdb.org/t/p/w92/${suggestion.poster_path}`
//                     : "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
//                 }
//                 alt={
//                   suggestion.title ||
//                   suggestion.name ||
//                   suggestion.original_name ||
//                   "No title"
//                 }
//                 className="w-10 h-14 object-cover rounded"
//               />
//               <span>
//                 {suggestion.title ||
//                   suggestion.name ||
//                   suggestion.original_name ||
//                   "No title"}
//               </span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );

//     if (isSmallScreen) {
//       return (
//         isSuggestionsVisible &&
//         suggestions.length > 0 && (
//           <div className="absolute top-full left-0 w-full max-w-[300px] z-[9999999] overflow-visible">
//             {content}
//           </div>
//         )
//       );
//     } else {
//       return createPortal(
//         isSuggestionsVisible && suggestions.length > 0 && (
//           <div className="fixed top-[70px] left-1/2 transform -translate-x-1/2 w-full max-w-[400px] z-[100000]">
//             {content}
//           </div>
//         ),
//         document.body
//       );
//     }
//   };

//   return (
//     <div>
//       <Navbar
//         fullWidth
//         className="w-full bg-blue-gray-900 text-white py-3 shadow-md rounded-none"
//       >
//         <div className="flex items-center justify-between w-full px-6">
//           <div className="flex items-center gap-8">
//             <Typography
//               as={Link}
//               to="/"
//               variant="h6"
//               className="cursor-pointer text-white"
//             >
//               Movies App
//             </Typography>
//             <div className="hidden lg:flex">
//               <NavList />
//             </div>
//           </div>

//           <div className="hidden lg:flex items-center gap-2" ref={searchRef}>
//             <div className="relative min-w-[200px]">
//               <input
//                 key={`search-input-lg-${searchType}`}
//                 placeholder={`Search ${searchType}`}
//                 value={searchQuery}
//                 onChange={handleInputChange}
//                 onBlur={() =>
//                   setTimeout(() => setSuggestionsVisible(false), 100)
//                 }
//                 onFocus={() => {
//                   if (searchQuery.trim() && suggestions.length > 0)
//                     setSuggestionsVisible(true);
//                 }}
//                 className="text-black bg-white placeholder-black w-full min-w-[200px] p-2 rounded-md"
//               />
//               {renderSuggestions()}
//             </div>

//             <Button
//               onClick={handleSearch}
//               color="red"
//               variant="outlined"
//               size="sm"
//               className="border-2 hover:text-white hover:bg-red-900 transition whitespace-nowrap px-2 py-2 min-w-[80px]"
//             >
//               Search
//             </Button>
//             <Button
//               onClick={toggleSearchType}
//               size="sm"
//               color="green"
//               variant="outlined"
//               className="border-2 border-green-500 text-green-500 hover:bg-green-900 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[120px]"
//             >
//               {searchType === "Movies" ? "Search Series" : "Search Movies"}
//             </Button>
//             <Button
//               size="sm"
//               color="blue"
//               variant="outlined"
//               className="border-2 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[80px]"
//             >
//               Login
//             </Button>
//           </div>

//           <IconButton
//             variant="text"
//             className="lg:hidden text-white"
//             onClick={() => setOpenNav(!openNav)}
//           >
//             <IoMenu className="h-6 w-6 text-white" />
//           </IconButton>
//         </div>
//       </Navbar>

//       <Collapse open={openNav} className="lg:hidden pb-4">
//         <div className="pt-4">
//           <NavList />
//           <div
//             className="flex flex-col gap-2 mt-4 justify-center items-center w-full relative"
//             ref={searchRef}
//           >
//             <div className="relative w-full max-w-[300px]">
//               <input
//                 key={`search-input-sm-${searchType}`}
//                 placeholder={`Search ${searchType}`}
//                 value={searchQuery}
//                 onChange={handleInputChange}
//                 onBlur={() =>
//                   setTimeout(() => setSuggestionsVisible(false), 100)
//                 }
//                 onFocus={() => {
//                   if (searchQuery.trim() && suggestions.length > 0)
//                     setSuggestionsVisible(true);
//                 }}
//                 className="text-black bg-white placeholder-black w-full p-2 rounded-md"
//               />
//               {renderSuggestions()}
//             </div>

//             <Button
//               onClick={toggleSearchType}
//               size="sm"
//               color="green"
//               variant="outlined"
//               className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[120px] mx-auto"
//             >
//               {searchType === "Movies" ? "Search Series" : "Search Movies"}
//             </Button>
//             <Button
//               onClick={handleSearch}
//               size="sm"
//               color="red"
//               variant="outlined"
//               className="border-2 hover:text-white hover:bg-red-900 transition whitespace-nowrap px-2 py-2 min-w-[80px] mx-auto"
//             >
//               Search
//             </Button>
//           </div>
//         </div>
//       </Collapse>
//     </div>
//   );
// };

// export default Header;
