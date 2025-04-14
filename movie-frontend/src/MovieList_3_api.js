import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState(""); // Default search term
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_KEY = "3ddcea3d"; // Your actual API key
  const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&s=`;

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("auth");
    if (isAuthenticated !== "true") {
      navigate("/");
    }
  }, [navigate]); // ✅ Now it only checks authentication

  const fetchMovieDetails = async (imdbID) => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`
      );
      const data = await response.json();
      return data.imdbRating || "N/A"; // Return rating or "N/A"
    } catch (error) {
      console.error(`Error fetching details for ${imdbID}:`, error);
      return "N/A";
    }
  };

  const fetchMovies = async (searchTerm) => {
    try {
      setLoading(true);
      console.log("Fetching movies for:", searchTerm); // ✅ Debugging output

      const response = await fetch(
        `${API_URL}${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      console.log("API Response:", data); // ✅ Debugging output

      if (data.Response === "True") {
        // Fetch IMDb ratings for each movie
        const moviesWithRatings = await Promise.all(
          data.Search.map(async (movie) => {
            const rating = await fetchMovieDetails(movie.imdbID);
            return { ...movie, imdbRating: rating }; // ✅ Adds actual IMDb rating
          })
        );
        setMovies(moviesWithRatings);
      } else {
        console.error("OMDb API Error:", data.Error);
        alert(`Error: ${data.Error}`);
        setMovies([]);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network request failed. Check your connection or API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="movie-container">
      <div className="header">
        <h2>🎬 Movies Page</h2>
        <button
          onClick={() => {
            localStorage.removeItem("auth");
            navigate("/");
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
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />
        <button onClick={() => fetchMovies(search)} className="search-btn">
          Search
        </button>
      </div>

      {loading ? (
        <p className="loading-message">Loading movies... 🍿</p>
      ) : movies.length === 0 ? (
        <p className="no-movies">No movies found 😢</p>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="movie-card">
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="movie-poster"
              />
              <h3>{movie.Title}</h3>
              <p>⭐ {movie.imdbRating || "N/A"}/10</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieList;
