// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Auth

// YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAwupPhd2FFhiByYSVsXIAoLtVZir-kUlY",
  authDomain: "your-surgical-career.firebaseapp.com",
  projectId: "your-surgical-career",
  storageBucket: "your-surgical-career.firebasestorage.app",
  messagingSenderId: "99393292462",
  appId: "1:99393292462:web:c4557249d9b7d92bbb853f",
  measurementId: "G-3GHSPC7QWE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // Export Auth