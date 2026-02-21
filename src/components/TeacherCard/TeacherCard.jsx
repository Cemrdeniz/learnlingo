import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  addFavorite,
  removeFavorite,
  fetchFavorites,
} from "../../firebase/teacherService";
import Modal from "../Modal/Modal";
import BookingForm from "../BookingForm/BookingForm";
import styles from "./TeacherCard.module.css";

export default function TeacherCard({ teacher, onRefresh }) {
  const { user } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // FAVORITE CHECK
  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }

    const checkFavorite = async () => {
      try {
        const favorites = await fetchFavorites(user.uid);
        const found = favorites.some((fav) => fav.id === teacher.id);
        setIsFavorite(found);
      } catch (error) {
        console.error("Favorite check error:", error);
      }
    };

    checkFavorite();
  }, [user, teacher.id]);

  // FAVORITE TOGGLE
  const handleFavorite = async () => {
    try {
      if (!user) {
        alert("You must login first!");
        return;
      }

      if (isFavorite) {
        await removeFavorite(user.uid, teacher.id);
        setIsFavorite(false);
      } else {
        await addFavorite(user.uid, teacher);
        setIsFavorite(true);
      }

      // Parent refresh (TeachersPage)
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
    }
  };

  return (
    <>
      <div className={styles.card}>
        {/* AVATAR */}
        <div className={styles.avatarWrapper}>
          <img
            src={teacher.avatar_url || "https://i.pravatar.cc/120"}
            alt={teacher.name}
            className={styles.avatar}
          />
        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          {/* TOP ROW */}
          <div className={styles.topRow}>
            <div>
              <span className={styles.languagesLabel}>Languages</span>
              <h3>
                {teacher.name} {teacher.surname || ""}
              </h3>
            </div>

            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <img src="/book.png" alt="Online" />
                <span>Lessons online</span>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.statItem}>
                <span>Lessons done: {teacher.lessons_done || 0}</span>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.statItem}>
                <img src="/star.png" alt="Rating" />
                <span>Rating: {teacher.rating || 4.8}</span>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.statItem}>
                <span>
                  Price/1 hour: {teacher.price_per_hour || 0}$
                </span>
              </div>

              <div className={styles.divider}></div>

              {/* FAVORITE ICON */}
              <div
                onClick={handleFavorite}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={isFavorite ? "/dolukalp.png" : "/boskalp.png"}
                  alt="Favorite"
                  className={styles.heartImg}
                />
              </div>
            </div>
          </div>

          <p>
            <strong className={styles.label}>Speaks:</strong>{" "}
            {Array.isArray(teacher.languages)
              ? teacher.languages.join(", ")
              : teacher.languages}
          </p>

          <p>
            <strong className={styles.label}>Lesson Info:</strong>{" "}
            {teacher.lesson_info}
          </p>

          <p>
            <strong className={styles.label}>Conditions:</strong>{" "}
            {teacher.conditions}
          </p>

          {/* READ MORE */}
          <button
            className={styles.readMore}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show less" : "Read more"}
          </button>

          {/* EXPANDED SECTION */}
          {showMore && (
            <>
              <p className={styles.experienceText}>
                {teacher.experience}
              </p>

              {/* REVIEWS */}
              {teacher.reviews &&
                teacher.reviews.map((review, index) => (
                  <div key={index} className={styles.review}>
                    <div className={styles.reviewHeader}>
                      <img
                        src={
                          review.avatar ||
                          `https://i.pravatar.cc/40?img=${index + 20}`
                        }
                        alt={review.reviewer_name}
                      />
                      <div className={styles.reviewContent}>
                        <strong>{review.reviewer_name}</strong>
                        <div className={styles.ratingIcon}>
                          <img src="/star.png" alt="Rating" />
                          <span>
                            {review.reviewer_rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}

              {/* BOOK BUTTON */}
              <button
                type="button"
                className={styles.bookBtn}
                onClick={() => setOpenBooking(true)}
              >
                Book trial lesson
              </button>
            </>
          )}

          {/* LEVEL BADGES */}
          <div className={styles.badges}>
            {Array.isArray(teacher.levels) &&
              teacher.levels.map((lvl, i) => (
                <span key={i} className={styles.badge}>
                  {lvl}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {openBooking && (
        <Modal closeModal={() => setOpenBooking(false)}>
          <BookingForm
            teacher={teacher}
            onClose={() => setOpenBooking(false)}
          />
        </Modal>
      )}
    </>
  );
}