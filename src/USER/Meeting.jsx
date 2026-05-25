import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const Meeting = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("userToken");

  const [error, setError] = useState("");
  const [result, setResult] = useState([]);
  const [meetingLink, setMeetingLink] = useState([]);
  const [meetID, setMeetID] = useState("");
  const [participantID, setParticipantID] = useState([]);
  const [query, setQuery] = useState("");
  const [searchRes, setSearchRes] = useState([]);

  function getData() {
    axios
      .get(API_URL + "/search/showAllEmployee", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setResult(res.data.data);
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setError(err.response.data.error + "*");
      });
  }

  function getMeetingData() {
    axios
      .get(API_URL + "/meeting/getAllMeetings", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setMeetingLink(res.data.data);
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setError(err.response.data.error + "*");
      });
  }

  const handleNotifications = () => {
    if (!meetID || meetID==="0"||participantID.length==0) {
      setError("*Please select meeting or employees");
    } else {
      setError("");
      axios
        .post(
          API_URL + "/meeting/sendNoti",
          {
            meetID: meetID,
            participantID: participantID,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          setMeetID("");
          setParticipantID([]);
          navigate("/dashboard");
        });
    }
  };
  useEffect(() => {
    if (query.length === 0) {
      getData();
      return;
    }
    const delay = setTimeout(() => {
      axios
        .get(API_URL + "/search/searchProfile/" + query, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          setSearchRes(res.data.data);
          setResult([]);
        });
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    getMeetingData();
  }, []);

  const handleMeetChange = (e) => {
    setMeetID(e.target.value);
  };

  const handleParticipantChange = (e) => {
    const value = e.target.value;
    if (participantID.includes(value)) {
      setParticipantID(participantID.filter((id) => id !== value));
    } else {
      setParticipantID([...participantID, value]);
    }
  };
  return (
    <>
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="search-box">
          <select onChange={handleMeetChange}>
            <option value={0}>--SELECT MEETING LINK--</option>
            {meetingLink.map((r, index) => (
              <option className="user-name" value={r.id} key={index}>
                {r.title
                  ? `${r.title[0].toUpperCase() + r.title.slice(1)}-${r.mlink}`
                  : r.mlink}
              </option>
            ))}
          </select>
        </div>
      </div>
      {query && (
        <div className="user-list-container">
          {searchRes.map((r, index) => (
            <div key={index} className="user-row">
              <input
                type="checkbox"
                value={r._id}
                onChange={handleParticipantChange}
              />
              <div className="avatar">
                <span>👤</span>
              </div>
              <p className="user-name">{r.name}</p>
            </div>
          ))}
        </div>
      )}

      <div className="user-section">
        <div className="user-list-container">
          {result.map((r, index) => (
            <div key={index} className="user-row">
              <input
                type="checkbox"
                value={r._id}
                onChange={handleParticipantChange}
              />
              <div className="avatar">
                <span>👤</span>
              </div>
              <p className="user-name">{r.name}</p>
            </div>
          ))}
        </div>

        <div className="button-container">
          <button
            type="submit"
            className="ok-btn"
            onClick={handleNotifications}
          >
            Send notification
          </button>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </>
  );
};

export default Meeting;
