import { useState, React, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Only if using CSS version
import enUS from "date-fns/locale/en-US";
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
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("userToken");
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
    <div
      style={{
        height: "90vh",
        padding: "20px",
        backgroundColor: "white",
        width: "70%",
      }}
    >
      <Calendar
        localizer={localizer}
        // events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        views={["month", "week", "day"]}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Dashboard;
