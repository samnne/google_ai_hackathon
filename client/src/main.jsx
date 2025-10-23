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
          <Route path="/google_ai_hackathon" element={<Home />} />
          <Route path="/google_ai_hackathon/profile" element={<Profile />} />
          <Route path="/google_ai_hackathon/roadmap" element={<Roadmaps />} />
          <Route path="/google_ai_hackathon/roadmap/:_id" element={<Roadmap />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
