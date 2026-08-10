import axios from "axios";

const API = axios.create({
  baseURL: "https://ev-home-charging-network.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;