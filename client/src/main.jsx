import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";

import NavBar from "./components/NavBar.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Roadmap from "./pages/Roadmap.jsx";
import { Provider } from "react-redux";

import { store } from "./stores/store.js";
import Roadmaps from "./pages/Roadmaps.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/roadmap" element={<Roadmaps />} />
          <Route path="/roadmap/:_id" element={<Roadmap />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
