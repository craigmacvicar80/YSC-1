// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// REPLACE THESE VALUES WITH YOUR REAL KEYS FROM THE FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyAwupPhd2FFhiByYSVsXIAoLtVZir-kUlY",
  authDomain: "your-surgical-career.firebaseapp.com",
  projectId: "your-surgical-career",
  storageBucket: "your-surgical-career.firebasestorage.app",
  messagingSenderId: "99393292462",
  appId: "1:99393292462:web:c4557249d9b7d92bbb853f",
  measurementId: "G-3GHSPC7QWE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Database (Firestore)
export const db = getFirestore(app);