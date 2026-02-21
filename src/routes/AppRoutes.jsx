import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePages/HomePage.jsx";
import TeachersPage from "../pages/TeachersPage";
import FavoritesPage from "../pages/FavoritesPage";
import ProtectedRoute from "../routes/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/teachers"
        element={
          <ProtectedRoute>
            <TeachersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
