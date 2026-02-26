import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <div className="button-container">
        <Link
          to="/role"
          className="login-btn"
          style={{ texDecoration: "none"}}
        >
          View Roles
        </Link>
        <Link
          to="/dept"
          className="login-btn"
          style={{ texDecoration: "none"}}
        >
          View Department
        </Link>
      </div>
    </>
  );
};

export default Dashboard;
