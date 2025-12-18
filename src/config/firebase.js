// src/config/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwupPhd2FFhiByYSVsXIAoLtVZir-kUlY",
  authDomain: "your-surgical-career.firebaseapp.com",
  projectId: "your-surgical-career",
  storageBucket: "your-surgical-career.firebasestorage.app",
  messagingSenderId: "99393292462",
  appId: "1:99393292462:web:c4557249d9b7d92bbb853f",
  measurementId: "G-3GHSPC7QWE"
};

// Initialize Firebase only if an app doesn't already exist
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app; // CRITICAL: This allows 'import app from...' to work