import React, { useEffect, useState } from "react";
import axios from "axios";

const User = () => {
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("token");

  function getData() {
    axios
      .get("http://localhost:3000/admin/displayUser", {
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

  useEffect(() => {
    getData();
  }, []);

 return (
   <div className="user-app-background">
     <div className="user-app-content">
       <div className="user-table-wrapper">
         <div className="user-table-card">
           <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
             User Records
           </h3>

           {error && <p className="error-message">{error}</p>}

           <table className="user-table">
             <thead>
               <tr>
                 <th>No.</th>
                 <th>Name</th>
                 <th>Email</th>
                 <th>ID Card</th>
               </tr>
             </thead>

             <tbody>
               {result.map((user, index) => (
                 <tr key={user._id}>
                   <td>{index + 1}</td>
                   <td>{user.name}</td>
                   <td>{user.email}</td>
                   <td>
                     <img
                       src={`http://localhost:3000/public/${user.idCard}`}
                       alt="ID Card"
                     />
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
     </div>
   </div>
 );
};

export default User;
