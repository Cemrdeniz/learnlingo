import { db } from "./config";
import { ref, set, get, remove } from "firebase/database";


// ======================
// TEACHERS
// ======================

// Tüm öğretmenleri çek
export const fetchTeachers = async () => {
  try {
    const snapshot = await get(ref(db, "teachers"));

    if (snapshot.exists()) {
      const data = snapshot.val();

      return Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
    }

    return [];
  } catch (err) {
    console.error("Fetch teachers error:", err);
    return [];
  }
};


// ======================
// FILTER OPTIONS (🔥 EKLENDİ)
// ======================

export const fetchFilterOptions = async () => {
  try {
    const snapshot = await get(ref(db, "teachers"));

    if (!snapshot.exists()) return { languages: [], levels: [], prices: [] };

    const data = snapshot.val();

    const languages = new Set();
    const levels = new Set();
    const prices = new Set();

    Object.values(data).forEach((teacher) => {
      // Languages
      if (Array.isArray(teacher.languages)) {
        teacher.languages.forEach((l) => languages.add(l));
      } else if (teacher.languages) {
        languages.add(teacher.languages);
      }

      // Levels
      if (Array.isArray(teacher.levels)) {
        teacher.levels.forEach((lvl) => levels.add(lvl));
      } else if (teacher.levels) {
        levels.add(teacher.levels);
      }

      // Price
      if (teacher.price_per_hour) {
        prices.add(Number(teacher.price_per_hour));
      }
    });

    return {
      languages: Array.from(languages).sort(),
      levels: Array.from(levels).sort(),
      prices: Array.from(prices).sort((a, b) => a - b),
    };
  } catch (err) {
    console.error("Fetch filter options error:", err);
    return { languages: [], levels: [], prices: [] };
  }
};


// ======================
// FAVORITES
// ======================

// Kullanıcının favorilerini çek
export const fetchFavorites = async (userId) => {
  try {
    const snapshot = await get(ref(db, `favorites/${userId}`));

    if (snapshot.exists()) {
      const data = snapshot.val();

      return Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
    }

    return [];
  } catch (err) {
    console.error("Fetch favorites error:", err);
    return [];
  }
};


// Favorilere ekle
export const addFavorite = async (userId, teacher) => {
  try {
    const favRef = ref(db, `favorites/${userId}/${teacher.id}`);
    await set(favRef, teacher);
  } catch (err) {
    console.error("Add favorite error:", err);
  }
};


// Favorilerden çıkar
export const removeFavorite = async (userId, teacherId) => {
  try {
    const favRef = ref(db, `favorites/${userId}/${teacherId}`);
    await remove(favRef);
  } catch (err) {
    console.error("Remove favorite error:", err);
  }
};


// ======================
// BOOKINGS
// ======================

export const addBooking = async (userId, teacher, bookingData) => {
  try {
    if (!teacher.id) throw new Error("Teacher ID missing");

    const bookingRef = ref(
      db,
      `bookings/${userId}/${teacher.id}_${Date.now()}`
    );

    await set(bookingRef, {
      teacherId: teacher.id,
      teacherName: teacher.name,
      ...bookingData,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("Failed to add booking:", err);
    throw err;
  }
};