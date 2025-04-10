require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Allow JSON requests

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Import routes
const userRoutes = require("./Routes/Users");
const movieRoutes = require("./Routes/Movies");

// Use routes
app.use("/users", userRoutes);
app.use("/movies", movieRoutes);

// Default Route
app.get("/", (req, res) => res.send("🎬 Movie API Running!"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
