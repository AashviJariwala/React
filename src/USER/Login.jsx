import React, { useEffect, useState } from "react";
import { API_URL } from "../config";

const Login = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err === "calendar_permission_denied") {
      console.log(err);
      setError("calendar_permission_denied");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);
  console.log("API", API_URL);
  const handleGoogleLogin = () => {
    window.location.href = API_URL + "/login/google";
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {console.log(error)}
        {/* ✅ Error Banner */}
        {error === "calendar_permission_denied" && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <div className="error-text">
              <button className="error-close" onClick={() => setError(null)}>
                ✕
              </button>
              <strong>Calendar access is required</strong>
              <p>
                Please check the <strong>"Google Calendar"</strong> checkbox on
                the next screen. Without it, we can't sync your events.
              </p>
            </div>
          </div>
        )}
        {!error && (
          <>
            <div className="google-consent-text">
              <h3>Google Calendar Sync</h3>
              <p>
                By continuing, you allow this app to access your Google Calendar
                to securely sync events between Google Calendar and our
                platform. We only use this access to display, create, and update
                your calendar events. We do not sell or share your data. You may
                revoke access anytime from your Google account settings.
              </p>
            </div>

            <button className="google-btn" onClick={handleGoogleLogin}>
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="google-icon"
              />
              Sign in with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
