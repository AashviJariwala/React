import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/admin/", {
        email: data["email"],
        password: data["password"],
      })
      .then((res) => {
        // console.log(res.data.data);
        document.getElementById("d1").innerHTML = "";
        sessionStorage.setItem("token", res.data.data);
        navigate("/role");
      })
      .catch((err) => {
        console.log(err.response.data.error);
        document.getElementById("d1").style.color = "red";
        setError(err.response.data.error + "*");
      });
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Admin Login</h2>

        <div id="d1" className="error-message"></div>

        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{fontFamily: "'Playfair Display', serif"}}>
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
