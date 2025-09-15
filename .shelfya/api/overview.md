# API Overview

This document provides an overview of the authentication and user management API for the Habit Tracker application, including the main flows and hooks available throughout the codebase.

## Architecture Overview

The app uses Firebase for authentication, cloud storage, and Firestore database. Key components include:

- **firebaseconfig.js**: Initializes Firebase services (Authentication, Firestore, Storage) and exports them for use across the app.
- **AuthContext**: Provides authentication-related actions and state across the app using React's Context API.
- **UserContext**: Manages and provides the current user’s profile data from Firestore.

## Authentication Flow

### 1. Firebase Configuration

All Firebase services are initialized in `firebaseconfig.js`:

```js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration and initialization
const FB_APP = initializeApp(firebaseconfig);
const FB_AUTH = initializeAuth(FB_APP, { persistence: getReactNativePersistence(AsyncStorage) });
const FB_DB = getFirestore(FB_APP);

// Export the services
export { FB_APP, FB_AUTH, FB_DB };
```

### 2. Auth Context

The `AuthContext` provides:

- Current user state
- Sign Up
- Sign In
- Log Out
- Password Reset

Usage example:

```js
import { useAuth } from '../context/AuthContext';

// To sign in
const { signIn } = useAuth();
signIn(email, password);

// To sign up
const { signUp } = useAuth();
signUp(email, password);

// To log out
const { logOut } = useAuth();
logOut();

// To reset password
const { resetPassword } = useAuth();
resetPassword(email);

// To access current user
const { currentUser } = useAuth();
```

**Context Provider Example:**

Wrap your app with `AuthProvider` to enable authentication features globally.

```jsx
import { AuthProvider } from '../context/AuthContext';

<AuthProvider>
  {/* ...your app components... */}
</AuthProvider>
```

### 3. User Context

The `UserContext` listens to Firestore changes for the signed-in user's profile and makes it available throughout the app.

Usage example:

```js
import { useUser } from "../context/UserContext";

const { profile } = useUser();
console.log(profile.FirstName, profile.LastName);
```

**Context Provider Example:**

Wrap your app with `UserProvider` alongside `AuthProvider`.

```jsx
import { UserProvider } from '../context/UserContext';

<AuthProvider>
  <UserProvider>
    {/* ...your app components... */}
  </UserProvider>
</AuthProvider>
```

## Authentication Screens

### Sign In

- Validates email and password.
- Calls `signIn`.
- Handles authentication errors.

Example usage:

```js
const { signIn } = useAuth();
signIn(email, password).then(...).catch(...);
```

### Sign Up

- Collects first name, last name, email, and password.
- Calls `signUp`.
- Creates a user document in Firestore.

Example usage:

```js
const { signUp } = useAuth();
signUp(email, password)
  .then(userCredential => {
    const userDocRef = doc(FB_DB, 'users', userCredential.user.uid);
    return setDoc(userDocRef, {
      FirstName: firstName,
      LastName: lastName,
    });
  });
```

### Home Screen

- Displays a welcome message using profile data from `UserContext`.
- Allows user to log out.

Example:

```js
const { profile } = useUser();
<Text>Bienvenue {profile.FirstName} {profile.LastName}</Text>
```

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [React Context API](https://react.dev/reference/react/useContext)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

---

**Tip:** Always wrap your root component in both `AuthProvider` and `UserProvider` to ensure authentication and profile data are accessible throughout your app.