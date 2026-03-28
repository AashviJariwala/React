import { useState, React, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

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
    const { name, value } = e.target;
    setNewEvent((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3000/calendar/createEvent/",
        {
          title: newEvent["title"],
          date: newEvent["date"],
          start: newEvent["start"],
          end: newEvent["end"],
          description: newEvent["description"],
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        console.log(res.data.data);
        setShowPopup(false)
        getEvents()
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setError(err.response.data.error + "*");
      });
  };
  
  function getEvents() {
    axios
      .get("http://localhost:3000/calendar/syncFromGoogle", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setEvent(res.data.data);
        setEvent(res.data.data);
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setError(err.response.data.error + "*");
      });
  }

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
        <button className="add-event-btn" onClick={() => setShowPopup(true)}>
          +
        </button>

        <Calendar
          localizer={localizer}
          events={event.map((e) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
          }))}
          view={view}
          date={date}
          onView={handleViewChange}
          onNavigate={(newDate) => setDate(newDate)}
          toolbar={false}
          selectable
          views={["month", "week", "day"]}
          style={{ height: "75vh" }}
        />
        {showPopup && (
          <div className="event-popup-overlay">
            <form method="post" onSubmit={handleSubmit}>
              <div className="event-popup">
                <button
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
            </form>
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Dashboard;
