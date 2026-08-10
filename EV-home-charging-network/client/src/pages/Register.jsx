import { useState } from "react";

function Register({ onBackToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "driver",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.role
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log("Register response:", data);

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "driver",
      });

      if (onBackToLogin) {
        onBackToLogin();
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          EV Home Charging Network
        </h1>

        <h2 style={styles.heading}>
          Create Account
        </h2>

        <form onSubmit={handleRegister}>

          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="driver">
              EV Driver
            </option>

            <option value="owner">
              Charger Owner
            </option>
          </select>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <button
          type="button"
          onClick={onBackToLogin}
          style={styles.backButton}
        >
          ← Back to Login
        </button>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    fontFamily: "Arial",
    boxSizing: "border-box",
  },

  card: {
    width: "400px",
    maxWidth: "100%",
    background: "white",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
  },

  title: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "10px",
  },

  heading: {
    textAlign: "center",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "15px",
  },

  button: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background: "#1976d2",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  backButton: {
    width: "100%",
    padding: "12px",
    marginTop: "12px",
    border: "1px solid #1976d2",
    borderRadius: "8px",
    background: "white",
    color: "#1976d2",
    fontSize: "15px",
    cursor: "pointer",
  },
};

export default Register;