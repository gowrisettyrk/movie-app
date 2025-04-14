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

// Toggle wishlist status of a movie
router.patch("/wishlist/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    movie.wishlisted = !movie.wishlisted;
    await movie.save();
    res.json({ success: true, wishlisted: movie.wishlisted });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /movies/wishlist-tmdb
router.post("/wishlist-tmdb", async (req, res) => {
  try {
    const movieObj = req.body;

    // Check if the movie already exists in DB (by tmdb_id)
    const existing = await Movie.findOne({ tmdb_id: movieObj.tmdb_id });

    if (existing) {
      existing.wishlisted = true;
      await existing.save();
      return res.json({ success: true, message: "Movie wishlisted", movie: existing });
    }

    // Create new movie with fallback defaults for required fields
    const newMovie = new Movie({
      title: movieObj.title,
      poster: movieObj.poster,
      rating: movieObj.rating,
      summary: movieObj.summary,
      genre: movieObj.genre || "Unknown",
      release_date: movieObj.release_date,
      director: "Unknown",               // <-- default
      cast: [],                          // <-- default
      technicians: [],                   // <-- default
      wishlisted: true,
      tmdb_id: movieObj.tmdb_id,         // <-- custom field to identify TMDB
    });

    await newMovie.save();
    res.status(201).json({ success: true, message: "TMDB movie saved & wishlisted", movie: newMovie });
  } catch (err) {
    console.error("TMDB Wishlist Error:", err);
    res.status(500).json({ success: false, message: "TMDB Wishlist failed", error: err.message });
  }
});


module.exports = router;
