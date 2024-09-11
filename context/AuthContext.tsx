import { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { FB_AUTH } from '../firebaseconfig';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inscription d'un nouvel utilisateur
  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(FB_AUTH, email, password);
  };

  // Connexion d'un utilisateur
  const signIn = (email, password) => {
    return signInWithEmailAndPassword(FB_AUTH, email, password);
  };

  // Réinitialisation d'un mot de passe oublié
  const resetPassword = (email) => {
    return sendPasswordResetEmail(FB_AUTH, email);
  }

  // Déconnexion de l'utilisateur
  const logOut = () => {
    return signOut(FB_AUTH);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FB_AUTH, (user) => {
      setCurrentUser(user);
      setLoading(false); // Données chargées ou utilisateur non connecté
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    signUp,
    signIn,
    logOut,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
