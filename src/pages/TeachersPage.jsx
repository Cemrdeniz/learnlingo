import { useEffect, useState, useContext } from "react";
import { fetchTeachers, fetchFavorites } from "../firebase/teacherService";
import { AuthContext } from "../context/AuthContext";
import Filters from "../components/Filters/Filters";
import TeacherCard from "../components/TeacherCard/TeacherCard";
import styles from "./TeachersPage.module.css";

export default function TeachersPage() {
  const { user } = useContext(AuthContext);
const [refresh, setRefresh] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [filters, setFilters] = useState({
    language: "",
    level: "",
    maxPrice: "",
    favorites: "",
  });

  const [loading, setLoading] = useState(true);

  // 🔥 Öğretmenleri + Favorileri yükle
useEffect(() => {
  const loadData = async () => {
    setLoading(true);

    try {
      const teacherData = await fetchTeachers();

      if (user) {
        const favs = await fetchFavorites(user.uid);
        const favIds = favs.map((f) => f.id);

        const updatedTeachers = teacherData.map((teacher) => ({
          ...teacher,
          isFavorite: favIds.includes(teacher.id),
        }));

        setTeachers(updatedTeachers);
      } else {
        setTeachers(teacherData);
      }
    } catch (err) {
      console.error("Error loading teachers:", err);
    }

    setLoading(false);
  };

  loadData();
}, [user, refresh]); // 🔥 refresh eklendi

  // 🔥 Filtreleme
const filteredTeachers = teachers.filter((teacher) => {

  if (filters.language &&
      !teacher.languages?.includes(filters.language))
    return false;

  if (filters.level &&
      !teacher.levels?.includes(filters.level))
    return false;

  // ⭐ PRICE = EXACT MATCH
  if (filters.price &&
      Number(teacher.price_per_hour) !== Number(filters.price))
    return false;

  if (filters.favorites === "Favorites only" &&
      !teacher.isFavorite)
    return false;

  return true;
});

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Filters onFilter={setFilters} />

        {loading ? (
          <p>Loading teachers...</p>
        ) : filteredTeachers.length === 0 ? (
          <p>No teachers found.</p>
        ) : (
          filteredTeachers.map((teacher) => (
            <TeacherCard
  key={teacher.id}
  teacher={teacher}
  onRefresh={() => setRefresh(!refresh)}
/>
          ))
        )}
      </div>
    </div>
  );
}