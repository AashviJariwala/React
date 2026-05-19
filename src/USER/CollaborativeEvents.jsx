import { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate}  from "react-router-dom";
import {API_URL} from "../config"

const CollaborativeEvents= () => {
  const navigate=useNavigate();
  const [error, setError] = useState("");
  const [result, setResult] = useState([]); 
  const [participantID, setParticipantID] = useState([]);
  const [freeSlots, setFreeSlots] = useState([]);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [event, setEvent] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    start: "",
    end: "",
    description: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [detailPopup, setDetailPopup] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [day, setDay] = useState("");
  const [edate, setEdate] = useState("");
  const [editEvent, setEditEvent] = useState({
    title: "",
    date: "",
    start: "",
    end: "",
    description: "",
  });
  

  const token = sessionStorage.getItem("userToken");

  function getData() {
    axios
      .get(API_URL+"/search/showAllEmployee", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setResult(res.data.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Error");
      });
  }

  const handleParticipantChange = (e) => {
    const value = e.target.value;

    if (participantID.includes(value)) {
      setParticipantID(participantID.filter((id) => id !== value));
    } else {
      setParticipantID([...participantID, value]);
    }
  };

  const handleChange = (e) => {
    if (!editMode) {
      const { name, value } = e.target;
      setNewEvent((values) => ({
        ...values,
        [name]: value,
      }));
    } else {
      const { name, value } = e.target;
      setEditEvent((values) => ({
        ...values,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editMode) {
      axios
        .post(
          API_URL+"/calendar/createCollaborativeEvent/",
          {
            title: newEvent["title"],
            date: newEvent["date"],
            start: newEvent["start"],
            end: newEvent["end"],
            description: newEvent["description"],
            users:participantID
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          },
        )
        .then((res) => {
          console.log(res.data.msg);
          setShowPopup(false);
          navigate("/dashboard");
        })
        .catch((err) => {
          console.log(err.response.data.error);
          setError(err.response.data.error + "*");
        });
    } else {
      axios
        .put(
          API_URL+"/calendar/editEvent/" +
            selectedEvent._id +
            "/" +
            selectedEvent.googleEventID,
          {
            title: editEvent["title"],
            date: editEvent["date"],
            start: editEvent["start"],
            end: editEvent["end"],
            description: editEvent["description"],
            visibility: visibility,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          },
        )
        .then((res) => {
          console.log(res.data.data);
          setEditMode(false);
          setShowPopup(false);
          getEvents();
        })
        .catch((err) => {
          console.log(err.response.data.error);
          setError(err.response.data.error + "*");
        });
    }
  };
  useEffect(() => {
    getData();
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
          <button className="ok-btn" onClick={()=>setShowPopup(true)}>
           Add Partcipants
          </button>
        </div>
        {showPopup && (
          <div className="event-popup-overlay">
            <form method="post" onSubmit={handleSubmit}>
              {!editMode ? (
                <div className="event-popup">
                  <button
                    type="button"
                    className="close-popup"
                    onClick={() => setShowPopup(false)}
                  >
                    ✕
                  </button>

                  <h3>Add Event</h3>
                  <label>Event Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newEvent.title}
                    onChange={handleChange}
                  />

                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={newEvent.date}
                    onChange={handleChange}
                  />

                  <label>Start Time</label>
                  <input
                    type="time"
                    name="start"
                    value={newEvent.start}
                    onChange={handleChange}
                  />

                  <label>End Time</label>
                  <input
                    type="time"
                    name="end"
                    value={newEvent.end}
                    onChange={handleChange}
                  />

                  <label>Description</label>
                  <textarea
                    name="description"
                    value={newEvent.description}
                    onChange={handleChange}
                  ></textarea>

                  <button className="save-event-btn">Save Event</button>
                </div>
              ) : (
                <div className="event-popup">
                  <button
                    type="button"
                    className="close-popup"
                    onClick={() => {
                      setEditMode(false);
                      setShowPopup(false);
                    }}
                  >
                    ✕
                  </button>
                  <h3>Edit Event</h3>
                  <label>Event Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editEvent.title}
                    onChange={handleChange}
                  />
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editEvent.date}
                    onChange={handleChange}
                  />
                  <label>Start Time</label>
                  <input
                    type="time"
                    name="start"
                    value={editEvent.start}
                    onChange={handleChange}
                  />
                  <label>End Time</label>
                  <input
                    type="time"
                    name="end"
                    value={editEvent.end}
                    onChange={handleChange}
                  />
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={editEvent.description}
                    onChange={handleChange}
                  ></textarea>
                  <button className="save-event-btn">Save Event</button>{" "}
                </div>
              )}
            </form>
          </div>
        )}
        {error && <div className="error-message">{error}</div>}

      </div>
    </>
  );
};

export default CollaborativeEvents;
