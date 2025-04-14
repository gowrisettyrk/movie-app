// MovieDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetails.css";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error("Error fetching movie:", err));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await fetch(`http://localhost:5000/movies/${id}`, {
          method: "DELETE",
        });
        navigate("/movies");
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    }
  };

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <div className="movie-details-container">
      <button className="back-btn" onClick={() => navigate("/movies")}>
        ⬅ Back
      </button>

      <h2 className="movie-details-title">{movie.title}</h2>

      <div className="movie-details-content">
        <img
          src={movie.poster}
          alt={movie.title}
          className="movie-details-poster"
        />
        <div className="movie-info">
          <p className="movie-rating">⭐ {movie.rating}/10</p>
          <p className="movie-summary">{movie.summary}</p>
          <p>
            <strong>🎭 Cast:</strong> <span>{movie.cast?.join(", ")}</span>
          </p>
          <p>
            <strong>🎬 Genre:</strong> <span>{movie.genre}</span>
          </p>
          <p>
            <strong>🎥 Director:</strong> <span>{movie.director}</span>
          </p>
          <p>
            <strong>🔧 Technicians:</strong>{" "}
            <span>{movie.technicians?.join(", ")}</span>
          </p>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              className="edit-btn"
              onClick={() => navigate(`/edit-movie/${id}`)}
            >
              ✏️ Edit
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
