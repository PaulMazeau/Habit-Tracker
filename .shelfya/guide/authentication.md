# Authentication Guide

This guide describes how user authentication works in the Habit Tracker app and provides actionable steps for signing up, signing in, and signing out.

## Overview

Authentication in the app is based on Firebase Authentication. The main operations supported are:

- Sign Up (create a new account)
- Sign In (log in to an existing account)
- Sign Out (log out of the app)
- Password Reset (initiate a password reset)

Authentication context and logic is managed in `context/AuthContext.js` and consumed in the authentication screens.

---

## Authentication Context

The authentication state (current user and auth actions) is provided by the `AuthProvider` via React Context.

```js
// Example usage in a component
import { useAuth } from '../context/AuthContext'

const { currentUser, signUp, signIn, logOut, resetPassword } = useAuth();
```

---

## Sign Up (Register)

To create an account, the user provides their first name, last name, email, and password. The flow is handled in `screens/SignUpScreen.js`.

### Behavior

- Validates that all fields are filled
- Calls `signUp` to create a Firebase user
- If successful, saves the first and last name in Firestore under `/users/{uid}`
- Redirects to the main app screen after registration

### Example

```js
signUp(email, password)
  .then((userCredential) => {
    // userCredential.user.uid identifies the new user
    // Save additional info to Firestore
    setDoc(doc(FB_DB, 'users', userCredential.user.uid), { 
      FirstName: firstName,
      LastName: lastName
    });
  })
  .then(() => {
    // Registration complete, navigate to main screen
  })
  .catch((error) => {
    // Handle 'auth/email-already-in-use', 'auth/invalid-email', 'auth/weak-password'
  });
```

**Error Handling:**  
- Email in use, invalid email, or weak password errors are displayed to the user.

---

## Sign In (Login)

To log in, a user provides their email and password. This process is in `screens/SignInScreen.js`.

### Behavior

- Validates that both fields are filled
- Calls `signIn` with email and password
- If successful, navigates to the main app screen (`Main`)
- Handles invalid credential errors and guides users to reset password if forgotten

### Example

```js
signIn(email, password)
  .then(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  })
  .catch((error) => {
    if (error.code === 'auth/invalid-credential') {
      // Show 'Email or password incorrect' message
    }
  });
```

---

## Password Reset

The `resetPassword` method sends a Firebase password reset email to the provided address.

```js
resetPassword(email)
  .then(() => {
    // Let the user know to check their email
  })
  .catch((error) => {
    // Handle errors (e.g., email not registered)
  });
```

**Note:** The entry point for password reset is linked in the Sign In screen ("Mot de passe oublier?").

---

## Sign Out

Signing out is handled both via `context/AuthContext.js` (`logOut()`) and with a direct `signOut` call in `screens/HomeScreen.js`.

### Behavior

- Signs the user out from Firebase
- Navigates back to the authentication/landing screen

### Example

```js
logOut()
  .then(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
  });
```

Or, directly:

```js
signOut(FB_AUTH)
  .then(() => navigation.reset({ index: 0, routes: [{ name: 'Auth' }] }))
  .catch((error) => console.error('Erreur lors de la déconnexion:', error));
```

---

## Storing Additional User Data

When a new user registers, their first and last names are saved in Firestore under `users/{uid}`. Access this data using the user's UID from Firebase Auth to personalize the app.

---

## Tips & Best Practices

- Always show clear validation errors to users, especially for authentication flows.
- Use navigation resets after authentication actions to prevent users from returning to login/signup screens via the back button.
- For security, never log passwords or sensitive authentication data.

---

## Related Files

- **Authentication Context:** `context/AuthContext.js`
- **Sign Up Screen:** `screens/SignUpScreen.js`
- **Sign In Screen:** `screens/SignInScreen.js`
- **Home Screen & Sign Out:** `screens/HomeScreen.js`

---

## Next Steps

- [Getting Started Guide](../getting-started.md)
- [FAQ](../faq.md)
- [Firebase Project Setup](../firebase-setup.md) (if available)

For more details, visit the [Firebase Authentication documentation](https://firebase.google.com/docs/auth).