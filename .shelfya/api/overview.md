# API Overview

This document provides an overview of the main API layers in the Habit Tracker app, focusing on authentication, user profiles, and core Firebase integration.

## Firebase Configuration

The app is powered by [Firebase](https://firebase.google.com/), using:

- **Authentication:** User sign-in, sign-up, password reset
- **Firestore:** Database for user profile storage
- **Storage:** For any file uploads (not detailed here)

Firebase is initialized in [`firebaseconfig.js`](../../firebaseconfig.js):

```js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseconfig = { ... }; // Uses environment variables

const FB_APP   = initializeApp(firebaseconfig);
const FB_AUTH  = initializeAuth(FB_APP, { persistence: getReactNativePersistence(AsyncStorage) });
const FB_DB    = getFirestore(FB_APP);
const FB_STORE = getStorage(FB_APP);

export { FB_APP, FB_AUTH, FB_DB, FB_STORE };
```

## Auth Context

Authentication methods are provided via React Context in [`context/AuthContext.js`](../context/AuthContext.js):

### Main Features

- **Sign Up:** `signUp(email, password)`
- **Sign In:** `signIn(email, password)`
- **Log Out:** `logOut()`
- **Reset Password:** `resetPassword(email)`
- **Get Current User:** Real-time user state

### Usage Example

```jsx
import { useAuth } from './context/AuthContext';

function SignInButton() {
  const { signIn } = useAuth();
  const handleSignIn = async () => {
    await signIn('user@example.com', 'password123');
  };
  // ...
}
```

### Provider Setup

Wrap your app tree with `AuthProvider` to grant access:

```jsx
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* your app routes/components */}
    </AuthProvider>
  );
}
```

## User Context

User profile data is managed with Firestore and exposed via [`context/UserContext.js`](../context/UserContext.js).

- **Real-time user profile data** from Firestore
- **Accessible via context**: `useUser()`
- **Automatically updated on changes**

### Usage Example

```jsx
import { useUser } from './context/UserContext';

function Profile() {
  const { profile } = useUser();
  return <Text>Welcome, {profile.displayName}</Text>;
}
```

### Provider Setup

Wrap your relevant components with `UserProvider` (make sure `AuthProvider` is a parent):

```jsx
import { UserProvider } from './context/UserContext';

<AuthProvider>
  <UserProvider>
    <YourMainApp />
  </UserProvider>
</AuthProvider>
```

## Best Practices

- Always wrap your app with the `AuthProvider` and `UserProvider` for context availability.
- Use context hooks (`useAuth`, `useUser`) in functional components for API access.
- Ensure your environment variables for Firebase configuration are properly set.

## Learn More

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [React Context Docs](https://react.dev/reference/react/Context)

---

This overview covers the foundational API setup and usage. Refer to the context source files for custom extensions or advanced patterns.