// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the values below with your real keys from the Firebase Console
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

// Export the services so other files can use them
export const auth = getAuth(app);
export const db = getFirestore(app);