import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD3Ti_mXCXCWppLrC5dNePXy_LlOZ-dxkE",
  authDomain: "learnlingo-1b4e1.firebaseapp.com",
  projectId: "learnlingo-1b4e1",
  storageBucket: "learnlingo-1b4e1.firebasestorage.app",
  messagingSenderId: "525868488262",
  appId: "1:525868488262:web:5c7fe51660d0b2fb981c47"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
