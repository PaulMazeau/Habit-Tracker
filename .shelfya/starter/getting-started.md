# Getting Started with the Habit Tracker App

Welcome to the Habit Tracker App! This guide will help you set up and run the project locally. The app is built with React Native and Expo, using Firebase for backend services.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)
- [Firebase Account](https://firebase.google.com/)
- A mobile device, emulator, or simulator for testing

## 1. Clone the Repository

```bash
git clone https://github.com/PaulMazeau/Habit-Tracker.git
cd Habit-Tracker
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

The app uses Firebase and requires environment variables for authentication and storage.

1. Create a `.env` file in the root directory:
    ```bash
    touch .env
    ```

2. Add your Firebase project values (replace with your own API keys):

    ```
    APIKEY=your_firebase_api_key
    AUTHDOMAIN=your_project.firebaseapp.com
    PROJECTID=your_firebase_project_id
    STORAGEBUCKET=your_project.appspot.com
    MESSAGINGSENDERID=your_sender_id
    APPID=your_app_id
    ```

> **Note:** You can find these values in your Firebase project settings.

## 4. Start the App

You can run the app on several platforms:

- **Expo Go App (recommended):**
    ```bash
    npm start
    ```
    Scan the QR code with Expo Go on your device (iOS or Android).

- **Android emulator:**
    ```bash
    npm run android
    ```

- **iOS simulator:**
    ```bash
    npm run ios
    ```

- **Web browser:**
    ```bash
    npm run web
    ```

## 5. Project Structure Overview

- `App.js`: Main entry point. Handles authentication state and navigation.
- `firebaseconfig.js`: Initializes Firebase services (Auth, Firestore, Storage).
- `context/`: Context providers for authentication and user data.
- `component/Navigation/`: App navigation stacks for authenticated and unauthenticated flows.

## 6. Next Steps

- Explore the app: Create an account or log in, then track your habits.
- Customize Firebase rules for your needs.
- Contribute enhancements or bug fixes via pull requests.

---

Need help? Check the [Expo documentation](https://docs.expo.dev/) or the [Firebase documentation](https://firebase.google.com/docs/).

Happy tracking!