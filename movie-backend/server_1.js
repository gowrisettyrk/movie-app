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

// Movie Schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  poster: { type: String, required: true },
  rating: { type: Number, required: true },
  summary: { type: String, required: true },
  cast: { type: [String], required: true },
  genre: { type: String, required: true },
  director: { type: String, required: true },
  technicians: { type: [String], required: true },
});

const Movie = mongoose.model("Movie", movieSchema);

// Routes
app.get("/", (req, res) => res.send("🎬 Movie API Running!"));

// 🔹 Get All Movies
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Get Movie by ID
app.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Add a New Movie
app.post("/movies", async (req, res) => {
  try {
    const {
      title,
      poster,
      rating,
      summary,
      cast,
      genre,
      director,
      technicians,
    } = req.body;
    if (
      !title ||
      !poster ||
      !rating ||
      !summary ||
      !cast ||
      !genre ||
      !director ||
      !technicians
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newMovie = new Movie({
      title,
      poster,
      rating,
      summary,
      cast,
      genre,
      director,
      technicians,
    });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Update a Movie
app.put("/movies/:id", async (req, res) => {
  try {
    const {
      title,
      poster,
      rating,
      summary,
      cast,
      genre,
      director,
      technicians,
    } = req.body;
    if (
      !title ||
      !poster ||
      !rating ||
      !summary ||
      !cast ||
      !genre ||
      !director ||
      !technicians
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Delete a Movie
app.delete("/movies/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json({ message: "Movie deleted!" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
