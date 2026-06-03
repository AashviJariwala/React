import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {API_URL} from "../config"

const Search = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("userToken");

  const [error, setError] = useState("");
  const [result, setResult] = useState([]);
  const [query, setQuery] = useState("");
  const [searchRes, setSearchRes] = useState([]);

  function getData() {
    axios
      .get(API_URL+"/search/showAllEmployee", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setResult(res.data.data);
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setError(err.response.data.error + "*");
      });
  }

  useEffect(() => {
    if (query.length === 0) {
      getData();
      return;
    }
    const delay = setTimeout(() => {
      axios
        .get(API_URL+"/search/searchProfile/" + query, {
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

  const handleClick = (r) => {
    navigate("/userProfile", {
      state: { id: r._id },
    });
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
      <div className="user-list-container">
        {result.map((r, index) => (
          <div key={index} className="user-row" onClick={() => handleClick(r)}>
            <div className="avatar">
              <span>👤</span>
            </div>
            <p className="user-name">{r.name}</p>
          </div>
        ))}
      </div>
      {error && <div className="error-message">{error}</div>}
    </>
  );
};

export default Search;
