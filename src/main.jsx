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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="app-background">
      <div className="app-content">
        <Router>
          <Routes>
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/role" element={<Role />} />
            <Route path="/" element={<UserLogin />} />
            <Route path="/dept" element={<Department />} />
          </Routes>
        </Router>
      </div>
    </div>
  </StrictMode>,
);
