import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource/poppins";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./ADMIN/Login.jsx";
import Role from "./ADMIN/Role.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="app-background">
      <div className="app-content">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/role" element={<Role />} />
          </Routes>
        </Router>
      </div>
    </div>
  </StrictMode>
);
