const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config(); 

const tmdbRoutes = require("./routes/tmdb");

const app = express();
app.use(cors());
app.use("/api/tmdb", tmdbRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
