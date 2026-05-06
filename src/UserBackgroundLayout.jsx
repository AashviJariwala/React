import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const UserBackgroundLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const hideSidebarRoutes = ["/", "/authentication"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
    setShowLogoutPopup(false);
    navigate("/");
  };

  return (
    <div className="user-app-background">
      {!hideSidebar && (
        <div className="top-header">
          {/* LEFT SIDE */}
          <div className="header-left">
            <button className="hamburger-inline" onClick={() => setOpen(!open)}>
              ☰
            </button>

            <div className="header-title">
              <span className="header-icon">📚</span>
              <span>Classroom</span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          {/* <div className="header-right">
            <span className="header-icon-btn">+</span>
          </div> */}
        </div>
      )}
      {/* Sidebar */}
      {!hideSidebar && (
        <div className={`sidebar ${open ? "open" : ""}`}>
          <nav className="sidebar-nav">
            <Link to="/dashboard" className="sidebar-link">
              Dashboard
            </Link>

            <Link to="/search" className="sidebar-link">
              People
            </Link>

            <Link to="/updateCard" className="sidebar-link">
              Update ID Card
            </Link>

            <Link to="/editVisibility" className="sidebar-link">
              Update Visibility
            </Link>

            <Link to="/searchByTimeslot" className="sidebar-link">
              Search By Timeslot
            </Link>

            {/* Logout button */}
            <div
              className="sidebar-link"
              onClick={() => setShowLogoutPopup(true)}
              style={{ cursor: "pointer" }}
            >
              Logout
            </div>
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className={`page-container ${open ? "shift" : ""}`}>
        <div className="user-app-content">{children}</div>
      </div>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <div className="overlay">
          <div className="popup">
            <h3>Are you sure you want to logout?</h3>

            <div className="buttons">
              <button onClick={handleLogout}>Logout</button>
              <button onClick={() => setShowLogoutPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBackgroundLayout;