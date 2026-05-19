import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {API_URL} from "./config"


const UserBackgroundLayout = ({ children}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [labels, setLabels] = useState("Dashboard");

  const location = useLocation();
  const navigate = useNavigate();
  
  const hideSidebarRoutes = ["/", "/authentication"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  function getUserDetails() {
    const token = sessionStorage.getItem("userToken");
    axios
      .get(API_URL+"/user/getUserDetails", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setUserRole(res.data.data.userRole);
        setUserName(res.data.data.userName)
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setError(err.response.data.error + "*");
      });
  }

  useEffect(()=>{
    if(!hideSidebar)
      getUserDetails();
  },[hideSidebar])

  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
    setShowLogoutPopup(false);
    navigate("/");
  };

  const closeSidebar = (label) =>{     
    setLabels(label);
    setSidebarOpen(false)
  };

  const initials = (userName.includes(" ") ? userName
  .split(" ")
  .map((n) => n[0])
  .join("")
  .toUpperCase()
  .slice(0, 2) : userName.slice(0, 1).toUpperCase())

  const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/search", label: "People"},
    { to: "/meeting", label: "Invite Employees", },
    { to: "/collab", label: "Collababoration" },
    { to: "/searchByTimeslot", label:"Schedule Meeting" },
    { to: "/updateCard", label: "Update ID Card" },
    { to: "/editVisibility", label: "Update Visibility" },
  ];

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/search": "People",
    "/meeting": "Invite Employees",
    "/collab": "Collababoration",
    "/searchByTimeslot": "Schedule Meeting",
    "/updateCard": "Update ID Card",
    "/editVisibility": "Update Visibility",
  };

  const currentTitle = pageTitles[location.pathname] || "Synchro";
  const firstName = userName.split(" ")[0];
  if (hideSidebar) {
    return (
      <div className="app-background">
        <div className="app-content">{children}</div>
      </div>
    );
  }

  return (
    <div className="user-app-background">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
        onClick={closeSidebar}
      />

      {/* Left Sidebar */}
      <aside className={`new-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <img src="/Images/Logo.png" alt="Logo" height={70} width={70} />
          </div>
          <span className="sidebar-brand-name">Synchro</span>
        </div>

        {/* User row */}
        <div className="sidebar-user-row">
          <div className="sidebar-user-info">
            <span className="sidebar-user-name" style={{ textTransform: "capitalize" }}>{userName}</span>
            <span className="sidebar-user-role" style={{ textTransform: "capitalize" }}>{userRole}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map(({ to, label, badge, badgeClass }) => (
            <Link
              key={to}
              to={to}
              className={`sidebar-link ${location.pathname === to ? "active" : ""}`}
              onClick={()=>closeSidebar(label)}
            >
              <span className="sidebar-link-inner">{label}</span>
              {badge && (
                <span className={`sidebar-badge ${badgeClass || ""}`}>{badge}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar-logout">
          <div
            className="sidebar-link"
            onClick={() => {
              closeSidebar(labels);
              setShowLogoutPopup(true);
            }}
            style={{ cursor: "pointer" }}
          >
            <span className="sidebar-link-inner">Logout</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content-area">
        {/* Top bar */}
        <header className="main-topbar">
          <div className="main-topbar-left">
            {/* Hamburger — visible only on mobile via CSS */}
            <button
              className="hamburger-inline"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <span className="main-topbar-greeting">
              {labels}
            </span>
          </div>

          <div className="main-topbar-right">
            <div className="profile-circle">{initials}</div>
          </div>
        </header>

        {/* Page content */}
        <main className="main-page-body">
          {children}
        </main>
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
