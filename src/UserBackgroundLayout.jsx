import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const UserBackgroundLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const hideSidebarRoutes = ["/", "/authentication"];

  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="user-app-background">
      {!hideSidebar && (
        <button className="hamburger-left" onClick={() => setOpen(!open)}>
          ☰
        </button>
      )}

      {/* Sidebar */}
      {!hideSidebar && (
        <div className={`sidebar ${open ? "open" : ""}`}>
          <nav className="sidebar-nav">
            <Link to="/dashboard" className="sidebar-link">
              Dashboard
            </Link>
            <Link to="/authentication" className="sidebar-link">
              Authentication
            </Link>
            <Link to="/" className="sidebar-link">
              Logout
            </Link>
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className={`page-container ${open ? "shift" : ""}`}>
        <div className="user-app-content">{children}</div>
      </div>
    </div>
  );
};

export default UserBackgroundLayout;
