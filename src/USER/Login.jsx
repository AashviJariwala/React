import React from "react";

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/login/google";
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="google-consent-text">
          <h3>Google Calendar Sync</h3>
          <p>
            By continuing, you allow this app to access your Google Calendar to
            securely sync events between Google Calendar and our platform. We
            only use this access to display, create, and update your calendar
            events. We do not sell or share your data. You may revoke access
            anytime from your Google account settings.
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
      </div>
    </div>
  );
};

export default Login;
