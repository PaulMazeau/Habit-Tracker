# Database Guide

This guide explains how the Habit Tracker app integrates with Firebase services for authentication and data storage, and how user data is managed within the app.

## Database Architecture Overview

The app uses [Firebase](https://firebase.google.com/) as its backend platform, leveraging:

- **Firestore** for persistent, real-time NoSQL data storage.
- **Firebase Authentication** for handling user sign-up and login.
- **Firebase Storage** (reference only; usage not shown in the provided files).
- **AsyncStorage** for local persistence on React Native devices.

All Firebase services are initialized and exported from `firebaseconfig.js`.

## Firebase Initialization

The core Firebase services are initialized as follows:

```js
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

const FB_APP = initializeApp(firebaseconfig);

const FB_AUTH = initializeAuth(FB_APP, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const FB_DB = getFirestore(FB_APP);
const FB_STORE = getStorage(FB_APP);

export { FB_APP, FB_AUTH, FB_DB, FB_STORE };
```

> **Note:** Set your Firebase project credentials as environment variables.

## Firestore User Data Structure

Each user has a document in the `users` collection, keyed by their unique user id (`uid`).  
The document's structure when created:

```json
{
  "FirstName": "string",
  "LastName": "string"
}
```

## User Creation Flow

When a user signs up via the app (`SignUpScreen.js`):

1. **Authentication:** `signUp(email, password)` creates a Firebase Auth user.
2. **Profile Storage:** The user's `FirstName` and `LastName` are stored in Firestore at `users/{uid}`.

Example flow:

```js
const userDocRef = doc(FB_DB, 'users', userCredential.user.uid);
await setDoc(userDocRef, {
  FirstName: firstName,
  LastName: lastName,
});
```

## Accessing User Data

The app uses a `UserContext` to provide user profile data to components.

- On authentication, a Firestore `onSnapshot` listener fetches and updates the current user's profile in real time.
- The profile is made available via React context:

```js
const userProfileRef = doc(FB_DB, 'users', currentUser.uid);
unsubscribeFromUser = onSnapshot(userProfileRef, doc => {
  if (doc.exists()) {
    setProfile({
      ...doc.data(),
      uid: currentUser.uid
    });
  }
});
```

To access the profile in a component:

```js
import { useUser } from '../context/UserContext';

const { profile } = useUser();
```

## Best Practices

- **Security:** Protect your Firebase credentials. Use environment variables.
- **Validation:** User inputs (`FirstName`, `LastName`, etc.) are validated before being written to Firestore.
- **Real-Time Sync:** Firestore listeners ensure the UI reacts to any user document changes.

## Additional Resources

- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Auth for React Native](https://firebase.google.com/docs/auth/web/start)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/docs/usage/)

---

This guide covers the core patterns for database interaction within the Habit Tracker app. Extend the user document as needed for additional profile information or app-specific data.