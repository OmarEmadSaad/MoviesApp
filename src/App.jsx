import Header from "./Header";
import Footer from "./Footer";
import Home from "./components/Home/pages/index";
import { Route, Routes } from "react-router-dom";
import Contact from "./components/Contact Us/pages/Contact";
import Movies from "./components/Movies/pages/Movies";
import Series from "./components/Series/pages/Series";
const App = () => {
  return (
    <div className="bg-black">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<Series />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
