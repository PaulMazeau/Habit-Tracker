# Getting Started with Habit Tracker App

Welcome to the Habit Tracker App! Follow these instructions to set up and run the project on your development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)
- A mobile device (iOS/Android) or an emulator/simulator

## 1. Clone the Repository

```bash
git clone https://github.com/PaulMazeau/Habit-Tracker.git
cd Habit-Tracker
```

## 2. Install Dependencies

Use npm or yarn to install required dependencies:

```bash
npm install
# or
yarn
```

## 3. Configure Environment Variables (Optional)

If your app requires environment variables, create a `.env` file at the project root. The app supports [react-native-dotenv](https://github.com/goatandsheep/react-native-dotenv).

Example `.env` file:
```
API_URL=https://your-api-url.com
FIREBASE_API_KEY=your-firebase-api-key
```

## 4. Start the App

Launch the Expo development server:

```bash
npm start
# or
yarn start
```

Then, follow the Expo CLI instructions:

- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with your Expo Go app on your physical device

## 5. Project Structure Overview

- `App.js`: Main entry point, wraps app with authentication and user context providers, sets up navigation.
- `component/Navigation/`: Contains navigation stacks for authenticated and unauthenticated states.
- `context/`: Provides authentication and user context.

## 6. Useful Commands

- `npm run android` - Run app on Android device/emulator
- `npm run ios` - Run app on iOS simulator
- `npm run web` - Run app in web browser

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

---

You're now ready to start tracking your habits! If you run into any issues, consult the official documentation or open an issue on the project repository.