import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../utils/validationSchemas";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

export default function RegisterForm({ onClose }) {
  const [firebaseError, setFirebaseError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    try {
      setFirebaseError("");
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      onClose();
      navigate("/teachers");
    } catch (error) {
      // Firebase hata kodlarına göre kullanıcı dostu mesaj
      switch (error.code) {
        case "auth/email-already-in-use":
          setFirebaseError("Bu e-posta zaten kayıtlı. Lütfen giriş yapın.");
          break;
        case "auth/weak-password":
          setFirebaseError("Şifre çok zayıf. En az 6 karakter girin.");
          break;
        case "auth/invalid-email":
          setFirebaseError("Geçersiz e-posta adresi.");
          break;
        default:
          setFirebaseError("Kayıt yapılamadı. Lütfen bilgilerinizi kontrol edin.");
      }
    }
  };

  return (
    <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
      <h2>Registration</h2>
      <p className={styles.description}>
        Please fill in the information below to create your account.
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
        Sign Up
      </button>
    </form>
  );
}