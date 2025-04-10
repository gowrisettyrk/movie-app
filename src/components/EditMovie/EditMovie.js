import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditMovie.css";

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({
    title: "",
    poster: "",
    rating: "",
    summary: "",
    cast: "",
    genre: "",
    director: "",
    technicians: "",
  });

  useEffect(() => {
    fetch(`http://localhost:5000/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMovie({
          ...data,
          cast: data.cast ? data.cast.join(", ") : "",
          technicians: data.technicians ? data.technicians.join(", ") : "",
        });
      })
      .catch((err) => console.error("Error fetching movie:", err));
  }, [id]);

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedMovie = {
      ...movie,
      cast: movie.cast.split(/,\s*/),
      technicians: movie.technicians.split(/,\s*/),
    };

    try {
      const response = await fetch(`http://localhost:5000/movies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMovie),
      });

      if (!response.ok) {
        throw new Error("Failed to update movie");
      }

      alert("Movie updated successfully!");
      navigate("/movies");
    } catch (error) {
      console.error("Error updating movie:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-movie-container">
      <h2>Edit Movie</h2>
      <form onSubmit={handleSubmit} className="edit-movie-form">
        <label htmlFor="title">Movie Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={movie.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="poster">Poster URL:</label>
        <input
          type="text"
          id="poster"
          name="poster"
          value={movie.poster}
          onChange={handleChange}
          required
        />

        <label htmlFor="rating">Rating (1-10):</label>
        <input
          type="number"
          id="rating"
          name="rating"
          value={movie.rating}
          onChange={handleChange}
          min="1"
          max="10"
          step="0.1"
          required
        />

        <label htmlFor="summary">Summary:</label>
        <textarea
          id="summary"
          name="summary"
          value={movie.summary}
          onChange={handleChange}
          required
        />

        <label htmlFor="cast">Cast (comma separated):</label>
        <input
          type="text"
          id="cast"
          name="cast"
          value={movie.cast}
          onChange={handleChange}
          required
        />

        <label htmlFor="genre">Genre:</label>
        <input
          type="text"
          id="genre"
          name="genre"
          value={movie.genre}
          onChange={handleChange}
          required
        />

        <label htmlFor="director">Director:</label>
        <input
          type="text"
          id="director"
          name="director"
          value={movie.director}
          onChange={handleChange}
          required
        />

        <label htmlFor="technicians">Technicians (comma separated):</label>
        <input
          type="text"
          id="technicians"
          name="technicians"
          value={movie.technicians}
          onChange={handleChange}
          required
        />

        <button type="submit" className="update-btn" disabled={loading}>
          {loading ? "Updating..." : "Update Movie"}
        </button>
      </form>
    </div>
  );
}
