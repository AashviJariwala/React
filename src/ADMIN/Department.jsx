import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Department = () => {
  const [name, setName] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDepts, setselectedDepts] = useState([]);
  const [selectedEditDepts, setselectedEditDepts] = useState("");

  const containerRef = useRef(null);

  const token = sessionStorage.getItem("token");

  function getData() {
    axios
      .get("http://localhost:3000/admin/displayDept", {
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
        setselectedEditDepts("");
      }
      if (
        editMode &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setEditMode(false);
        setselectedDepts("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deleteMode, editMode]);

  const handleCheckboxChange = (id) => {
    setselectedDepts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleEditCheckboxChange = (id, name) => {
    console.log("edit");
    setName(name);
    setselectedEditDepts(selectedEditDepts === id ? null : id);
  };

  const handleDeleteClick = () => {
    if (!deleteMode) {
      setDeleteMode(true);
      return;
    }

    // if (selectedDepts.length === 0) {
    //   alert("Please select at least one role to delete.");
    //   return;
    // }

    axios
      .delete("http://localhost:3000/admin/deleteDept/" + selectedDepts, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
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

  const handleEditClick = () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }

    axios
      .put(
        "http://localhost:3000/admin/editDept/" + selectedEditDepts,
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
        setEditMode(false);
        setselectedEditDepts("");
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
          "http://localhost:3000/admin/insertDept",
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
    } else {
      handleEditClick();
    }
  };
  return (
    <>
      <div className="role-container center-layout" ref={containerRef}>
        <h2 className="title">Departments</h2>
        <div className="card-grid">
          {result.map((r) => (
            <div key={r._id} className="role-card">
              {deleteMode && (
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={() => handleCheckboxChange(r._id)}
                  style={{ marginBottom: "10px", transform: "scale(1.3)" }}
                />
              )}

              {editMode && (
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedEditDepts === r._id}
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
          <button
            type="submit"
            className="edit-btn"
            onClick={handleDeleteClick}
          >
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
      </div>
    </>
  );
};

export default Department;
