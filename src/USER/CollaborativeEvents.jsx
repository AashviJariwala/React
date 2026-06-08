import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { getEmployees } from "./EmployeeCache";

const CollaborativeEvents = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [result, setResult] = useState([]);
  const [participantID, setParticipantID] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    start: "",
    end: "",
    description: "",
  });
  const [showPopup, setShowPopup] = useState(false);

  const token = sessionStorage.getItem("userToken");

  const handleParticipantChange = (e) => {
    const value = e.target.value;

    if (participantID.includes(value)) {
      setParticipantID(participantID.filter((id) => id !== value));
    } else {
      setParticipantID([...participantID, value]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const handleClick = (e) => {
    if (participantID.length == 0)
      setError("*Please select employees you want to collaborate with.");
    else {
      setError("");
      setShowPopup(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
      if (
        !newEvent.title ||
        !newEvent.date ||
        !newEvent.start ||
        !newEvent.end
      ) {
        setError("*Please fill out all the required fields");
        return;
      }

      const isToday =
        new Date(newEvent.date).toDateString() === new Date().toDateString();
      if (isToday && newEvent.start < new Date().toTimeString().slice(0, 5)) {
        setError("*Start time cannot be in the past");
        return;
      }
   
        setError("");
        
        axios
          .post(
            API_URL + "/calendar/createCollaborativeEvent/",
            {
              title: newEvent["title"],
              date: newEvent["date"],
              start: newEvent["start"],
              end: newEvent["end"],
              description: newEvent["description"],
              users: participantID,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          )
          .then(() => {
            setShowPopup(false);
            navigate("/dashboard");
          })
          .catch((err) => {
            console.log(err.response.data.error);
            setError(err.response.data.error + "*");
          });
      
  };
  useEffect(() => {
    getEmployees(token)
    .then((data) => setResult(data))
    .catch((err) => setError(err.response.data.error));
  }, []);

  return (
    <>
      <div className="user-section">
        {/* USER LIST */}
        <div className="user-list-container">
          {result.map((r, index) => (
            <div key={index} className="user-row">
              <input
                type="checkbox"
                value={r._id}
                onChange={handleParticipantChange}
              />
              <div className="avatar">👤</div>
              <p className="user-name">{r.name}</p>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="button-container">
          <button className="ok-btn" onClick={handleClick}>
            Add Employees
          </button>
        </div>
        {showPopup && (
          <div className="event-popup-overlay">
            <form method="post" onSubmit={handleSubmit}>
              <div className="event-popup">
                <button
                  type="button"
                  className="close-popup"
                  onClick={() => setShowPopup(false)}
                >
                  ✕
                </button>

                <h3>Add Event</h3>
                <label>
                  {" "}
                  Event Title <span className="asterisk">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleChange}
                />

                <label>
                  Date<span className="asterisk">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleChange}
                  min={format(new Date(), "yyyy-MM-dd")}
                />

                <label>
                  Start Time<span className="asterisk">*</span>
                </label>
                <input
                  type="time"
                  name="start"
                  value={newEvent.start}
                  onChange={handleChange}
                />

                <label>
                  End Time<span className="asterisk">*</span>
                </label>
                <input
                  type="time"
                  name="end"
                  value={newEvent.end}
                  onChange={handleChange}
                  min={newEvent.start}
                />

                <label>Description</label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleChange}
                ></textarea>
                {error && <div className="error-message">{error}</div>}

                <button className="save-event-btn">Save Event</button>
              </div>
            </form>
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    </>
  );
};

export default CollaborativeEvents;
