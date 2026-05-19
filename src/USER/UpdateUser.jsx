import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";
import {API_URL} from "../config"

const UpdateUser = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("userToken");

  const [error, setError] = useState("");
  const [visibility, setVisibility] = useState(false);


  useEffect(()=>{
    axios.get(API_URL+"/user/getVisibility",  {
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((res)=>{
      setVisibility(res.data.data)
    })
  },[])

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(
        API_URL+"/user/editVisibility/" + visibility,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        console.log(res.data.data);

        setError("");
      })
      .catch((err) => {
        console.log(err.response?.data?.error);
        setError(err.response?.data?.error + "*");
      });
  };

  return (
    <div className="privacy-wrapper">
      <div className="privacy-card">
        <h2>Event Visibility</h2>

        <div className="switch-row">
          <span>Visibility</span>

          <Switch
            onChange={() => setVisibility(!visibility)}
            checked={visibility}
            onColor="#c89b6d"
            offColor="#ccc"
            uncheckedIcon={false}
            checkedIcon={false}
            height={22}
            width={44}
          />
        </div>

        <p className="desc">
          When your visibility is ON, your event details will be visible to
          everyone who visits your profile.
        </p>

        <p className="desc">
          When your visibility is OFF, people will only see whether you are busy
          or free.
        </p>

        <button className="save-btn" onClick={handleSubmit}>
          Submit
        </button>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default UpdateUser;