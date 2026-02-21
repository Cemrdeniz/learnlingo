import { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import { addBooking } from "../../firebase/teacherService";
import styles from "./BookingForm.module.css";

const schema = yup.object().shape({
  studentName: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  date: yup.string().required("Date is required"),
  hour: yup.string().required("Hour is required"),
});

export default function BookingForm({ teacher, onClose }) {
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      if (!user) {
        alert("You must be logged in!");
        return;
      }

      await addBooking(user.uid, teacher, data);

      alert("Trial lesson booked!");
      onClose();
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h3 className={styles.title}>
        Book Trial Lesson with {teacher.name}
      </h3>

      <label>
        Your Name
        <input {...register("studentName")} />
        <p className={styles.error}>
          {errors.studentName?.message}
        </p>
      </label>

      <label>
        Email
        <input {...register("email")} />
        <p className={styles.error}>
          {errors.email?.message}
        </p>
      </label>

      <label>
        Date
        <input type="date" {...register("date")} />
        <p className={styles.error}>
          {errors.date?.message}
        </p>
      </label>

      <label>
        Hour
        <input type="time" {...register("hour")} />
        <p className={styles.error}>
          {errors.hour?.message}
        </p>
      </label>

      <button type="submit" className={styles.submitBtn}>
        Book Trial Lesson
      </button>
    </form>
  );
}