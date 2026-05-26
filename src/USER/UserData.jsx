import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

const UserData = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const token = sessionStorage.getItem("userToken");

  useEffect(() => {
    axios
      .get(API_URL + "/user/getUserDetails", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setUserData(res.data.data);
      });
  }, []);

  const rows = [
    { icon: "ti-id-badge-2", label: "Name", value: userData?.userName },
    { icon: "ti-mail", label: "Email", value: userData?.userEmail },
  ];

  return (
    <div style={{ padding: "1.5rem" }}>
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          border: "1px solid #eee",
          overflow: "hidden",
        }}
      >
        {/* Name & Email rows */}
        {rows.map((row, i) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "16px 18px",
              borderBottom: "1px solid #eee",
            }}
          >
            <i
              className={`ti ${row.icon}`}
              style={{ fontSize: "20px", color: "#888", flexShrink: 0 }}
            />
            <div>
              <p
                style={{
                  margin: "0 0 2px 0",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                {row.label}
              </p>
              <p style={{ margin: 0, fontSize: "13px", color: "#777" }}>
                {userData ? (row.value ?? "—") : "Loading..."}
              </p>
            </div>
          </div>
        ))}

        {/* ID Card row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            padding: "16px 18px",
          }}
        >
          <i
            className="ti ti-credit-card"
            style={{
              fontSize: "20px",
              color: "#888",
              flexShrink: 0,
              marginTop: "2px",
            }}
          />
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: "0 0 14px 0",
                fontWeight: 500,
                fontSize: "14px",
                color: "#333",
              }}
            >
              ID Card
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "16px",
                background: "#fdf5ee",
                borderRadius: "10px",
                border: "1.5px dashed #d6a77a",
              }}
            >
              {userData?.userIDCard ? (
                <img
                  src={userData.userIDCard}
                  alt="ID Card"
                  style={{
                    height: "350px",
                    width: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              ) : (
                <p style={{ color: "#aaa", fontSize: "13px", margin: 0 }}>
                  {userData ? "No ID card uploaded" : "Loading..."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserData;
