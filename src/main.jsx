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
import UserDashboard from "./USER/Dashboard.jsx";
import AdminBackgroundLayout from "./AdminBackgroundLayout.jsx";
import UserBackgroundLayout from "./UserBackgroundLayout.jsx";
import User from "./ADMIN/User.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Admin routes */}

        <Route
          path="/admin"
          element={
            <AdminBackgroundLayout>
              <Login />
            </AdminBackgroundLayout>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminBackgroundLayout>
              <Dashboard />
            </AdminBackgroundLayout>
          }
        />
        <Route
          path="/admin/role"
          element={
            <AdminBackgroundLayout>
              <Role />
            </AdminBackgroundLayout>
          }
        />
        <Route
          path="/admin/dept"
          element={
            <AdminBackgroundLayout>
              <Department />
            </AdminBackgroundLayout>
          }
        />
        <Route
          path="/admin/user"
          element={
            <AdminBackgroundLayout>
              <User />
            </AdminBackgroundLayout>
          }
        />
        {/* User routes */}
        <Route
          path="/"
          element={
            <UserBackgroundLayout>
              <UserLogin />
            </UserBackgroundLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <UserBackgroundLayout>
              <UserDashboard />
            </UserBackgroundLayout>
          }
        />
        <Route
          path="/google/callback"
          element={
            <UserBackgroundLayout>
              <GoogleCallback />
            </UserBackgroundLayout>
          }
        />
        <Route
          path="/authentication"
          element={
            <UserBackgroundLayout>
              <Authentication />
            </UserBackgroundLayout>
          }
        />
      </Routes>
    </Router>
  </StrictMode>,
);
