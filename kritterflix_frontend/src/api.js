import axios from "axios";

const API = axios.create({
  baseURL: "https://kritterflix-backend-1.onrender.com/api/tmdb",
});

export default API;
