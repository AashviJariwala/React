import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {API_URL} from "../config"


const Role = () => {
  const [name, setName] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedEditRoles, setSelectedEditRoles] = useState("");

  const containerRef = useRef(null);

  const token = sessionStorage.getItem("token");

  function getData() {
    axios
      .get(API_URL+"/admin/displayRole", {
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
    getData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        editMode &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setEditMode(false);
        setSelectedRoles("");
        setName("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editMode]);

  const handleCheckboxChange = (id) => {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleEditCheckboxChange = (id, name) => {
    console.log("edit");
    setName(name);
    setSelectedEditRoles(selectedEditRoles === id ? null : id);
  };

  const handleEditClick = () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }

    axios
      .put(
        API_URL+"/admin/editRole/" + selectedEditRoles,
        {
          name,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      )
      .then((res) => {
        console.log(res.data.msg);
        getData();
        setName("");
        setEditMode(false);
        setSelectedEditRoles("");
      })
      .catch((err) => {
        console.log(err.response.data.error);
        document.getElementById("d1").style.color = "red";
        document.getElementById("d1").innerHTML =
          "<span style='color:red'>*</span> " + err.response.data.error;
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editMode) {
      axios
        .post(
          API_URL+"/admin/insertRole",
          {
            name,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          },
        )
        .then((res) => {
          console.log(res.data.msg);
          getData();
          setName("");
        })
        .catch((err) => {
          console.log(err.response.data.error);
          document.getElementById("d1").style.color = "red";
          document.getElementById("d1").innerHTML =
            "<span style='color:red'>*</span> " + err.response.data.error;
        });
    } else {
      handleEditClick();
    }
  };
  return (
    <>
      <div className="role-container center-layout" ref={containerRef}>
        <h2 className="title">Company Roles</h2>
        <div className="card-grid">
          {result.map((r) => (
            <div key={r._id} className="role-card">
              {editMode && (
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedEditRoles === r._id}
                  onChange={() => handleEditCheckboxChange(r._id, r.name)}
                  style={{ marginBottom: "10px", transform: "scale(1.3)" }}
                />
              )}
              <p style={{ textTransform: "capitalize", fontSize: "19px" }}>
                {r.name}
              </p>
            </div>
          ))}
        </div>
        <div className="button-container">
          <button type="submit" className="edit-btn" onClick={handleEditClick}>
            Edit
          </button>
        </div>
        <div className="login-container">
          <div className="login-card">
            <div id="d1" className="error-message"></div>
            <form method="post" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Role Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="login-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Role;
