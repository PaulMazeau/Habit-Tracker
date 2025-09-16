# API Overview

This document provides an overview of the API architecture and integration flow within the **Habit Tracker** app. It outlines authentication, user data management, and Firebase service usage for developers and users seeking to extend or interact with the app’s API layer.

## Architecture Summary

### Core Technologies

- **Firebase:** Handles authentication, Firestore database, and storage.
- **React Context:** Supplies authentication and user data state across the app.
- **React Native / Expo:** Enables cross-platform mobile runtime.

### Main Modules

- **firebaseconfig.js:** Centralizes initialization of Firebase services.
- **context/AuthContext.js:** Provides authentication methods and user state.
- **context/UserContext.js:** Delivers user profile data synced from Firestore.

## Firebase Integration

All Firebase credentials and config values are loaded using environment variables. Firebase is initialized with persistent storage via AsyncStorage.

```js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseconfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  ...
};

const FB_APP = initializeApp(firebaseconfig);

const FB_AUTH = initializeAuth(FB_APP, {
  persistence: getReactNativePersistence(AsyncStorage)
});
```

**Exported Services:**
- `FB_APP` — Firebase App instance
- `FB_AUTH` — Firebase Auth instance
- `FB_DB` — Firestore DB instance
- `FB_STORE` — Firebase Storage instance

## Authentication Flow

Authentication state and operations are supplied by `AuthContext`. Key API calls include:

- **Sign Up:** Create an account
- **Sign In:** User login
- **Log Out:** Logout user
- **Reset Password:** Email password reset

Example usage:

```js
import { useAuth } from '../context/AuthContext';

const { signUp, signIn, logOut, resetPassword, currentUser } = useAuth();

// Usage:
// signUp(email, password)
// signIn(email, password)
// logOut()
// resetPassword(email)
```

App components can access the current user and loading state via `useAuth`.

## User Data Management

`UserContext` manages and synchronizes the user's profile data from Firestore:

- Listens to changes in the user's Firestore document (`users/{uid}`)
- Exposes `profile` object via context

Example usage:

```js
import { useUser } from '../context/UserContext';

const { profile } = useUser();
// profile fields can be accessed directly
```

## Typical Usage Example

Wrap your app's root component with `AuthProvider` and `UserProvider` for authentication and user profile context:

```jsx
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        {/* Your navigation and screens */}
      </UserProvider>
    </AuthProvider>
  );
}
```

## Next Steps & References

- To add custom user fields or habits, extend the Firestore `users` schema.
- For advanced API interactions (CRUD habits, analytics), see additional service modules and Firestore usage in your codebase.

**Useful Links:**
- [Firebase Docs](https://firebase.google.com/docs/)
- [React Context API](https://react.dev/reference/react/createContext)
- [Expo Documentation](https://docs.expo.dev/)

---

For any questions or feedback, refer to the repository’s [issues](https://github.com/PaulMazeau/Habit-Tracker/issues) page.