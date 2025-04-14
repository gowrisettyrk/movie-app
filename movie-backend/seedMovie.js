import dotenv from "dotenv";
import fetch from "node-fetch"; // Install: npm install node-fetch
dotenv.config();

const MOVIE_IDS = [597]; // Your provided TMDb IDs
const TMDB_API_URL = "https://api.themoviedb.org/3";

const fetchAndSeedMovies = async () => {
  for (const id of MOVIE_IDS) {
    try {
      // Fetch movie details
      const res = await fetch(`${TMDB_API_URL}/movie/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
        },
      });

      const data = await res.json();

      // Fetch credits (cast and crew)
      const creditsRes = await fetch(
        `${TMDB_API_URL}/movie/${id}/credits?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
          },
        }
      );
      const credits = await creditsRes.json();

      const cast = credits.cast.slice(0, 3).map((actor) => actor.name);
      const director =
        credits.crew.find((member) => member.job === "Director")?.name ||
        "Unknown";

        const technicians = credits.crew
        .filter((member) =>
          ["Producer", "Writer", "Screenplay", "Editor", "Director of Photography", "Composer"].includes(member.job)
        )
        .map((tech) => `${tech.job}: ${tech.name}`);
      

      const movie = {
        title: data.title,
        poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        rating: data.vote_average,
        summary: data.overview,
        cast: cast,
        genre: data.genres[0]?.name || "Unknown",
        director: director,
        technicians: technicians,
      };

      // Post to backend
      const backendRes = await fetch("http://localhost:5000/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movie),
      });

      const result = await backendRes.json();
      console.log(`✅ Posted: ${result.title}`);
    } catch (err) {
      console.error("❌ Error:", err.message);
    }
  }
};

fetchAndSeedMovies();
