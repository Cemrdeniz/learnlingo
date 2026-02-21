import { useEffect } from "react";
import styles from "./Modal.module.css";

export default function Modal({ children, closeModal }) {

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  return (
    <div className={styles.backdrop} onClick={closeModal}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={closeModal}
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}