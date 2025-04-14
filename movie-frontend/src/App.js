import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import MovieList from "./components/MovieList/MovieList";
import AddMovie from "./components/AddMovie/AddMovie";
import EditMovie from "./components/EditMovie/EditMovie";
import Login from "./components/Login/Login.js";
import MovieDetails from "./components/MovieDetails/MovieDetails";
import Register from "./components/Register/Register";
import NotFound from "./components/NotFound/NotFound";

import { Container, CssBaseline } from "@mui/material";
import "./App.css";
import '@fontsource/orbitron'; // Automatically pulls from Google Fonts
import '@fontsource/cinzel';
import '@fontsource/lobster';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Container>
        <Routes>
          {/* Default route should open Login Page */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movies" element={<MovieList />} />
          <Route path="/add-movie" element={<AddMovie />} />
          {/* Redirect unknown routes to Login */}
          <Route path="*" element={<NotFound />} />
          <Route path="/edit-movie/:id" element={<EditMovie />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
