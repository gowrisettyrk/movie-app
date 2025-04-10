import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddMovie.css";

export default function AddMovie() {
  const [title, setTitle] = useState("");
  const [poster, setPoster] = useState("");
  const [rating, setRating] = useState("");
  const [summary, setSummary] = useState("");
  const [cast, setCast] = useState("");
  const [genre, setGenre] = useState("");
  const [director, setDirector] = useState("");
  const [technicians, setTechnicians] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      alert("All fields are required!");
      return;
    }

    const newMovie = {
      title: title.trim(),
      poster: poster.trim(),
      rating: parseFloat(rating),
      summary: summary.trim(),
      cast: cast.split(/,\s*/),
      genre: genre.trim(),
      director: director.trim(),
      technicians: technicians.split(/,\s*/),
    };

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie),
      });

      if (!response.ok) {
        throw new Error("Failed to add movie");
      }

      alert("Movie added successfully!");
      navigate("/movies");
    } catch (error) {
      console.error("Error adding movie:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-movie-container">
      <h2>🎬 Add New Movie</h2>
      <form onSubmit={handleSubmit} className="add-movie-form">
        <input
          type="text"
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Poster URL"
          value={poster}
          onChange={(e) => setPoster(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Rating (1-10)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="10"
          step="0.1"
          required
        />
        <textarea
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Cast (comma separated)"
          value={cast}
          onChange={(e) => setCast(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Director"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Technicians (comma separated)"
          value={technicians}
          onChange={(e) => setTechnicians(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Movie"}
        </button>
      </form>
    </div>
  );
}
