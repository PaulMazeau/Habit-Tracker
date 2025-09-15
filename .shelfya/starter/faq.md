# FAQ

Welcome to the Habit Tracker App FAQ! Here you'll find answers to common questions about using the app, account management, and technical basics.

---

## Authentication

### How do I create an account?

To sign up, use your email and a secure password on the registration page. The app uses Firebase authentication to securely create your account.

**Example (if using custom code):**
```js
signUp('your@email.com', 'yourPassword');
```

### How do I sign in?

Log in with your registered email and password. On failure, check your credentials and try again.

**Example (if using custom code):**
```js
signIn('your@email.com', 'yourPassword');
```

### I forgot my password. What should I do?

You can reset your password by providing your email address. The app will send you a password reset email.

**Example (if using custom code):**
```js
resetPassword('your@email.com');
```

### How do I sign out?

Simply log out from the app menu or your profile.

**Example (if using custom code):**
```js
logOut();
```

---

## Data & Storage

### How does the app store my data?

The app uses [Firebase Firestore](https://firebase.google.com/docs/firestore) for storing your habits and tracking data. Files or media are stored in [Firebase Storage](https://firebase.google.com/docs/storage).

### Is my session saved? Will I stay logged in?

Yes. The app uses persistent authentication built for React Native, so your session is stored securely using device storage (`AsyncStorage`).

---

## Troubleshooting

### My authentication isn't working—what can I check?

- Ensure your device is connected to the internet.
- Double-check your email and password.
- If issues persist, try resetting your password.

### Why can't I see my habits after logging in from a different device?

Make sure you're signed in with the same account. All your data is linked to your unique account email in Firebase.

---

## Technical

### What technologies does the app use?

- **React Native** for the app interface
- **Firebase** (Authentication, Firestore, Storage)
- **AsyncStorage** for session persistence

### Where can I find the source code?

You can find the source code on [GitHub](https://github.com/PaulMazeau/Habit-Tracker) (replace with actual repo link if different).

---

Still have questions?  
Open an issue on GitHub or contact the project maintainers for support.