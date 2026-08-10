function DriverDashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial",
        background: "#f4f7fb",
      }}
    >
      <h1>🚗 EV Driver Dashboard</h1>

      <p>Welcome to the EV Home Charging Network.</p>

      <div
        style={{
          background: "white",
          padding: "25px",
          marginTop: "25px",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Find Charging Stations</h2>

        <p>
          Search and book nearby home charging stations.
        </p>

        <button
          style={{
            padding: "12px 20px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Search Stations
        </button>
      </div>
    </div>
  );
}

export default DriverDashboard;