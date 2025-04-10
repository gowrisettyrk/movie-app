import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MovieList from "./components/MovieList/MovieList";
import AddMovie from "./components/AddMovie/AddMovie";
import EditMovie from "./components/EditMovie/EditMovie";
import Login from "./components/Login/Login.js";
import MovieDetails from "./components/MovieDetails/MovieDetails";

import { Container, CssBaseline } from "@mui/material";
import "./App.css";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Container>
        <Routes>
          {/* Default route should open Login Page */}
          <Route path="/" element={<Login />} />
          <Route path="/movies" element={<MovieList />} />
          <Route path="/add-movie" element={<AddMovie />} />
          {/* Redirect unknown routes to Login */}
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/edit-movie/:id" element={<EditMovie />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
