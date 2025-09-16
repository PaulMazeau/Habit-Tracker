# Authentication Guide

This guide explains how authentication works in the Habit Tracker app, how to sign up and sign in, and how authentication is managed within the application.

---

## Overview

Authentication in Habit Tracker is handled using Firebase Authentication, providing secure and reliable user sign-up, sign-in, and password management. The app uses React Context to provide authentication state and methods across all components, making user management simple and centralized.

---

## How Authentication Works

### Auth Context

The [`AuthContext`](../context/AuthContext.js) provides the global authentication state and actions:

- `currentUser`: The currently logged-in user or `null`.
- `signUp(email, password)`: Creates a new account.
- `signIn(email, password)`: Logs in an existing user.
- `logOut()`: Logs out the current user.
- `resetPassword(email)`: Sends a password reset email.
- `loading`: Indicates if the authentication state is still loading.

All authentication methods internally communicate with Firebase.

### App Routing

The application displays different navigation stacks based on authentication status:

- If `currentUser` is defined, users access the main app (`MainStack`).
- If not logged in, users see authentication screens (`AuthStack`).

This logic is implemented in [`App.js`](../../App.js):

```jsx
const { currentUser, loading } = useAuth();

if (loading) {
  // Show loader while authenticating
}

return (
  <Stack.Navigator>
    {currentUser ? (
      <Stack.Screen name="Main" component={MainStack} />
    ) : (
      <Stack.Screen name="Auth" component={AuthStack} />
    )}
  </Stack.Navigator>
);
```

---

## Signing Up

Users register with an email, password, first name, and last name in the **Sign Up** screen.

**Key steps:**
1. Input fields are validated for completeness.
2. If valid, `signUp(email, password)` creates the Firebase account.
3. First/last name are saved to Firestore under the user's UID.
4. On success, the app navigates to the main screen.

**Example snippet (from `SignUpScreen.js`):**

```js
signUp(email, password)
  .then((userCredential) => {
    // Save user info to Firestore
    const userDocRef = doc(FB_DB, 'users', userCredential.user.uid);
    return setDoc(userDocRef, {
      FirstName: firstName,
      LastName: lastName,
    });
  })
  .then(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  })
  .catch((error) => {
    // Handle errors (email in use, invalid email, weak password, etc.)
  });
```

**Sign-Up Error Handling:**

- Email already used
- Invalid email
- Weak password (must be at least 6 characters)

User-friendly error messages are displayed for all common errors.

---

## Signing In

The **Sign In** screen allows users to log in with their email and password.

**Flow:**
1. Email and password are validated for presence.
2. `signIn(email, password)` is called.
3. On success, user is routed to the main app.
4. Error feedback (e.g., "incorrect credentials") is shown as needed.

**Example snippet (from `SignInScreen.js`):**

```js
signIn(email, password)
  .then(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  })
  .catch((error) => {
    if (error.code === 'auth/invalid-credential') {
      setErrorPassword("L'email ou le mot de passe est incorrect");
    }
  });
```

---

## Password Reset

From the sign-in screen, users who forgot their password can initiate a reset.

- The app calls `resetPassword(email)`, which sends an email via Firebase.
- You must provide the registered email address to receive the reset link.

---

## Logging Out

At any time, users can sign out using the `logOut()` method from context. This will return the user to the authentication stack.

---

## Accessing Authentication State and Actions

Within any component, you can access the current user and authentication methods:

```js
import { useAuth } from '../context/AuthContext';

const { currentUser, signIn, signUp, logOut, resetPassword } = useAuth();
```

---

## Common Issues & Troubleshooting

- **Loading Loop:** The app will show a loading spinner until the authentication status is confirmed with Firebase.
- **Account Creation Fails:** Ensure the email is not already registered and the password is at least 6 characters.
- **Sign-In Fails:** Check email and password; look for error messages indicating invalid credentials.

---

## Additional References

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase JS SDK - Email/Password Authentication](https://firebase.google.com/docs/auth/web/password-auth)
- [`AuthContext.js` implementation](../context/AuthContext.js)

---

For further help or custom authentication scenarios, please contact the project maintainers.