import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/tickets");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "800px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>Welcome</h1>
      <button
        style={{ padding: "12px 24px", fontSize: "16px", cursor: "pointer" }}
        onClick={handleClick}
      >
        Go to Ticketing system
      </button>
    </div>
  );
};

export default Welcome;
