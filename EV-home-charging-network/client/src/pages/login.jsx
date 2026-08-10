import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("driver");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful!");

      if (data.user.role === "driver") {
        navigate("/driver-dashboard");
      } else if (data.user.role === "owner") {
        navigate("/owner-dashboard");
      }

    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        EV Home Charging Network
      </h1>

      <p style={{ textAlign: "center" }}>
        Connect EV drivers with nearby home charging stations
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          marginTop: "40px",
          flexWrap: "wrap",
        }}
      >

        {/* DRIVER */}
        <div style={cardStyle}>
          <h2>🚗 EV Driver</h2>

          <form onSubmit={() => {
            setRole("driver");
            handleLogin(event);
          }}>
            <input
              type="email"
              placeholder="Driver Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />

            <button
              type="submit"
              style={buttonStyle}
            >
              Login as Driver
            </button>
          </form>

          <p>
            New Driver?{" "}
            <Link to="/register">Register here</Link>
          </p>
        </div>

        {/* OWNER */}
        <div style={cardStyle}>
          <h2>⚡ Charger Owner</h2>

          <form
            onSubmit={(e) => {
              setRole("owner");
              handleLogin(e);
            }}
          >
            <input
              type="email"
              placeholder="Owner Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />

            <button
              type="submit"
              style={buttonStyle}
            >
              Login as Owner
            </button>
          </form>

          <p>
            New Owner?{" "}
            <Link to="/register">Register here</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "30px",
  width: "350px",
  borderRadius: "15px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  background: "#1976d2",
  color: "white",
  cursor: "pointer",
};

export default Login;