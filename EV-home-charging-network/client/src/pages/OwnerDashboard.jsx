function OwnerDashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>⚡ Charger Owner Dashboard</h1>

      <p>Welcome to your charging station dashboard.</p>

      <div
        style={{
          background: "white",
          padding: "25px",
          marginTop: "30px",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Charging Station Management</h2>

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
          Add Charging Station
        </button>
      </div>
    </div>
  );
}

export default OwnerDashboard;