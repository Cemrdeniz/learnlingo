import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./config";

export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};
