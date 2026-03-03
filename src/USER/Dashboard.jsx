import { useState, React } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Only if using CSS version
import enUS from "date-fns/locale/en-US";

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
  
  return (
    <div style={{ height: "90vh", padding: "20px",backgroundColor:"white",width:"70%" }}>
      <Calendar
        localizer={localizer}
        // events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        views={["month", "week", "day"]}
      />
    </div>
  );
};

export default Dashboard;
