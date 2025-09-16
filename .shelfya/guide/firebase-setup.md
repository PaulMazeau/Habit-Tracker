# Firebase Setup Guide

This guide explains how to set up Firebase in your Habit-Tracker React Native project.

---

## Prerequisites

- You have a Firebase project. [Create one here.](https://console.firebase.google.com/)
- You have installed project dependencies:
  ```sh
  npm install
  # or
  yarn install
  ```
- You are using environment variables (see `.env.exemple`).

---

## 1. Create and Configure a `.env` File

Copy `.env.exemple` to `.env`:

```sh
cp .env.exemple .env
```

Fill in the required Firebase config values from your [Firebase Console > Project Settings](https://console.firebase.google.com/):

```
APIKEY=your_firebase_api_key
AUTHDOMAIN=your_project.firebaseapp.com
PROJECTID=your_project_id
STORAGEBUCKET=your_project.appspot.com
MESSAGINGSENDERID=your_messaging_sender_id
APPID=your_app_id
```

**Do not commit your `.env` file.** Keep your credentials secret.

---

## 2. Firebase Configuration in the Project

The project uses the settings from your `.env` file in `firebaseconfig.js`:

```js
const firebaseconfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
};
```

---

## 3. Firebase Initialization

The Firebase app and services are initialized with:

```js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// App init
const FB_APP = initializeApp(firebaseconfig);

// Auth setup for React Native
const FB_AUTH = initializeAuth(FB_APP, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Firestore and Storage
const FB_DB = getFirestore(FB_APP);
const FB_STORE = getStorage(FB_APP);

export { FB_APP, FB_AUTH, FB_DB, FB_STORE };
```

**Key Points:**
- Uses AsyncStorage for authentication persistence (Suited for React Native).
- Exports Firebase App, Auth, Firestore (DB), and Storage instances for use throughout the app.

---

## 4. Using Firebase in Your Code

Import the initialized Firebase instances as needed:

```js
import { FB_AUTH, FB_DB, FB_STORE } from './firebaseconfig';

// Example: Sign in a user
import { signInWithEmailAndPassword } from 'firebase/auth';

signInWithEmailAndPassword(FB_AUTH, email, password)
  .then((userCredential) => { /* handle success */ })
  .catch((error) => { /* handle error */ });
```

---

## 5. Troubleshooting

- Ensure your `.env` file contains valid Firebase credentials.
- Restart the Metro bundler (`npm start --reset-cache`) after creating or modifying `.env`.
- If you encounter issues with environment variables, check your module bundler setup (e.g., Babel, Metro, or react-native-dotenv).

---

## References

- [Firebase Console](https://console.firebase.google.com/)
- [React Native Firebase Setup](https://firebase.google.com/docs/web/setup)
- [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)

---

You are now ready to use Firebase in your Habit-Tracker project!