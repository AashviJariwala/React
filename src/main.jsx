import React, { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import Login from "./ADMIN/Login.jsx";
import UserLogin from "./USER/Login.jsx";
import GoogleCallback from "./USER/GoogleCallback.jsx";
import ProtectedRoute from "./USER/ProtectedRoute.jsx";
import AdminBackgroundLayout from "./AdminBackgroundLayout.jsx";
import UserBackgroundLayout from "./UserBackgroundLayout.jsx";

/**Admin Routes */
const Role = lazy(() => import("./ADMIN/Role.jsx"));
const Department = lazy(() => import("./ADMIN/Department.jsx"));
const Dashboard = lazy(() => import("./ADMIN/Dashboard.jsx"));
const User = lazy(() => import("./ADMIN/User.jsx"));

/**User Routes */
const Authentication = lazy(() => import("./USER/Authentication.jsx"));
const UserDashboard = lazy(() => import("./USER/Dashboard.jsx"));

const Search = lazy(() => import("./USER/Search.jsx"));
const UpdateUser = lazy(() => import("./USER/UpdateUser.jsx"));
const UserProfile = lazy(() => import("./USER/UserProfile.jsx"));
const Meeting = lazy(() => import("./USER/Meeting.jsx"));
const SearchByTimeSlot = lazy(() => import("./USER/SearchByTimeSlot.jsx"));
const CollaborativeEvents = lazy(() =>
  import("./USER/CollaborativeEvents.jsx")
);
const UserData = lazy(() => import("./USER/UserData.jsx"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Suspense
        fallback={
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
        }
      >
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
      </Suspense>
    </Router>
  </StrictMode>
);
