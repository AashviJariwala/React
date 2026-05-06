import { useEffect, useState } from "react";
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

const SearchByTimeSlot = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState([]);


  const token = sessionStorage.getItem("userToken");

  function getData() {
    axios
      .get("http://localhost:3000/search/showAllEmployee", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setResult(res.data.data);
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setError(err.response.data.error + "*");
      });
  }

  const handleSearch=(e)=>{
    console.log(e.target.value);
    
     axios
       .get("http://localhost:3000/search/searchByTimeslot/"+e.target.value, {
         headers: {
           Authorization: "Bearer " + token,
         },
       })
       .then((res) => {
         setEvents(res.data.data);
       })
       .catch((err) => {
         console.log(err.response?.data?.error);
       });
  }

  // Fetch events only
  useEffect(() => {
   getData()
  }, []);

  return (
    <div className="calendar-card">
      <select onChange={handleSearch}>
        <option value={0}>--SELECT--</option>
        {result.map((r,index)=>(
            <option value={r._id} key={index}>{r.name}</option>
        ))}
      </select>
    </div>
  );
};

export default SearchByTimeSlot;
