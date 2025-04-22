import Header from "./components/Header";
import Footer from "./Footer";
import Home from "./components/Home/pages/index";
const App = () => {
  return (
    <div className="bg-black">
      <Header />
      <Home />
      <Footer />
    </div>
  );
};

export default App;
