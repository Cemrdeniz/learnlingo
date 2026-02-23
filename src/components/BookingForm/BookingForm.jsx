import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import { addBooking } from "../../firebase/teacherService";
import styles from "./BookingForm.module.css";

// Validation schema using Yup
const schema = yup.object().shape({
  studentName: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  date: yup.string().required("Date is required"),
  hour: yup.string().required("Hour is required"),
});

export default function BookingForm({ teacher, onClose }) {
  // Get current logged-in user from context
  const { user } = useContext(AuthContext);

  // UI state for success/error messages
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  // React Hook Form setup with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Prevent booking if user is not logged in
      if (!user) {
        setStatus("error");
        setMessage("You must be logged in to book a lesson.");
        return;
      }

      // Send booking data to Firebase
      await addBooking(user.uid, teacher, data);

      // Show success message
      setStatus("success");
      setMessage("Trial lesson booked successfully!");

      // Reset form fields after success
      reset();

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      // Handle errors during booking
      console.error("Booking failed:", err);
      setStatus("error");
      setMessage("Booking failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {/* Form title showing selected teacher */}
      <h3 className={styles.title}>
        Book Trial Lesson with {teacher.name}
      </h3>

      {/* Success / error message display */}
      {message && (
        <div
          className={
            status === "success"
              ? styles.successBox
              : styles.errorBox
          }
        >
          {message}
        </div>
      )}

      {/* Student name input */}
      <label>
        Your Name
        <input {...register("studentName")} />
        <p className={styles.error}>{errors.studentName?.message}</p>
      </label>

      {/* Email input */}
      <label>
        Email
        <input {...register("email")} />
        <p className={styles.error}>{errors.email?.message}</p>
      </label>

      {/* Date picker */}
      <label>
        Date
        <input type="date" {...register("date")} />
        <p className={styles.error}>{errors.date?.message}</p>
      </label>

      {/* Time picker */}
      <label>
        Hour
        <input type="time" {...register("hour")} />
        <p className={styles.error}>{errors.hour?.message}</p>
      </label>

      {/* Submit button */}
      <button type="submit" className={styles.submitBtn}>
        Book Trial Lesson
      </button>
    </form>
  );
}