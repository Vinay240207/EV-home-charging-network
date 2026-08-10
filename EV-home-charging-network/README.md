# EV Home Charging Network

Connect EV drivers with nearby home charging stations.

## Features

- **Driver**: Search stations, book slots, navigate via Google Maps, pay via PhonePe/UPI
- **Owner**: Add chargers with lat/long + phone, view bookings & earnings
- **Admin**: Approve/reject chargers, view all bookings

## Setup

### 1. Backend
```bash
cd server
npm install
node createAdmin.js   # creates admin@evhome.com / Admin@123
npm run dev           # runs on http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev           # runs on http://localhost:5173
```

## Admin Credentials
- Email: admin@evhome.com
- Password: Admin@123

## Flow
1. Owner registers → Login → Add Charger (with Latitude, Longitude, Phone)
2. Admin logs in → Approves the charger
3. Driver registers → Login → Sees approved chargers → Books slot
4. In My Bookings → Book Again / Navigate / Payment buttons
