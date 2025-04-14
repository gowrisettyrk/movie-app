const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  poster: { type: String, required: true },
  rating: { type: Number, required: true },
  summary: { type: String, required: true },
  cast: { type: [String], required: true },
  genre: { type: String, required: true },
  director: { type: String, required: true },
  technicians: { type: [String], required: true },
  wishlisted: { type: Boolean, default: false },
  tmdb_id: { type: Number, unique: true },           // added this field

});

module.exports = mongoose.model("Movie", movieSchema);
