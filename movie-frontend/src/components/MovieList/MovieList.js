import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MovieList.css";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000/movies";
  const TMDB_BASE_URL = "http://localhost:5000/tmdb";

  useEffect(() => {
    if (activeTab === "home") {
      fetchMovies(); // Fetch MongoDB data when home tab is active
    } else {
      fetchTmdbMovies(activeTab); // Fetch TMDB data when popular, top-rated, or upcoming tab is active
    }
  }, [activeTab]);
  
  

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

  const fetchTmdbMovies = async (type) => {
    try {
      setLoading(true);
      const response = await fetch(`${TMDB_BASE_URL}/${type}`);
      console.log("Raw response:", response);
  
      if (!response.ok) throw new Error("Network response was not ok");
  
      const data = await response.json();
      console.log("Parsed data:", data);
  
      const mapped = data.map((movie) => ({
        tmdb_id: movie.id, // Make sure this is added!
        title: movie.title,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        rating: movie.vote_average,
        summary: movie.overview,
        genre: movie.genre_ids.join(", "),
        release_date: movie.release_date,
        wishlisted: false,
      }));      
      
      
  
      setMovies(mapped);
    } catch (error) {
      console.error("Error fetching TMDB movies:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const toggleWishlist = async (movieObj) => {
    if (activeTab === "home") {
      // Existing logic
      try {
        const response = await fetch(`http://localhost:5000/movies/wishlist/${movieObj._id}`, {
          method: "PATCH",
        });
        const data = await response.json();
        if (data.success) {
          setMovies((prevMovies) =>
            prevMovies.map((m) =>
              m._id === movieObj._id ? { ...m, wishlisted: data.wishlisted } : m
            )
          );
        }
      } catch (error) {
        console.error("Error updating wishlist:", error);
      }
    } else {
      // TMDB movie logic
      try {
        const response = await fetch("http://localhost:5000/movies/wishlist-tmdb", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(movieObj),
        });
        const data = await response.json();
        if (data.success) {
          setMovies((prevMovies) =>
            prevMovies.map((m) =>
              m.tmdb_id && movieObj.tmdb_id && m.tmdb_id === movieObj.tmdb_id
 ? { ...m, wishlisted: true } : m
            )
          );
        }
      } catch (err) {
        console.error("Failed to wishlist TMDB movie:", err);
      }
    }
  };
  
  

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredMovies = movies
    .filter((movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((movie) =>
      showWishlistOnly ? movie.wishlisted : true
    );
    

  return (
    <div className="movie-container">
      <div className="header">
        <h2>🎬 Movies Page</h2>
        <div className="header-actions">
          <button
            onClick={() => setShowWishlistOnly(!showWishlistOnly)}
            className="wishlist-toggle-btn"
          >
            {showWishlistOnly ? "🎞️ Show All" : "❤️ Wishlist"}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("auth");
              localStorage.removeItem("token");
              navigate("/", { replace: true });
              setTimeout(() => {
                window.location.reload();
              }, 100);
            }}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="tab-buttons">
        {["home", "popular", "top-rated", "upcoming"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
          >
            {tab.replace("-", " ").toUpperCase()}
          </button>
        ))}
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="🔍 Search Movies..."
          value={search}
          onChange={handleSearch}
          className="search-box"
        />
        {activeTab === "home" && (
          <button
            className="add-movie-btn"
            onClick={() => navigate("/add-movie")}
          >
            ➕ Add Movie
          </button>
        )}
      </div>

      {loading ? (
        <p className="loading-message">Loading movies... 🍿</p>
      ) : filteredMovies.length === 0 ? (
        <p className="no-movies">No movies found 😢</p>
      ) : (
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <div
              key={movie._id}
              className="movie-card"
              onClick={() =>
                activeTab === "home" && navigate(`/movies/${movie._id}`)
              }
              style={{ cursor: activeTab === "home" ? "pointer" : "default" }}
            >
              <div
                className="wishlist-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(movie);
                }}
                title="Add to Wishlist"
              >
                {movie.wishlisted ? "❤️" : "🤍"}
              </div>
              <img
                src={movie.poster}
                alt={movie.title}
                className="movie-poster"
              />
              <h3>{movie.title}</h3>
              <p>⭐ {movie.rating}/10</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieList;
