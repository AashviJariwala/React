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

  const handleViewChange = (newView) => {
    setView(newView);
  };

   const [error, setError] = useState("");

  const token=sessionStorage.getItem("userToken");
  function getEvents() {
    axios
      .get("http://localhost:3000/calendar/syncFromGoogle", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log(res.data);
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
        {/* 🔥 Top Header */}
        <div className="calendar-header">
          <h2 className="calendar-title">{format(date, "MMMM yyyy")}</h2>

          <div className="calendar-controls">
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

export default Dashboard;
