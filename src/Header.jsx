import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoMenu, IoClose } from "react-icons/io5";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  Button,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { getMoviebySearch } from "./components/Redux/DetailsMoviesSlice/movieDetailsSlice";
import { getSeriesBySearch } from "./components/Redux/DetailsSeriesSlice/DetailsSeriesSlice";

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
        className="p-1 font-medium text-white hover:text-light-blue-900 transition"
      >
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
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { MoviebySearch, getMoviebySearchError } = useSelector(
    (state) => state.onemoviedetails
  );
  const { getSeriesBySearch: seriesSearchData, getSeriesBySearchError } =
    useSelector((state) => state.SeriesDetails);

  const mockData = searchType === "Movies" ? MoviebySearch : seriesSearchData;

  const handleWindowResize = () => {
    if (window.innerWidth >= 960) setOpenNav(false);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (typeof searchQuery === "string" && searchQuery.trim()) {
      setError(null);

      if (searchType === "Movies") {
        dispatch(getMoviebySearch(searchQuery));
      } else if (searchType === "Series") {
        dispatch(getSeriesBySearch(searchQuery));
      } else {
        setError("Invalid search type");
      }
      setSuggestionsVisible(true);
    } else {
      setSuggestions([]);
      setSuggestionsVisible(false);
      setSelectedItemId(null);
    }
  }, [searchQuery, dispatch, searchType]);

  useEffect(() => {
    if (searchType === "Movies" && getMoviebySearchError) {
      setError("Failed to fetch movie suggestions");
      setSuggestions([]);
      setSuggestionsVisible(false);
    } else if (searchType === "Series" && getSeriesBySearchError) {
      setError("Failed to fetch series suggestions");
      setSuggestions([]);
      setSuggestionsVisible(false);
    }
  }, [getMoviebySearchError, getSeriesBySearchError, searchType]);

  useEffect(() => {
    if (
      mockData &&
      Array.isArray(mockData) &&
      typeof searchQuery === "string" &&
      searchQuery.trim() &&
      isSuggestionsVisible
    ) {
      const filtered = mockData.filter((item) => {
        const itemName = item.title || item.name || item.original_name || "";
        return itemName.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [mockData, searchQuery, isSuggestionsVisible]);

  const toggleSearchType = () => {
    const newType = searchType === "Movies" ? "Series" : "Movies";
    setSearchType(newType);
    setSelectedItemId(null);
    setSearchQuery("");
    setSuggestions([]);
    setError(null);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedItemId(null);
  };

  const handleClearInput = () => {
    setSearchQuery("");
    setSuggestions([]);
    setSuggestionsVisible(false);
    setSelectedItemId(null);
    setError(null);
  };

  const handleSuggestionClick = (suggestion) => {
    const title =
      suggestion.title || suggestion.name || suggestion.original_name;
    if (title && suggestion.id) {
      setSearchQuery(title);
      setSelectedItemId(suggestion.id);
      setSuggestions([]);
      setSuggestionsVisible(false);
    } else {
      setSearchQuery("");
      setSelectedItemId(null);
      setSuggestions([]);
      setSuggestionsVisible(false);
    }
  };

  const handleSearch = () => {
    if (typeof searchQuery !== "string" || searchQuery.trim() === "") {
      setError("Please enter a search query");
      return;
    }

    if (selectedItemId) {
      const path =
        searchType === "Movies"
          ? `/movie/${selectedItemId}`
          : `/series/${selectedItemId}`;
      navigate(path);
      setSelectedItemId(null);
      setSearchQuery("");
      setSuggestions([]);
      setSuggestionsVisible(false);
      setError(null);
      return;
    }

    const matchedItem = suggestions.find((item) => {
      const itemName = item.title || item.name || item.original_name || "";
      return itemName.toLowerCase() === searchQuery.toLowerCase();
    });

    if (matchedItem && matchedItem.id) {
      const path =
        searchType === "Movies"
          ? `/movie/${matchedItem.id}`
          : `/series/${matchedItem.id}`;
      navigate(path);
    } else {
      if (searchType !== "Movies" && searchType !== "Series") {
        setError("Invalid search type");
        return;
      }
      const normalizedSearchType = searchType.toLowerCase();
      const searchPath = `/search/${normalizedSearchType}/${encodeURIComponent(
        searchQuery
      )}`;
      navigate(searchPath);
    }

    setSearchQuery("");
    setSuggestions([]);
    setSuggestionsVisible(false);
    setError(null);
  };

  const renderSuggestions = () => {
    if (
      !searchRef.current ||
      !isSuggestionsVisible ||
      suggestions.length === 0
    ) {
      return null;
    }

    if (window.innerWidth >= 1120) {
      const rect = searchRef.current.getBoundingClientRect();
      const topPosition = rect.bottom + window.scrollY + 58;
      const leftPosition = rect.left + 990;

      return createPortal(
        <div
          className="fixed w-full max-w-[300px] z-50"
          style={{
            top: `${topPosition}px`,
            left: `${leftPosition}px`,
          }}
        >
          <div className="max-h-72 overflow-auto border border-gray-300 rounded-md bg-blue-gray-900 text-white shadow-2xl">
            <ul role="listbox">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 hover:text-black"
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                  onTouchStart={() => handleSuggestionClick(suggestion)}
                  role="option"
                  aria-selected={selectedItemId === suggestion.id}
                >
                  <img
                    src={
                      suggestion.poster_path
                        ? `https://image.tmdb.org/t/p/w92/${suggestion.poster_path}`
                        : "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
                    }
                    alt={
                      suggestion.title ||
                      suggestion.name ||
                      suggestion.original_name ||
                      "No title"
                    }
                    className="w-10 h-14 object-cover rounded"
                  />
                  <span>
                    {suggestion.title ||
                      suggestion.name ||
                      suggestion.original_name ||
                      "No title"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>,
        document.body
      );
    }

    if (window.innerWidth >= 960) {
      const rect = searchRef.current.getBoundingClientRect();
      const topPosition = rect.bottom + window.scrollY + 58;
      const leftPosition = rect.left + 515;

      return createPortal(
        <div
          className="fixed w-full max-w-[300px] z-50"
          style={{
            top: `${topPosition}px`,
            left: `${leftPosition}px`,
          }}
        >
          <div className="max-h-72 overflow-auto border border-gray-300 rounded-md bg-blue-gray-900 text-white shadow-2xl">
            <ul role="listbox">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 hover:text-black"
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                  onTouchStart={() => handleSuggestionClick(suggestion)}
                  role="option"
                  aria-selected={selectedItemId === suggestion.id}
                >
                  <img
                    src={
                      suggestion.poster_path
                        ? `https://image.tmdb.org/t/p/w92/${suggestion.poster_path}`
                        : "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
                    }
                    alt={
                      suggestion.title ||
                      suggestion.name ||
                      suggestion.original_name ||
                      "No title"
                    }
                    className="w-10 h-14 object-cover rounded"
                  />
                  <span>
                    {suggestion.title ||
                      suggestion.name ||
                      suggestion.original_name ||
                      "No title"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>,
        document.body
      );
    }
    const rect = searchRef.current.getBoundingClientRect();
    const topPosition = rect.bottom + window.scrollY;
    const leftPosition = rect.left + rect.width / 2;

    return createPortal(
      <div
        className="fixed w-full max-w-[300px] z-50"
        style={{
          top: `${topPosition}px`,
          left: `${leftPosition}px`,
          transform: "translateX(-50%)",
        }}
      >
        <div className="max-h-72 overflow-auto border border-gray-300 rounded-md bg-blue-gray-900 text-white shadow-2xl">
          <ul role="listbox">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 hover:text-black"
                onMouseDown={() => handleSuggestionClick(suggestion)}
                onTouchStart={() => handleSuggestionClick(suggestion)}
                role="option"
                aria-selected={selectedItemId === suggestion.id}
              >
                <img
                  src={
                    suggestion.poster_path
                      ? `https://image.tmdb.org/t/p/w92/${suggestion.poster_path}`
                      : "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
                  }
                  alt={
                    suggestion.title ||
                    suggestion.name ||
                    suggestion.original_name ||
                    "No title"
                  }
                  className="w-10 h-14 object-cover rounded"
                />
                <span>
                  {suggestion.title ||
                    suggestion.name ||
                    suggestion.original_name ||
                    "No title"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      <Navbar
        fullWidth
        className="w-full bg-blue-gray-900 text-white py-3 shadow-md rounded-none"
      >
        <div className="flex items-center justify-between w-full px-6">
          <div className="flex items-center gap-8">
            <Typography
              as={Link}
              to="/"
              variant="h6"
              className="cursor-pointer text-white"
            >
              Movies App
            </Typography>
            <div className="hidden lg:flex">
              <NavList />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2" ref={searchRef}>
            <div className="relative min-w-[200px]">
              <div className="relative">
                <input
                  key={`search-input-lg-${searchType}`}
                  placeholder={`Search ${searchType}`}
                  value={searchQuery}
                  onChange={handleInputChange}
                  onBlur={() =>
                    setTimeout(() => setSuggestionsVisible(false), 100)
                  }
                  onFocus={() => {
                    if (
                      typeof searchQuery === "string" &&
                      searchQuery.trim() &&
                      suggestions.length > 0
                    )
                      setSuggestionsVisible(true);
                  }}
                  className="text-black bg-white placeholder-black w-full min-w-[200px] p-2 pr-8 rounded-md"
                  aria-label={`Search ${searchType}`}
                />
                {searchQuery && (
                  <IoClose
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                    onClick={handleClearInput}
                    aria-label="Clear search"
                  />
                )}
              </div>
              {error && (
                <span className="text-red-500 text-sm mt-1">{error}</span>
              )}
              {renderSuggestions()}
            </div>

            <Button
              onClick={handleSearch}
              color="red"
              variant="outlined"
              size="sm"
              className="border-2 hover:text-white hover:bg-red-900 transition whitespace-nowrap px-2 py-2 min-w-[80px]"
            >
              Search
            </Button>
            <Button
              onClick={toggleSearchType}
              size="sm"
              color="green"
              variant="outlined"
              className="border-2 border-green-500 text-green-500 hover:bg-green-900 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[120px]"
            >
              {searchType === "Movies" ? "Search Series" : "Search Movies"}
            </Button>
          </div>

          <IconButton
            variant="text"
            className="lg:hidden text-white"
            onClick={() => setOpenNav(!openNav)}
          >
            <IoMenu className="h-6 w-6 text-white" />
          </IconButton>
        </div>
      </Navbar>

      <Collapse open={openNav} className="lg:hidden pb-4">
        <div className="pt-4">
          <NavList />
          <div
            className="flex flex-col gap-2 mt-4 justify-center items-center w-full relative"
            ref={searchRef}
          >
            <div className="relative w-full max-w-[300px]">
              <div className="relative">
                <input
                  key={`search-input-sm-${searchType}`}
                  placeholder={`Search ${searchType}`}
                  value={searchQuery}
                  onChange={handleInputChange}
                  onBlur={() =>
                    setTimeout(() => setSuggestionsVisible(false), 100)
                  }
                  onFocus={() => {
                    if (
                      typeof searchQuery === "string" &&
                      searchQuery.trim() &&
                      suggestions.length > 0
                    )
                      setSuggestionsVisible(true);
                  }}
                  className="text-black bg-white placeholder-black w-full p-2 pr-8 rounded-md"
                  aria-label={`Search ${searchType}`}
                />
                {searchQuery && (
                  <IoClose
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                    onClick={handleClearInput}
                    aria-label="Clear search"
                  />
                )}
              </div>
              {error && (
                <span className="text-red-500 text-sm mt-1">{error}</span>
              )}
              {renderSuggestions()}
            </div>

            <Button
              onClick={toggleSearchType}
              size="sm"
              color="green"
              variant="outlined"
              className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition whitespace-nowrap px-2 py-2 min-w-[120px] mx-auto"
            >
              {searchType === "Movies" ? "Search Series" : "Search Movies"}
            </Button>
            <Button
              onClick={handleSearch}
              size="sm"
              color="red"
              variant="outlined"
              className="border-2 hover:text-white hover:bg-red-900 transition whitespace-nowrap px-2 py-2 min-w-[80px] mx-auto"
            >
              Search
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Header;
