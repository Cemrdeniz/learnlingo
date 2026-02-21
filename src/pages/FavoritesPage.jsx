import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import TeacherCard from "../components/TeacherCard/TeacherCard";
import { fetchFavorites } from "../firebase/teacherService";

export default function FavoritesPage() {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) return;

    const loadFavorites = async () => {
      try {
        const favs = await fetchFavorites(user.uid);
        setFavorites(favs);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };

    loadFavorites();
  }, [user]);

  if (!user) {
    return <p>You must be logged in to see your favorites.</p>;
  }

  if (favorites.length === 0) {
    return <p>No favorite teachers yet.</p>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {favorites.map((teacher) => (
        <TeacherCard key={teacher.id} teacher={teacher} />
      ))}
    </div>
  );
}
