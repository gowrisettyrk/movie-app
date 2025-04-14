import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Oops! Page Not Found 😢</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="home-link">
        🏠 Go Home
      </Link>
    </div>
  );
}
