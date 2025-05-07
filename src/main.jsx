import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "@material-tailwind/react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./components/Redux/store.js";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <Provider store={store}>
        <>
          <App />
          <ToastContainer position="top-center" autoClose={3000} />
        </>
      </Provider>
    </ThemeProvider>
  </BrowserRouter>
);
