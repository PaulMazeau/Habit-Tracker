import React, { createContext, useState, useEffect, useContext } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { FB_DB } from '../firebaseconfig';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    let unsubscribeFromUser = () => {};

    if (currentUser) {
      const userProfileRef = doc(FB_DB, 'users', currentUser.uid);

      unsubscribeFromUser = onSnapshot(userProfileRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setProfile({
            ...userData,
            uid: currentUser.uid
          });
        } else {
          console.log("No such user!");
        }
      });
    }

    return () => unsubscribeFromUser();
  }, [currentUser]);

  const value = {
    profile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
