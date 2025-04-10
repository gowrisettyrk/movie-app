require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: String,
    poster: String,
    rating: Number,
    summary: String,
    cast: [String],
    genre: String,
    director: String,
    technicians: [String],
  })
);

async function updateMovies() {
  try {
    const result = await Movie.updateMany(
      {},
      {
        $set: {
          summary: "No summary available",
          cast: [],
          genre: "Unknown",
          director: "Unknown",
          technicians: [],
        },
      }
    );
    console.log(`✅ Updated ${result.modifiedCount} movies`);
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error updating movies:", error);
  }
}

updateMovies();
