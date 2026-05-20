import { useEffect, useState } from "react";
import axios from "axios";

const SearchByTimeSlot = () => {
  const [error, setError] = useState("");
  const [result, setResult] = useState([]); // employees
  const [participantID, setParticipantID] = useState([]);
  const [freeSlots, setFreeSlots] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    start: "",
    end: "",
    description: "",
  });

  const token = sessionStorage.getItem("userToken");

  // get all users
  function getData() {
    axios
      .get("http://localhost:3000/search/showAllEmployee", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setResult(res.data.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Error");
      });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSlotClick = (slot) => {
    const [hour, minute] = slot.split(":");

    const formattedTime = `${hour.padStart(2, "0")}:${minute}`;

    const today = new Date().toISOString().split("T")[0];

    setNewEvent({
      title: "",
      date: today,
      start: formattedTime,
      end: "",
      description: "",
    });

    setShowPopup(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:3000/calendar/createEvent/",
        {
          title: newEvent.title,
          date: newEvent.date,
          start: newEvent.start,
          end: newEvent.end,
          description: newEvent.description,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      )
      .then(() => {
        setShowPopup(false);
      })
      .catch((err) => {
        console.log(err.response?.data?.error);
      });
  };

  // checkbox select
  const handleParticipantChange = (e) => {
    const value = e.target.value;

    if (participantID.includes(value)) {
      setParticipantID(participantID.filter((id) => id !== value));
    } else {
      setParticipantID([...participantID, value]);
    }
  };

  // search free slots
  const handleSearch = () => {
    axios
      .post(
        "http://localhost:3000/search/searchByTimeslot",
        { uid: participantID },
        {
          headers: { Authorization: "Bearer " + token },
        },
      )
      .then((res) => {
        setFreeSlots(res.data.data); // <-- important
      })
      .catch((err) => {
        console.log(err.response?.data?.error);
      });
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
          <button className="ok-btn" onClick={handleSearch}>
            Find Free Slots
          </button>
        </div>

        {/* FREE SLOTS DISPLAY */}
        <div className="slots-wrapper">
          <div className="slots-card">
            <h3 className="slots-title">Available Time Slots</h3>

            {freeSlots.length === 0 ? (
              <p className="no-slots">No common free slots found</p>
            ) : (
              <div className="slots-grid">
                {freeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="slot-chip"
                    onClick={() => handleSlotClick(slot)}
                    style={{ cursor: "pointer" }}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            )}
          </div>
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
                  readOnly
                />

                <label>Start Time</label>
                <input
                  type="time"
                  name="start"
                  value={newEvent.start}
                  onChange={handleChange}
                  readOnly
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
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchByTimeSlot;
