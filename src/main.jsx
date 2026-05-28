import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import "@fontsource/poppins";
// import "@fontsource/poppins/400.css";
// import "@fontsource/poppins/500.css";
// import "@fontsource/poppins/600.css";
// import "@fontsource/poppins/700.css";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
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
import Search from "./USER/Search.jsx";
import UpdateUser from "./USER/UpdateUser.jsx";
import UserProfile from "./USER/UserProfile.jsx";
import Meeting from "./USER/Meeting.jsx";
import SearchByTimeSlot from "./USER/SearchByTimeSlot.jsx";
import CollaborativeEvents from "./USER/CollaborativeEvents.jsx";
import ProtectedRoute from "./USER/ProtectedRoute.jsx";
import UserData from "./USER/UserData.jsx";

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
            <ProtectedRoute>
              <UserBackgroundLayout>
                <UserDashboard />
              </UserBackgroundLayout>
            </ProtectedRoute>
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
            <ProtectedRoute>
              <UserBackgroundLayout>
                <Authentication />
              </UserBackgroundLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/updateCard"
          element={
            <ProtectedRoute>
              <UserBackgroundLayout>
                <Authentication />
              </UserBackgroundLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <UserBackgroundLayout>
                <Search />
              </UserBackgroundLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/editVisibility"
          element={
            <ProtectedRoute>
              <UserBackgroundLayout>
                <UpdateUser />
              </UserBackgroundLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/searchByTimeslot"
          element={
            <ProtectedRoute>
              <UserBackgroundLayout>
                <SearchByTimeSlot />
              </UserBackgroundLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/userProfile"
          element={
            <ProtectedRoute>
              <UserBackgroundLayout>
                <UserProfile />
              </UserBackgroundLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/meeting"
          element={
            <ProtectedRoute>
              <UserBackgroundLayout>
                <Meeting />
              </UserBackgroundLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/collab"
          element={
            <ProtectedRoute>
              <UserBackgroundLayout>
                <CollaborativeEvents />
              </UserBackgroundLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/userData"
          element={
            <ProtectedRoute>
              <UserBackgroundLayout>
                <UserData />
              </UserBackgroundLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </StrictMode>
);
