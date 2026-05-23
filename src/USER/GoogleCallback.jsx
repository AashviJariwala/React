import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../config";
import axios from "axios";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const msg = params.get("msg");
    const token = params.get("token");
    sessionStorage.setItem("userToken", token);

    if (msg === "User is new") navigate("/authentication");
    else {
      axios
        .get(API_URL + "/user/getIDCardUploadStatus", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          if (res.data.data == 0) navigate("/authentication");
          else navigate("/dashboard");
        })
        .catch((err) => {
          console.log(err.response.data.error);
          setError(err.response.data.error + "*");
        });
    }
  }, [location, navigate]);

  return <p></p>;
};

export default GoogleCallback;
