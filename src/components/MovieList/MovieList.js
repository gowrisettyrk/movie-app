import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MovieList.css";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000/movies"; // Backend API

  useEffect(() => {
    fetchMovies();
  }, []); // Runs only once when the component mounts

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await fetch(`http://localhost:5000/movies/${id}`, { method: "DELETE" });
        setMovies((prevMovies) =>
          prevMovies.filter((movie) => movie._id !== id)
        );
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="movie-container">
      <div className="header">
        <h2>🎬 Movies Page</h2>
        <button
          onClick={() => {
            localStorage.removeItem("auth"); // Remove auth token
            localStorage.removeItem("token"); // Remove any JWT token if stored
            navigate("/", { replace: true }); // Redirect to login page
            setTimeout(() => {
              window.location.reload(); // Force page refresh after redirect
            }, 100);
          }}
          className="logout-btn"
        >
          Logout
        </button>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="🔍 Search Movies..."
          value={search}
          onChange={handleSearch}
          className="search-box"
        />
        <button
          className="add-movie-btn"
          onClick={() => navigate("/add-movie")}
        >
          ➕ Add Movie
        </button>
      </div>

      {loading ? (
        <p className="loading-message">Loading movies... 🍿</p>
      ) : filteredMovies.length === 0 ? (
        <p className="no-movies">No movies found 😢</p>
      ) : (
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <div key={movie._id} className="movie-card">
              <img
                src={movie.poster}
                alt={movie.title}
                className="movie-poster"
              />
              <h3>{movie.title}</h3>
              <p>⭐ {movie.rating}/10</p>
              <div className="movie-actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit-movie/${movie._id}`)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(movie._id)}
                >
                  🗑️ Delete
                </button>
                <button
                  className="view-btn"
                  onClick={() => navigate(`/movies/${movie._id}`)}
                >
                  🔍 View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieList;
