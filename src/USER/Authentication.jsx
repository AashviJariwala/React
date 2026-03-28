import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const navigate = useNavigate();
    const token = sessionStorage.getItem("userToken");

  const [error, setError] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {    
    setPhoto(e.target.files[0] ? e.target.files[0] : null);

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3000/auth/idCard",
        {
          photo,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then(() => {
        // console.log(res.data.data);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setError(err.response.data.error + "*");
      });
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">ID Card Details</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="custom-file-upload">
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleChange}
              required
              accept="image/jpg,image/jpeg,image/png"
            />

            <label htmlFor="photo" className="file-label">
              {photo ? photo.name : "Choose ID Card"}
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Authentication;
