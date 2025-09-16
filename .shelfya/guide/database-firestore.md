# Firestore Database Guide

This guide explains how Firestore is used and integrated within the Habit Tracker app. It details core patterns such as initializing the database, user profile storage, and accessing user data throughout the application.

---

## Firestore Initialization

Firestore is initialized in `firebaseconfig.js`, alongside Firebase Auth and Storage. The Firestore instance is exported as `FB_DB` for use across the app.

```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseconfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
};

const FB_APP = initializeApp(firebaseconfig);
const FB_DB = getFirestore(FB_APP);

export { FB_DB };
```

Make sure your environment variables are set up for all necessary Firebase values.

---

## User Profile Storage

When a new user signs up, their profile is saved in the Firestore `users` collection. Each user document is keyed by the user's UID and contains personal information such as their first and last name.

**Example Flow (from `SignUpScreen.js`):**

```js
import { FB_DB } from '../firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';

// After successful Firebase signup
const userDocRef = doc(FB_DB, 'users', userCredential.user.uid);
await setDoc(userDocRef, {
    FirstName: firstName,
    LastName: lastName,
});
```

- The document path is `users/{uid}`.
- The user object stores at minimum `FirstName` and `LastName`.  
- Extend the stored information as needed for your app.

---

## Accessing User Data

The user's profile is loaded and kept up-to-date using a Firestore real-time snapshot listener, as shown in `context/UserContext.js`.

**Pattern:**

```js
import { doc, onSnapshot } from 'firebase/firestore';
import { FB_DB } from '../firebaseconfig';

const userProfileRef = doc(FB_DB, 'users', currentUser.uid);
const unsubscribe = onSnapshot(userProfileRef, (docSnap) => {
    if (docSnap.exists()) {
        setProfile({ ...docSnap.data(), uid: currentUser.uid });
    }
});
```

- This provides real-time sync of user profile information.
- Clean up listeners with the returned `unsubscribe` function.

---

## Best Practices

- Always validate user input before writing to Firestore.
- Separate authentication (handled by Firebase Auth) from profile data (stored in Firestore).
- Use real-time listeners to keep UI state in sync with Firestore changes.

---

## Example: Firestore User Document

A user document (`users/{uid}`) will look like:

```json
{
  "FirstName": "Marie",
  "LastName": "Curie"
}
```

---

## See Also

- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [@react-native-firebase/firestore](https://rnfirebase.io/firestore/usage) (for advanced usage with React Native)

---

## Troubleshooting

- Ensure your Firestore security rules allow read and write access as intended for authenticated users.
- Check that `FB_DB` is correctly imported and initialized before usage.

---

**Need more advanced Firestore usage or help with querying? Refer to the [Firestore official docs](https://firebase.google.com/docs/firestore/query-data/get-data) or file an issue in the project repository.**