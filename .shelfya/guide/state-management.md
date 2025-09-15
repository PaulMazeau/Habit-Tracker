# State Management Guide

This guide describes how state management works in the Habit Tracker app, focusing on authentication, user profiles, and overall context structure.

## Overview

The app relies on React Context for state management, separating user authentication and user profile data into distinct contexts:
- **AuthContext**: Handles authentication state (sign in, sign up, sign out, password reset).
- **UserContext**: Manages user profile data from Firestore based on the authenticated user.

Both contexts wrap the main app and are available throughout the component tree.

## Authentication State (`AuthContext`)

**Location**: `context/AuthContext.js`

### Features

- Tracks authentication state (`currentUser`, `loading`)
- Exposes sign up, sign in, sign out, and password reset functions
- Uses Firebase Auth for state persistence

### Usage

#### Accessing Auth State

```js
import { useAuth } from '../context/AuthContext';

const { currentUser, signIn, signUp, logOut, resetPassword, loading } = useAuth();
```

#### Example: Sign In

```js
const handleSignIn = async () => {
  try {
    await signIn(email, password);
    // Navigate or update UI after successful sign-in
  } catch (error) {
    // Handle error
  }
};
```

### State Updates

- Auth state automatically updates when Firebase Auth state changes.
- The `loading` property ensures that UI shows a loader until the user's auth status is determined.

## User Profile State (`UserContext`)

**Location**: `context/UserContext.js`

### Features

- Tracks user profile data from Firestore for the current user
- Listens live for profile changes

### Usage

#### Accessing User Profile

```js
import { useUser } from '../context/UserContext';

const { profile } = useUser();
```

#### Example: Using Profile Data

```js
const displayName = profile?.displayName;
```

### Live Updates

- Profile context updates automatically when Firestore changes for the authenticated user.
- Ensures real-time reflection of user data across the app.

## Application Structure

**Location**: `App.js`

Both contexts wrap the app:

```js
export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </UserProvider>
    </AuthProvider>
  );
}
```

- The app renders either the authenticated screens (`MainStack`) or authentication screens (`AuthStack`) depending on `currentUser`.
- Loader (`ActivityIndicator`) shows while authentication status is loading.

## Best Practices

- Use the `useAuth` and `useUser` hooks to access state and actions.
- Wrap your components with `AuthProvider` and `UserProvider` for seamless state access.
- Handle the `loading` state to prevent UI glitches during initial auth checks.

## Next Steps

- For details on available actions, check `context/AuthContext.js` and `context/UserContext.js`.
- To add new global states, create new contexts following the existing pattern.

## Related Links

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [React Context API](https://react.dev/reference/react/createContext)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

---

This structure allows you to manage authentication and user data reliably across your React Native app. For more advanced patterns (like reducers or state libraries), consider using Redux or Zustand if complexity grows.