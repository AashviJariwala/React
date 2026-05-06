import { useState, React, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

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

const UserProfile = () => {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");
  const [event, setEvent] = useState([]);
  const [visibility, setVisibility] = useState(false);
  const [name, setName] = useState("");
  // const [day, setDay] = useState("");
  // const [edate, setEdate] = useState("");

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

  const loc = useLocation();
  const data = loc.state;
  const token = sessionStorage.getItem("userToken");

  const handleViewChange = (newView) => {
    setView(newView);
  };

  function getEvents() {
    axios
      .get("http://localhost:3000/search/userProfile/" + data.id, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setName(res.data.data.name);
        setEvent(res.data.data.events);
        setVisibility(res.data.data.visibility);
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setError(err.response.data.error + "*");
      });
  }

  useEffect(() => {
    getEvents();
  }, []);

  const showEvents = () => {
    return event.map((e) => ({
      ...e,
      title: e.visibility == 1 ? e.title : "Busy",
      start: new Date(e.start),
      end: new Date(e.end),
    }));
  };

  return (
    <div>
      <div className="calendar-card">
        <div className="calendar-header">
          <h2 className="calendar-title">
            {format(date, "MMMM yyyy")} | {name}'s Calendar
          </h2>

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

        <Calendar
          localizer={localizer}
          events={showEvents()}
          view={view}
          date={date}
          onView={handleViewChange}
          onNavigate={(newDate) => setDate(newDate)}
          toolbar={false}
          selectable
          views={["month", "week", "day"]}
          style={{ height: "75vh" }}
        />

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default UserProfile;
