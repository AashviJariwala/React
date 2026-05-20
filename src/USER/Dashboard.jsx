import { useState, React, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import Switch from "react-switch";
import { API_URL } from "../config";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Dashboard = () => {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");
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
  // const [day, setDay] = useState("");
  // const [edate, setEdate] = useState("");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [editEvent, setEditEvent] = useState({
    title: "",
    date: "",
    start: "",
    end: "",
    description: "",
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "Octobor",
    "November",
    "December",
  ];
  const token = sessionStorage.getItem("userToken");

  const handleViewChange = (newView) => {
    setView(newView);
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
          API_URL + "/calendar/createEvent/",
          {
            title: newEvent["title"],
            date: newEvent["date"],
            start: newEvent["start"],
            end: newEvent["end"],
            description: newEvent["description"],
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
          setShowPopup(false);
          getEvents();
        })
        .catch((err) => {
          console.log(err.response.data.error);
          setError(err.response.data.error + "*");
        });
    } else {
      axios
        .put(
          API_URL +
            "/calendar/editEvent/" +
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

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(
        API_URL +
          "/calendar/editEventVisibility/" +
          selectedEvent._id +
          "/" +
          visibility,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      )
      .then(() => {
        setDetailPopup(false);
        setError("");
      })
      .catch((err) => {
        console.log(err.response?.data?.error);
        setError(err.response?.data?.error + "*");
      });
  };

  const handleInstantMeeting = (e) => {
    e.preventDefault();
    axios
      .post(
        API_URL + "/meeting/creatInstantMeetingEvent/",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      )
      .then((res) => {
        window.location.href = res.data.meetLink;
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setError(err.response.data.error + "*");
      });
  };

  function getEvents() {
    axios
      .get(API_URL + "/calendar/syncFromGoogle", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
     const safeEvents = (res.data.data || []).filter(
       (e) => e && e.start && e.end,
     );
     setEvent(safeEvents);
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setError(err.response.data.error + "*");
      });
  }

  const handleEventChange = (e) => {
    // const day = format(e.start, "EEEE");
    // const date = format(e.start, "dd MMMM yyyy");
    // setDay(day);
    // setEdate(date);
    setSelectedEvent(e);
    setDetailPopup(true);
    axios
      .get(API_URL + "/calendar/getVisibility/" + e._id, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setVisibility(res.data.data);
      });
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    const collabStatus = await checkCollabEvent();
    if (collabStatus) {
      axios
        .delete(
          `${API_URL}/calendar/deleteEvent/${selectedEvent.googleEventID}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          },
        )
        .then(() => {
          setDetailPopup(false);
          getEvents();
        })
        .catch((err) => {
          console.log(err.response.data.error);
          setError(err.response.data.error + "*");
        });
    } else {
      setShowLogoutPopup(true);
    }
  };

  async function checkCollabEvent() {
    const res = await axios.get(
      API_URL + "/calendar/checkCollabEvent/" + selectedEvent._id,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      },
    );
    return res.data.msg;
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const collabStatus = await checkCollabEvent();
    if (collabStatus) {
      const formattedDate = format(selectedEvent.start, "yyyy-MM-dd");
      const stime1 = format(selectedEvent.start, "HH:mm");
      const etime1 = format(selectedEvent.end, "HH:mm");
      setEditEvent({
        title: selectedEvent.title,
        date: formattedDate,
        start: stime1,
        end: etime1,
        description: selectedEvent.description,
      });
      setDetailPopup(false);
      setEditMode(true);
      setShowPopup(true);
    } else {
      setShowLogoutPopup(true);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <div>
      <div className="calendar-card">
        <div className="calendar-header">
          <h2 className="calendar-title">{format(date, "MMMM yyyy")}</h2>

          <div className="calendar-controls">
            <select
              value={date.getMonth()}
              onChange={(e) => {
                const newDate = new Date();
                newDate.setDate(1);
                newDate.setMonth(Number(e.target.value));
                newDate.setFullYear(date.getFullYear());
                setDate(newDate);
              }}
            >
              {months.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={date.getFullYear()}
              onChange={(e) => {
                const newDate = new Date();
                newDate.setDate(1);
                newDate.setFullYear(Number(e.target.value));
                newDate.setMonth(date.getMonth());
                setDate(newDate);
              }}
            >
              {Array.from({ length: 25 }, (_, i) => {
                const year = new Date().getFullYear() - 15 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
            <button
              className={view === "month" ? "active-btn" : ""}
              onClick={() => handleViewChange("month")}
            >
              Month
            </button>

            <button
              className={view === "week" ? "active-btn" : ""}
              onClick={() => handleViewChange("week")}
            >
              Week
            </button>

            <button
              className={view === "day" ? "active-btn" : ""}
              onClick={() => handleViewChange("day")}
            >
              Day
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="add-event-btn" onClick={() => setShowPopup(true)}>
            +
          </button>
          <button className="add-event-btn" onClick={handleInstantMeeting}>
            Start Instant Meeting
          </button>
        </div>

        <Calendar
          localizer={localizer}
          events={event
            .filter((e) => e.start && e.end)
            .map((e) => ({
              ...e,
              start: new Date(e.start),
              end: new Date(e.end),
            }))}
          events={event
            .filter((e) => e.start && e.end)
            .map((e) => ({
              ...e,
              start: new Date(e.start),
              end: new Date(e.end),
            }))}
          view={view}
          date={date}
          onView={handleViewChange}
          onNavigate={(newDate) => setDate(newDate)}
          onSelectEvent={handleEventChange}
          toolbar={false}
          selectable
          views={["month", "week", "day"]}
          style={{ height: "75vh" }}
        />
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

        {detailPopup && (
          <div className="event-view-overlay">
            <div className="event-view-popup">
              <form method="post">
                <div className="event-view-header">
                  <div className="event-actions">
                    <button
                      className="icon edit"
                      type="button"
                      onClick={handleEditSubmit}
                    >
                      ✏️
                    </button>
                    <button
                      className="icon delete"
                      type="button"
                      onClick={handleDeleteSubmit}
                    >
                      🗑️
                    </button>
                    <span
                      className="icon cancel"
                      onClick={() => setDetailPopup(false)}
                    >
                      ✖
                    </span>
                  </div>
                </div>

                <div className="event-view-body">
                  <p style={{ textTransform: "capitalize" }}>
                    🟦 &nbsp;{selectedEvent.title}
                  </p>

                  <div className="event-row">
                    <span>
                      {/*  {day},{edate} */}
                      🕒 {selectedEvent.dateTime}
                    </span>
                  </div>

                  <div className="event-row">
                    <p style={{ textTransform: "capitalize" }}>
                      {selectedEvent.description && (
                        <p>☰ &nbsp; {selectedEvent.description} </p>
                      )}
                    </p>
                  </div>

                  <div className="event-row">
                    <button className="icon edit" type="button">
                      <Switch
                        onChange={() => setVisibility(!visibility)}
                        checked={visibility}
                      />
                    </button>
                    <input
                      type="submit"
                      onClick={handleUpdate}
                      value="Ok"
                      className="ok-btn"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {showLogoutPopup && (
          <div className="overlay">
            <div className="popup">
              <h3>Only host can modify the collaborative event.</h3>

              <div className="buttons">
                <button onClick={() => setShowLogoutPopup(false)}>OK</button>
              </div>
            </div>
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Dashboard;
