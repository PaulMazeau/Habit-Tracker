# Frequently Asked Questions

Find answers to common questions about using and getting started with the Habit Tracker App (TheChallengeApp).

---

### What is the Habit Tracker App?

The Habit Tracker App is a mobile application to help users track and manage daily habits and routines, available for iOS, Android, and web platforms.

---

### What platforms are supported?

- **iOS** (supports tablets)
- **Android**
- **Web**

---

### How do I sign up or sign in?

The app has an authentication flow managed by the AuthStack. When you first open the app:

1. **First Screen:** You'll be welcomed and prompted to either sign up or sign in.
2. **Sign Up:** Create a new account using your email and password.
3. **Sign In:** Enter your credentials to access your existing account.

---

### How does navigation work in the app?

- **Before Login:**  
  You navigate between the First Screen, Sign Up, and Sign In screens.
- **After Login:**  
  You access the main sections:
  - **Home**
  - **Browse**
  - **Profile**
  
  These are accessible via a bottom tab navigator with icons for easy switching.

---

### Is my progress saved?

Yes. Your data is securely stored using Firebase Firestore and Storage. Authentication is managed via Firebase Auth with device persistence, so your progress is kept even when you close the app, as long as you remain logged in.

---

### What should I do if I lost my device or deleted the app?

Simply reinstall the app and sign in with your account. All your habit data and profile information will be synced from the cloud.

---

### Is my data private?

User authentication and data storage are handled using Firebase, providing robust security and privacy features. Make sure to keep your account credentials safe.

---

### I have feedback or found a bug. What should I do?

We welcome your feedback! Please open an issue on the [GitHub repository](https://github.com/PaulMazeau/Habit-Tracker/) with details about your feedback or the bug you encountered.

---

### Where can I learn more?

See the [README](../../README.md) for an overview and visit the [GitHub repository](https://github.com/PaulMazeau/Habit-Tracker/) for project updates.