import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Role = () => {
  const [name, setName] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const containerRef = useRef(null);

  const token = sessionStorage.getItem("token");

  function getData() {
    axios
      .get("http://localhost:3000/admin/displayRole", {
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
        deleteMode &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setDeleteMode(false);
        setSelectedRoles([]);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deleteMode]);


  const handleCheckboxChange = (id) => {
    setSelectedRoles((prev) => (
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    ));
  };

  const handleDeleteClick = () => {
    if (!deleteMode) {
      setDeleteMode(true);
      return;
    }

    // if (selectedRoles.length === 0) {
    //   alert("Please select at least one role to delete.");
    //   return;
    // }


    axios
    .delete(
      "http://localhost:3000/admin/deleteRole/"+selectedRoles,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
    .then((res) => {
      console.log(res.data.msg);
      getData();
      setDeleteMode(false);
      
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
    axios
      .post(
        "http://localhost:3000/admin/insertRole",
        {
          name,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
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
  };
  return (
    <>
        <div className="role-container" ref={containerRef}>
        <h2 className="title">Company Roles</h2>
        <div className="card-grid">
          {result.map((r) => (
            <div key={r._id} className="role-card">
              {deleteMode && (
                <input
                  type="checkbox"
                  className="delete-checkbox"
                  onChange={() => handleCheckboxChange(r._id)}
                  style={{ marginBottom: "10px", transform: "scale(1.3)" }}
                />
              )}
              <h3 style={{textTransform:"capitalize"}}>{r.name}</h3>
            </div>
          ))}
        </div>
        <button type="submit" className="edit-btn" onClick={handleDeleteClick}>
          {deleteMode ? "Confirm Delete" : "Delete"}
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
    </>
  );
};

export default Role;
