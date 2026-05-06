import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      .get("http://localhost:3000/search/showAllEmployee", {
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
      .get("http://localhost:3000/meeting/getAllMeetings", {
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
    axios
      .post(
        "http://localhost:3000/meeting/sendNoti",
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
        console.log();
      });
  };
  useEffect(() => {
    if (query.length === 0) {
      getData();
      return;
    }
    const delay = setTimeout(() => {
      axios
        .get("http://localhost:3000/search/searchProfile/" + query, {
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
    setParticipantID([...participantID, e.target.value ]);
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
            <option>--SELECT MEETING LINK--</option>
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
            <div
              key={index}
              className="user-row"
              onClick={(r) => handleClick(r)}
            >
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
                onClick={handleParticipantChange}
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
