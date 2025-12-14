// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

// 1. Create the Context
const AuthContext = createContext();

// 2. Custom Hook to use the context easily
export function useAuth() {
  return useContext(AuthContext);
}

// 3. The Provider Component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login function (Starts with Guest/Anonymous login like your original code)
  function login() {
    return signInAnonymously(auth);
  }

  // Logout function
  function logout() {
    return signOut(auth);
  }

  // Listen for user changes (Login/Logout events)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}