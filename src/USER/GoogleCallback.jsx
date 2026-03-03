import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const msg = params.get("msg");
    const token = params.get("token");
    sessionStorage.setItem("userToken", token);

    if (msg === "User is new") navigate("/authentication");
    else navigate("/");
  }, [location, navigate]);

  return <p></p>;
};

export default GoogleCallback;
