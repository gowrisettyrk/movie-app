import React from "react";

export default function Movie({ Title, Poster, imdbRating }) {
  return (
    <div className="movie-card">
      <img src={Poster} alt={Title} className="movie-poster" />
      <h3>{Title}</h3>
      <p>⭐ {imdbRating}/10</p> {/* ✅ Now shows actual IMDb rating */}
    </div>
  );
}
