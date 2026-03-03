import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource/poppins";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./ADMIN/Login.jsx";
import Role from "./ADMIN/Role.jsx";
import UserLogin from "./USER/Login.jsx";
import Department from "./ADMIN/Department.jsx";
import Dashboard from "./ADMIN/Dashboard.jsx";
import GoogleCallback from "./USER/GoogleCallback.jsx";
import Authentication from "./USER/Authentication.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="app-background">
      <div className="app-content">
        <Router>
          <Routes>
            <Route path="/admin" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/role" element={<Role />} />
            <Route path="/" element={<UserLogin />} />
            <Route path="/dept" element={<Department />} />
            <Route path="/google/callback" element={<GoogleCallback />} />
            <Route path="/authentication" element={<Authentication />} />
          </Routes>
        </Router>
      </div>
    </div>
  </StrictMode>,
);
