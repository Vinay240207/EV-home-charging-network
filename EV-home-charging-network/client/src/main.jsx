import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const API = "http://localhost:5000/api";

const SLOTS = [
  "08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "05:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM",
];

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [regRole, setRegRole] = useState("driver");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [chargers, setChargers] = useState([]);
  const [myChargers, setMyChargers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [allChargers, setAllChargers] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedCharger, setSelectedCharger] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");

  const [paymentBooking, setPaymentBooking] = useState(null);
  const [payAmount, setPayAmount] = useState("");

  const [cName, setCName] = useState("");
  const [cLocation, setCLocation] = useState("");
  const [cLat, setCLat] = useState("");
  const [cLng, setCLng] = useState("");
  const [cPrice, setCPrice] = useState("");
  const [cType, setCType] = useState("AC Charger");
  const [cPower, setCPower] = useState("7.4 kW");
  const [cPhone, setCPhone] = useState("");

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  useEffect(() => {
    if (user && token) {
      const role = user.role;
      if (role === "driver") setPage("driver");
      else if (role === "owner") setPage("owner");
      else if (role === "admin") setPage("admin");
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    if (page === "driver" || page === "details" || page === "booking") {
      fetchChargers();
    }
    if (page === "bookings") fetchMyBookings();
    if (page === "owner" || page === "ownerBookings" || page === "earnings") {
      fetchMyChargers();
      fetchOwnerBookings();
    }
    if (page === "admin") {
      fetchAllChargers();
      fetchAllBookings();
    }
  }, [page, token]);

  const fetchChargers = async () => {
    try {
      const r = await fetch(`${API}/chargers`);
      const d = await r.json();
      if (r.ok) setChargers(d);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMyChargers = async () => {
    try {
      const r = await fetch(`${API}/chargers/my`, { headers: authHeaders() });
      const d = await r.json();
      if (r.ok) setMyChargers(d);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const r = await fetch(`${API}/bookings/my`, { headers: authHeaders() });
      const d = await r.json();
      if (r.ok) setBookings(d);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOwnerBookings = async () => {
    try {
      const r = await fetch(`${API}/bookings/owner`, { headers: authHeaders() });
      const d = await r.json();
      if (r.ok) setBookings(d);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAllChargers = async () => {
    try {
      const r = await fetch(`${API}/chargers/all`, { headers: authHeaders() });
      const d = await r.json();
      if (r.ok) setAllChargers(d);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAllBookings = async () => {
    try {
      const r = await fetch(`${API}/bookings/all`, { headers: authHeaders() });
      const d = await r.json();
      if (r.ok) setAllBookings(d);
    } catch (e) {
      console.error(e);
    }
  };

  const login = async (e, role) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const d = await r.json();
      if (!r.ok) {
        alert(d.message || "Login failed");
        return;
      }
      localStorage.setItem("token", d.token);
      localStorage.setItem("user", JSON.stringify(d.user));
      setToken(d.token);
      setUser(d.user);
      setEmail("");
      setPassword("");
      setPage(role === "driver" ? "driver" : role === "owner" ? "owner" : "admin");
    } catch {
      alert("Server connection failed. Make sure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
          role: "admin",
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        alert(d.message || "Invalid admin credentials");
        return;
      }
      localStorage.setItem("token", d.token);
      localStorage.setItem("user", JSON.stringify(d.user));
      setToken(d.token);
      setUser(d.user);
      setAdminEmail("");
      setAdminPassword("");
      setPage("admin");
    } catch {
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: regEmail,
          password: regPassword,
          phone,
          role: regRole,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        alert(d.message || "Registration failed");
        return;
      }
      alert("Registration successful! Please login.");
      setName("");
      setRegEmail("");
      setRegPassword("");
      setPhone("");
      setPage("login");
    } catch {
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setPage("login");
  };

  const addCharger = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(`${API}/chargers`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          name: cName,
          location: cLocation,
          latitude: Number(cLat),
          longitude: Number(cLng),
          price: Number(cPrice),
          type: cType,
          power: cPower,
          ownerPhone: cPhone,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        alert(d.message || "Failed to add charger");
        return;
      }
      alert("Charger submitted! Waiting for admin approval.");
      setCName("");
      setCLocation("");
      setCLat("");
      setCLng("");
      setCPrice("");
      setCPhone("");
      setPage("owner");
    } catch {
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const approveCharger = async (id, status) => {
    try {
      const r = await fetch(`${API}/chargers/${id}/status`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      const d = await r.json();
      if (!r.ok) {
        alert(d.message);
        return;
      }
      fetchAllChargers();
    } catch {
      alert("Failed to update status");
    }
  };

  const confirmBooking = async () => {
    if (!date || !slot) {
      alert("Please select date and time slot");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(`${API}/bookings`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          chargerId: selectedCharger._id,
          date,
          slot,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        alert(d.message || "Booking failed");
        return;
      }
      alert("Booking Confirmed Successfully!");
      setDate("");
      setSlot("");
      setPage("bookings");
    } catch {
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      const r = await fetch(`${API}/bookings/${id}/cancel`, {
        method: "PUT",
        headers: authHeaders(),
      });
      const d = await r.json();
      if (!r.ok) {
        alert(d.message);
        return;
      }
      fetchMyBookings();
    } catch {
      alert("Failed to cancel");
    }
  };

  const navigateToCharger = (charger) => {
    if (!charger?.latitude || !charger?.longitude) {
      alert("Location coordinates not available for this charger");
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${charger.latitude},${charger.longitude}`;
    window.open(url, "_blank");
  };

  const openPayment = (booking) => {
    setPaymentBooking(booking);
    setPayAmount(booking.amount || booking.charger?.price * 10 || 100);
  };

  const payViaPhonePe = async () => {
    if (!paymentBooking) return;
    const phoneNum = paymentBooking.charger?.ownerPhone;
    const amount = payAmount || paymentBooking.amount;

    try {
      await fetch(`${API}/bookings/${paymentBooking._id}/pay`, {
        method: "PUT",
        headers: authHeaders(),
      });
    } catch (e) {
      console.error(e);
    }

    const upiUrl = `upi://pay?pa=${phoneNum}@ybl&pn=${encodeURIComponent(
      paymentBooking.charger?.name || "EV Charger"
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent("EV Charging Payment")}`;

    const phonePeUrl = `phonepe://pay?pa=${phoneNum}@ybl&pn=${encodeURIComponent(
      paymentBooking.charger?.name || "EV Charger"
    )}&am=${amount}&cu=INR`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = phonePeUrl;
      setTimeout(() => {
        window.location.href = upiUrl;
      }, 1500);
    } else {
      alert(
        `Payment of Rs.${amount} to ${phoneNum}\n\nOn mobile, PhonePe / UPI will open automatically.\n\nYou can also send money via UPI to: ${phoneNum}@ybl`
      );
      window.open("https://www.phonepe.com/", "_blank");
    }

    setPaymentBooking(null);
    fetchMyBookings();
  };

  const filtered = chargers.filter((s) =>
    (s.name + s.location + s.type).toLowerCase().includes(search.toLowerCase())
  );

  const Header = ({ title }) => (
    <div className="dash-header">
      <h2>⚡ {title}</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
          {user?.name || user?.email}
        </span>
        <button className="btn btn-danger btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );

  if (page === "register") {
    return (
      <div className="auth-page">
        <div className="auth-header">
          <h1>⚡ EV Home Charging</h1>
          <p>Create your account</p>
        </div>
        <div className="auth-card">
          <h2>📝 Register</h2>
          <form onSubmit={register}>
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-input" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-input" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required minLength={6} />
            </div>
            <div className="form-group">
              <label>I am a</label>
              <select className="form-input" value={regRole} onChange={(e) => setRegRole(e.target.value)}>
                <option value="driver">🚗 EV Driver</option>
                <option value="owner">⚡ Charger Owner</option>
              </select>
            </div>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
          <button className="link-btn" onClick={() => setPage("login")}>← Back to Login</button>
        </div>
      </div>
    );
  }

  if (page === "login" || !user) {
    return (
      <div className="auth-page">
        <div className="auth-header">
          <h1>⚡ EV Home Charging Network</h1>
          <p>Connect EV drivers with nearby home charging stations</p>
        </div>
        <div className="auth-cards">
          <div className="auth-card">
            <h2>🚗 EV Driver</h2>
            <form onSubmit={(e) => login(e, "driver")}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Logging in..." : "Login as Driver"}
              </button>
            </form>
            <button className="link-btn" onClick={() => setPage("register")}>New Driver? Register here</button>
          </div>

          <div className="auth-card">
            <h2>⚡ Charger Owner</h2>
            <form onSubmit={(e) => login(e, "owner")}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Logging in..." : "Login as Owner"}
              </button>
            </form>
            <button className="link-btn" onClick={() => setPage("register")}>New Owner? Register here</button>
          </div>

          <div className="auth-card">
            <h2>🛡️ Admin</h2>
            <form onSubmit={adminLogin}>
              <div className="form-group">
                <label>Admin Email</label>
                <input type="email" className="form-input" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-input" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required />
              </div>
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Logging in..." : "Login as Admin"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (page === "driver") {
    return (
      <div className="dashboard">
        <Header title="Driver Dashboard" />
        <div className="dash-content">
          <div className="welcome">
            <h1>Welcome, {user?.name || "Driver"} 👋</h1>
            <p>Find and book nearby home charging stations</p>
          </div>
          <div className="nav-pills">
            <button className="nav-pill active" onClick={() => setPage("driver")}>🏠 Home</button>
            <button className="nav-pill" onClick={() => setPage("bookings")}>📅 My Bookings</button>
          </div>
          <div className="search-box">
            <span className="icon">🔍</span>
            <input placeholder="Search station, location or type..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🔌</div>
              <h3>No charging stations found</h3>
              <p>Try a different search or check back later. Owners need to add chargers and admin must approve them.</p>
            </div>
          ) : (
            <div className="grid">
              {filtered.map((s) => (
                <div className="station-card" key={s._id}>
                  <h3>⚡ {s.name}</h3>
                  <div className="station-meta">
                    <span>📍 {s.location}</span>
                    <span>💰 ₹{s.price}/kWh</span>
                    <span>⭐ {s.rating || 4.5}</span>
                    <span>🔌 {s.type} • {s.power}</span>
                    <span><span className="badge badge-success">Available</span></span>
                  </div>
                  <div className="card-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => { setSelectedCharger(s); setPage("details"); }}>View Details</button>
                    <button className="btn btn-success btn-sm" onClick={() => { setSelectedCharger(s); setDate(""); setSlot(""); setPage("booking"); }}>Book Slot</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (page === "details" && selectedCharger) {
    const s = selectedCharger;
    return (
      <div className="dashboard">
        <Header title="Station Details" />
        <div className="dash-content">
          <div className="detail-panel">
            <h1>⚡ {s.name}</h1>
            <div className="detail-row">📍 {s.location}</div>
            <div className="detail-row">💰 ₹{s.price}/kWh</div>
            <div className="detail-row">⭐ {s.rating || 4.5}/5</div>
            <div className="detail-row">🔌 {s.type}</div>
            <div className="detail-row">⚙️ {s.power}</div>
            <div className="detail-row">📌 Lat: {s.latitude}, Lng: {s.longitude}</div>
            <div className="detail-row"><span className="badge badge-success">Available</span></div>
            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn-success" onClick={() => { setDate(""); setSlot(""); setPage("booking"); }}>Book This Charger</button>
              <button className="btn btn-secondary" onClick={() => navigateToCharger(s)}>🗺️ Navigate</button>
              <button className="btn btn-outline" onClick={() => setPage("driver")}>← Back</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === "booking" && selectedCharger) {
    const s = selectedCharger;
    return (
      <div className="dashboard">
        <Header title="Book Charging Slot" />
        <div className="dash-content">
          <div className="detail-panel">
            <h1>⚡ {s.name}</h1>
            <p style={{ color: "#64748b", marginBottom: 20 }}>📍 {s.location} • ₹{s.price}/kWh</p>
            <div className="form-group">
              <label>Select Date</label>
              <input type="date" className="form-input" min={new Date().toISOString().split("T")[0]} value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#64748b" }}>Select Time Slot</label>
            <div className="slot-grid">
              {SLOTS.map((x) => (
                <button key={x} className={`slot-btn ${slot === x ? "selected" : ""}`} onClick={() => setSlot(x)}>{x}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
              <button className="btn btn-success" onClick={confirmBooking} disabled={loading}>
                {loading ? "Booking..." : "✅ Confirm Booking"}
              </button>
              <button className="btn btn-outline" onClick={() => setPage("driver")}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === "bookings") {
    return (
      <div className="dashboard">
        <Header title="My Bookings" />
        <div className="dash-content">
          <div className="nav-pills">
            <button className="nav-pill" onClick={() => setPage("driver")}>← Back to Home</button>
          </div>
          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📅</div>
              <h3>No bookings yet</h3>
              <p>Book a charger to see your bookings here</p>
            </div>
          ) : (
            bookings.map((b) => (
              <div className="booking-card" key={b._id}>
                <h3>⚡ {b.charger?.name || "Charger"}</h3>
                <div className="booking-info">
                  <span>📍 {b.charger?.location}</span>
                  <span>📅 {b.date}</span>
                  <span>⏰ {b.slot}</span>
                  <span>💰 ₹{b.amount || b.charger?.price}/session</span>
                  <span>
                    Status:{" "}
                    <span className={`badge ${b.status === "Confirmed" ? "badge-success" : b.status === "Cancelled" ? "badge-danger" : "badge-info"}`}>
                      {b.status}
                    </span>
                  </span>
                  <span>
                    Payment:{" "}
                    <span className={`badge ${b.paymentStatus === "Paid" ? "badge-success" : "badge-warning"}`}>
                      {b.paymentStatus || "Pending"}
                    </span>
                  </span>
                </div>
                {b.status === "Confirmed" && (
                  <div className="card-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => { setSelectedCharger(b.charger); setDate(""); setSlot(""); setPage("booking"); }}>
                      🔄 Book Again
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigateToCharger(b.charger)}>
                      🗺️ Navigate
                    </button>
                    <button className="btn btn-sm" style={{ background: "linear-gradient(135deg,#5f259f,#7c3aed)", color: "white" }} onClick={() => openPayment(b)}>
                      💳 Payment
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => cancelBooking(b._id)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {paymentBooking && (
          <div className="modal-overlay" onClick={() => setPaymentBooking(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>💳 Pay with PhonePe</h2>
              <p>Pay for charging at <strong>{paymentBooking.charger?.name}</strong></p>
              <div className="upi-info">
                <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: 4 }}>Send money to Owner</div>
                <div className="phone">{paymentBooking.charger?.ownerPhone}</div>
                <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 4 }}>UPI: {paymentBooking.charger?.ownerPhone}@ybl</div>
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input type="number" className="form-input" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} min="1" />
              </div>
              <button className="phonepe-btn" onClick={payViaPhonePe}>
                📱 Pay ₹{payAmount} via PhonePe / UPI
              </button>
              <button className="btn btn-outline" style={{ width: "100%" }} onClick={() => setPaymentBooking(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (page === "addCharger") {
    return (
      <div className="dashboard">
        <Header title="Register Charger" />
        <div className="dash-content">
          <div className="detail-panel">
            <h1>🔌 Add Home Charging Station</h1>
            <p style={{ color: "#64748b", marginBottom: 20 }}>
              Enter accurate location coordinates so drivers can navigate to you
            </p>
            <form onSubmit={addCharger}>
              <div className="form-group">
                <label>Charger Name *</label>
                <input className="form-input" value={cName} onChange={(e) => setCName(e.target.value)} required placeholder="e.g. Green Charge Home" />
              </div>
              <div className="form-group">
                <label>Location / Address *</label>
                <input className="form-input" value={cLocation} onChange={(e) => setCLocation(e.target.value)} required placeholder="e.g. Madhapur, Hyderabad" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label>Latitude *</label>
                  <input type="number" step="any" className="form-input" value={cLat} onChange={(e) => setCLat(e.target.value)} required placeholder="17.4485" />
                </div>
                <div className="form-group">
                  <label>Longitude *</label>
                  <input type="number" step="any" className="form-input" value={cLng} onChange={(e) => setCLng(e.target.value)} required placeholder="78.3908" />
                </div>
              </div>
              <div className="form-group">
                <label>Owner Phone (for payments) *</label>
                <input type="tel" className="form-input" value={cPhone} onChange={(e) => setCPhone(e.target.value)} required placeholder="9876543210" />
              </div>
              <div className="form-group">
                <label>Price per kWh (₹) *</label>
                <input type="number" className="form-input" value={cPrice} onChange={(e) => setCPrice(e.target.value)} required min="1" placeholder="12" />
              </div>
              <div className="form-group">
                <label>Charger Type</label>
                <select className="form-input" value={cType} onChange={(e) => setCType(e.target.value)}>
                  <option>AC Charger</option>
                  <option>Fast Charger</option>
                  <option>DC Fast Charger</option>
                </select>
              </div>
              <div className="form-group">
                <label>Power</label>
                <select className="form-input" value={cPower} onChange={(e) => setCPower(e.target.value)}>
                  <option>3.3 kW</option>
                  <option>7.4 kW</option>
                  <option>11 kW</option>
                  <option>22 kW</option>
                  <option>50 kW</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Charger"}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setPage("owner")}>← Back</button>
              </div>
            </form>
            <p style={{ marginTop: 16, fontSize: "0.8rem", color: "#94a3b8" }}>
              Tip: Open Google Maps → long press your location → copy coordinates
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (page === "owner") {
    const earnings = bookings
      .filter((b) => b.status === "Confirmed" && b.paymentStatus === "Paid")
      .reduce((sum, b) => sum + (b.amount || 0), 0);

    return (
      <div className="dashboard">
        <Header title="Owner Dashboard" />
        <div className="dash-content">
          <div className="welcome">
            <h1>Welcome, {user?.name || "Owner"} 👋</h1>
            <p>Manage your chargers, bookings and earnings</p>
          </div>
          <div className="nav-pills">
            <button className="nav-pill active" onClick={() => setPage("owner")}>🏠 Home</button>
            <button className="nav-pill" onClick={() => setPage("addCharger")}>➕ Add Charger</button>
            <button className="nav-pill" onClick={() => setPage("ownerBookings")}>📅 Bookings</button>
            <button className="nav-pill" onClick={() => setPage("earnings")}>💰 Earnings</button>
          </div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="icon">🔌</div>
              <h3>Chargers</h3>
              <div className="value">{myChargers.length}</div>
            </div>
            <div className="stat-card">
              <div className="icon">📅</div>
              <h3>Bookings</h3>
              <div className="value">{bookings.length}</div>
            </div>
            <div className="stat-card">
              <div className="icon">💰</div>
              <h3>Earnings</h3>
              <div className="value">₹{earnings}</div>
            </div>
          </div>
          <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Your Chargers</h3>
          {myChargers.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🔌</div>
              <h3>No chargers yet</h3>
              <p>Add your first home charging station</p>
              <button className="btn btn-primary" style={{ marginTop: 16, width: "auto" }} onClick={() => setPage("addCharger")}>
                ➕ Add Charger
              </button>
            </div>
          ) : (
            myChargers.map((c) => (
              <div className="booking-card" key={c._id}>
                <h3>⚡ {c.name}</h3>
                <div className="booking-info">
                  <span>📍 {c.location}</span>
                  <span>💰 ₹{c.price}/kWh</span>
                  <span>🔌 {c.type}</span>
                  <span>📌 {c.latitude}, {c.longitude}</span>
                  <span>📞 {c.ownerPhone}</span>
                  <span>
                    Status:{" "}
                    <span className={`badge ${c.status === "Approved" ? "badge-success" : c.status === "Rejected" ? "badge-danger" : "badge-warning"}`}>
                      {c.status}
                    </span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (page === "ownerBookings") {
    return (
      <div className="dashboard">
        <Header title="Booking Management" />
        <div className="dash-content">
          <div className="nav-pills">
            <button className="nav-pill" onClick={() => setPage("owner")}>← Back</button>
          </div>
          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📅</div>
              <h3>No bookings yet</h3>
            </div>
          ) : (
            bookings.map((b) => (
              <div className="booking-card" key={b._id}>
                <h3>⚡ {b.charger?.name}</h3>
                <div className="booking-info">
                  <span>👤 {b.driver?.name || b.driver?.email}</span>
                  <span>📞 {b.driver?.phone}</span>
                  <span>📅 {b.date}</span>
                  <span>⏰ {b.slot}</span>
                  <span>💰 ₹{b.amount}</span>
                  <span>
                    Status:{" "}
                    <span className={`badge ${b.status === "Confirmed" ? "badge-success" : "badge-danger"}`}>{b.status}</span>
                  </span>
                  <span>
                    Payment:{" "}
                    <span className={`badge ${b.paymentStatus === "Paid" ? "badge-success" : "badge-warning"}`}>{b.paymentStatus}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (page === "earnings") {
    const paid = bookings.filter((b) => b.status === "Confirmed" && b.paymentStatus === "Paid");
    const total = paid.reduce((s, b) => s + (b.amount || 0), 0);
    return (
      <div className="dashboard">
        <Header title="Earnings" />
        <div className="dash-content">
          <div className="detail-panel" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: "#10b981" }}>₹{total}</div>
            <h2 style={{ marginBottom: 8 }}>Total Earnings</h2>
            <p style={{ color: "#64748b" }}>From {paid.length} paid booking{paid.length !== 1 ? "s" : ""}</p>
            <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => setPage("owner")}>← Back</button>
          </div>
        </div>
      </div>
    );
  }

  if (page === "admin") {
    return (
      <div className="dashboard">
        <Header title="Admin Control Panel" />
        <div className="dash-content">
          <div className="welcome">
            <h1>Admin Dashboard 🛡️</h1>
            <p>Manage chargers and monitor bookings</p>
          </div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="icon">⚡</div>
              <h3>Total Chargers</h3>
              <div className="value">{allChargers.length}</div>
            </div>
            <div className="stat-card">
              <div className="icon">📅</div>
              <h3>Total Bookings</h3>
              <div className="value">{allBookings.length}</div>
            </div>
            <div className="stat-card">
              <div className="icon">⏳</div>
              <h3>Pending</h3>
              <div className="value">{allChargers.filter((c) => c.status === "Pending Approval").length}</div>
            </div>
          </div>

          <h3 style={{ margin: "24px 0 16px", fontWeight: 700 }}>Charger Approvals</h3>
          {allChargers.length === 0 ? (
            <div className="empty-state"><h3>No charger registrations</h3></div>
          ) : (
            allChargers.map((c) => (
              <div className="booking-card" key={c._id}>
                <h3>⚡ {c.name}</h3>
                <div className="booking-info">
                  <span>📍 {c.location}</span>
                  <span>💰 ₹{c.price}/kWh</span>
                  <span>🔌 {c.type}</span>
                  <span>📌 {c.latitude}, {c.longitude}</span>
                  <span>📞 {c.ownerPhone}</span>
                  <span>👤 {c.owner?.name || c.owner?.email}</span>
                  <span>
                    Status:{" "}
                    <span className={`badge ${c.status === "Approved" ? "badge-success" : c.status === "Rejected" ? "badge-danger" : "badge-warning"}`}>
                      {c.status}
                    </span>
                  </span>
                </div>
                {c.status === "Pending Approval" && (
                  <div className="card-actions">
                    <button className="btn btn-success btn-sm" onClick={() => approveCharger(c._id, "Approved")}>✅ Approve</button>
                    <button className="btn btn-danger btn-sm" onClick={() => approveCharger(c._id, "Rejected")}>❌ Reject</button>
                  </div>
                )}
              </div>
            ))
          )}

          <h3 style={{ margin: "32px 0 16px", fontWeight: 700 }}>All Bookings</h3>
          {allBookings.length === 0 ? (
            <div className="empty-state"><h3>No bookings</h3></div>
          ) : (
            allBookings.map((b) => (
              <div className="booking-card" key={b._id}>
                <div className="booking-info">
                  <span><strong>{b.charger?.name}</strong></span>
                  <span>{b.date}</span>
                  <span>{b.slot}</span>
                  <span>{b.driver?.name}</span>
                  <span>
                    <span className={`badge ${b.status === "Confirmed" ? "badge-success" : "badge-danger"}`}>{b.status}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
