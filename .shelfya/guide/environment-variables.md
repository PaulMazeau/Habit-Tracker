# Environment Variables Guide

This guide explains how to configure environment variables for the Habit Tracker project. Environment variables are required to securely connect the app to your Firebase backend.

## Setting Up Environment Variables

1. **Create an `.env` File**  
   Copy the template provided by `.env.exemple` to a new file named `.env` in the project root:

   ```sh
   cp .env.exemple .env
   ```

2. **Fill in Your Firebase Credentials**  
   Open the new `.env` file and provide the values from your Firebase project:

   ```
   APIKEY=your-firebase-api-key
   PROJECTID=your-project-id
   AUTHDOMAIN=your-auth-domain
   STORAGEBUCKET=your-storage-bucket
   MESSAGINGSENDERID=your-messaging-sender-id
   APPID=your-app-id
   ```

   You can obtain these credentials from your [Firebase Console](https://console.firebase.google.com/) under Project Settings. All fields are required for proper Firebase setup.

## How Variables Are Used

The application loads environment variables using the `react-native-dotenv` Babel plugin (see `babel.config.js`). In the code, values are accessed via `process.env`:

```js
const firebaseconfig = {
    apiKey: process.env.APIKEY,
    // ...other variables
};
```

## Example Usage in Code

```js
import { initializeApp } from "firebase/app";
const firebaseconfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  // ...
};
const FB_APP = initializeApp(firebaseconfig);
```

## Troubleshooting

- **Missing or Empty Variables:**  
  If any variable is missing or incorrect, Firebase initialization will fail. Double-check values in your `.env` file.
- **Hot Reloading:**  
  If you change the `.env` file, restart your development server to apply updates.
- **Don't Commit Sensitive Info:**  
  Never commit your real `.env` file to version control. Only `.env.exemple` should be checked in.

## Related Links

- [Firebase Console](https://console.firebase.google.com/)
- [react-native-dotenv documentation](https://github.com/goatandsheep/react-native-dotenv)
- [Expo environment variables guide](https://docs.expo.dev/guides/environment-variables/)

---

By correctly configuring your environment variables, your Habit Tracker app will securely connect to your Firebase backend.