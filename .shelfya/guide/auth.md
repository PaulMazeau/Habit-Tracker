# Authentication Guide

This guide explains how authentication works in the Habit Tracker app and how to implement common authentication actions: sign up, sign in, sign out, and password reset.

---

## Overview

Authentication is managed via Firebase Auth, with user profile information stored in Firestore. Core authentication logic is provided by the `AuthContext`, used throughout the app. Detailed user profiles are handled in `UserContext`.

---

## How Authentication Works

- **AuthContext** wraps your app to provide authentication state and actions.
- **UserContext** listens for profile changes in Firestore.
- **SignInScreen** and **SignUpScreen** are the main entry points for authentication.

---

## Setting Up Auth Context Provider

Wrap your app with `AuthProvider` so authentication state is available globally:

```jsx
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      {/* ... your navigators/components ... */}
    </AuthProvider>
  );
}
```

If you need profile data, wrap with `UserProvider`:

```jsx
import { UserProvider } from './context/UserContext';

<AuthProvider>
  <UserProvider>
    {/* ... */}
  </UserProvider>
</AuthProvider>
```

---

## Using Authentication Functions

### Sign Up

Call `signUp(email, password)` from `useAuth`, and after success, store additional user info in Firestore:

```js
const { signUp } = useAuth();

signUp(email, password)
  .then((userCredential) => {
    // Store extra info to Firestore
    return setDoc(doc(FB_DB, 'users', userCredential.user.uid), {
      FirstName: firstName,
      LastName: lastName,
    });
  })
  .then(() => {
    // Navigate to the main app screen
  })
  .catch((error) => {
    // Handle errors (e.g., email already in use, weak password)
  });
```

See `SignUpScreen.js` for a complete example.

---

### Sign In

Call `signIn(email, password)`. On success, the app navigates to the main screen.

```js
const { signIn } = useAuth();

signIn(email, password)
  .then(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  })
  .catch((error) => {
    // Handle errors (e.g., invalid credentials)
  });
```

See `SignInScreen.js` for logic and form validation examples.

---

### Sign Out

Simply invoke `logOut()` from `useAuth()`:

```js
const { logOut } = useAuth();

logOut()
  .then(() => {
    // User signed out, update UI or redirect as necessary
  });
```

---

### Password Reset

To send a password reset email:

```js
const { resetPassword } = useAuth();

resetPassword(email)
  .then(() => {
    // Notify user to check their email
  })
  .catch((error) => {
    // Handle errors
  });
```

---

## Accessing the Current User

The `useAuth` hook exposes `currentUser`, reflecting the currently signed-in user (or `null` if signed out):

```js
const { currentUser } = useAuth();

if (currentUser) {
  console.log('User is signed in:', currentUser.uid);
}
```

---

## Accessing User Profile (Firestore)

After authentication, user profiles are loaded via the `UserProvider` and accessed with `useUser`:

```js
const { profile } = useUser();

console.log(profile.FirstName, profile.LastName);
```

---

## Screens: Sign In & Sign Up

- **SignInScreen:** Lets the user log in with email and password, recover their password, or navigate to the sign-up screen.
- **SignUpScreen:** Collects basic info (first name, last name, email, password), performs input validation, registers with Firebase, and populates the Firestore user profile.

For UI/UX, see the code samples in `screens/SignInScreen.js` and `screens/SignUpScreen.js`.

---

## Error Handling

- Invalid email formats, blank fields, weak passwords, or duplicate emails are handled and displayed with user-friendly messages in the UI.

---

## Additional Resources

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [React Context API](https://react.dev/reference/react/createContext)
- [React Native Navigation](https://reactnavigation.org/docs/getting-started/)

---

## Example: Using Auth in a Component

```jsx
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { currentUser, logOut } = useAuth();

  if (!currentUser) {
    return <Text>Please sign in.</Text>;
  }

  return (
    <View>
      <Text>Welcome, {currentUser.email}!</Text>
      <Button title="Sign Out" onPress={logOut} />
    </View>
  );
}
```

---

If you need to customize or extend authentication, start with `context/AuthContext.js` for modifications. For profile-related data beyond authentication, edit `context/UserContext.js`.