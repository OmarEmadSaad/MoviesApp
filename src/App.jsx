import Header from "./Header";
import Footer from "./Footer";
import Home from "./components/Home/pages/index";
import { Route, Routes } from "react-router-dom";
import Contact from "./components/Contact Us/pages/Contact";
import Movies from "./components/Movies/pages/Movies";
import Series from "./components/Series/pages/Series";
import MovieDetails from "./components/Movies/pages/MovieDetails";
import MovieCastCrew from "./components/Movies/pages/MovieCastCrew";
import MovieReviewPage from "./components/Movies/pages/MovieReviewPage";
import PersonPage from "./components/Movies/pages/PersonPage";
import NotFound from "./NotFound";
const App = () => {
  return (
    <div className="bg-black">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<Series />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/movie/:id/cast_crew" element={<MovieCastCrew />} />
        <Route path="/movie/:id/movie_review" element={<MovieReviewPage />} />
        <Route path="/person/:id" element={<PersonPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
