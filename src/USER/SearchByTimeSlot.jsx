import { useEffect, useState } from "react";
import axios from "axios";

const SearchByTimeSlot = () => {
  const [error, setError] = useState("");
  const [result, setResult] = useState([]); // employees
  const [participantID, setParticipantID] = useState([]);
  const [freeSlots, setFreeSlots] = useState([]);

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
                  <div key={index} className="slot-chip">
                    {slot}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchByTimeSlot;
