# Getting Started with Habit Tracker App

Welcome to the Habit Tracker App! This guide will help you set up and run the project locally.

## Prerequisites

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **Expo CLI:**  
  Install globally if not already:
  ```sh
  npm install -g expo-cli
  ```
- **Firebase** project & credentials

## 1. Clone the Repository

```sh
git clone https://github.com/PaulMazeau/Habit-Tracker.git
cd Habit-Tracker
```

## 2. Install Dependencies

```sh
npm install
```
or
```sh
yarn install
```

## 3. Configure Firebase

Create a `.env` file at the root with your Firebase config:

```env
APIKEY=your-api-key
AUTHDOMAIN=your-auth-domain
PROJECTID=your-project-id
STORAGEBUCKET=your-storage-bucket
MESSAGINGSENDERID=your-messaging-sender-id
APPID=your-app-id
```

Ensure your Firebase project is set up for web and uses the correct keys.

## 4. Start the App

### For mobile (Android/iOS)
```sh
npm start
```
This opens Expo DevTools in your browser. Use a simulator or scan the QR code with the Expo Go app.

### For web
```sh
npm run web
```

## 5. Folder Structure Overview

- `App.js`: Main entry point, handles navigation and authentication.
- `firebaseconfig.js`: Firebase initialization using environment variables.
- `component/Navigation/`: App's navigation stacks.
- `context/`: React contexts (e.g., `AuthContext`, `UserContext`).

## 6. Troubleshooting

- If environment variables are not found, double-check your `.env` file, and restart Metro bundler.
- For Firebase errors, verify your Firebase project configuration and permissions.

---

You're all set! Start building and tracking your habits. For further information, see the [README.md](../../README.md).