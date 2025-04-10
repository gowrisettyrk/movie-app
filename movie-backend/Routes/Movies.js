const express = require("express");
const Movie = require("../Models/Movie");

const router = express.Router();

// Get all movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get a movie by ID
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new movie
router.post("/", async (req, res) => {
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

// Update a movie
router.put("/:id", async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMovie)
      return res.status(404).json({ error: "Movie not found" });
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a movie
router.delete("/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie)
      return res.status(404).json({ error: "Movie not found" });
    res.json({ message: "Movie deleted!" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
