import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseconfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
};

// Initialize Firebase
const FB_APP = initializeApp(firebaseconfig);

// Utiliser AsyncStorage pour la persistance
const FB_AUTH = initializeAuth(FB_APP, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const FB_DB = getFirestore(FB_APP);
const FB_STORE = getStorage(FB_APP);

// Export the initialized services
export { FB_APP, FB_AUTH, FB_DB, FB_STORE };