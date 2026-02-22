import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utils/validationSchemas";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

export default function LoginForm({ onClose }) {
  const [firebaseError, setFirebaseError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      setFirebaseError("");
      await signInWithEmailAndPassword(auth, data.email, data.password);
      onClose();
      navigate("/teachers");
    } catch (error) {
      
      switch (error.code) {
        case "auth/user-not-found":
          setFirebaseError("Hesap bulunamadı. Lütfen kayıt olun.");
          break;
        case "auth/wrong-password":
          setFirebaseError("Şifre yanlış. Lütfen tekrar deneyin.");
          break;
        case "auth/too-many-requests":
          setFirebaseError("Çok fazla deneme. Birkaç dakika sonra tekrar deneyin.");
          break;
        default:
          setFirebaseError("Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.");
      }
    }
  };

  return (
    <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
      <h2>Log In</h2>
      <p className={styles.description}>
        Welcome back! Please enter your credentials to access your account.
      </p>

      <div className={styles.inputGroup}>
        <input type="email" placeholder="Email" {...register("email")} />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
      </div>

      <div className={styles.inputGroup}>
        <input type="password" placeholder="Password" {...register("password")} />
        {errors.password && <p className={styles.error}>{errors.password.message}</p>}
      </div>

      {firebaseError && <p className={styles.firebaseError}>{firebaseError}</p>}

      <button type="submit" className={styles.submitBtn}>
        Log In
      </button>
    </form>
  );
}