// app/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";  // <<-- Importa Auth

const firebaseConfig = {
  apiKey: "AIzaSyBUri9lATcSWs4QFDwLLTnJzH8S5sYCRMw",
  authDomain: "chikitopetbase.firebaseapp.com",
  projectId: "chikitopetbase",
  storageBucket: "chikitopetbase.appspot.com", // CORREGIDO
  messagingSenderId: "889104905754",
  appId: "1:889104905754:web:43c2a3d4ee747c31e403a3"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);   // <<-- Exporta Auth
export { app };