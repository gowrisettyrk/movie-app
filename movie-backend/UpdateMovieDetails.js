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
  const updates = [
    {
      title: "Mufasa",
      summary:
        "The untold story of Mufasa’s rise to power as king of the Pride Lands.",
      cast: ["Aaron Pierre", "Seth Rogen", "Billy Eichner", "John Kani"],
      genre: "Animation, Adventure, Drama",
      director: "Barry Jenkins",
      technicians: [
        "Hans Zimmer (Music)",
        "Caleb Deschanel (Cinematography)",
        "James Chinlund (Production Design)",
      ],
    },
    {
      title: "The Dark Knight",
      summary:
        "Batman battles the Joker, a criminal mastermind causing chaos in Gotham City.",
      cast: [
        "Christian Bale",
        "Heath Ledger",
        "Aaron Eckhart",
        "Michael Caine",
      ],
      genre: "Action, Crime, Drama",
      director: "Christopher Nolan",
      technicians: [
        "Hans Zimmer (Music)",
        "Wally Pfister (Cinematography)",
        "Nathan Crowley (Production Design)",
      ],
    },
  ];

  for (const update of updates) {
    await Movie.updateOne({ title: update.title }, { $set: update });
    console.log(`✅ Updated: ${update.title}`);
  }

  mongoose.connection.close();
}

updateMovies();
