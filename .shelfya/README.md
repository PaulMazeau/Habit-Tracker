# Shelfya: Getting Started with Habit Tracker App

Welcome to Shelfya's Habit Tracker App! This guide helps you quickly get up and running with the app and explains the basic structure.

## Overview

Shelfya Habit Tracker App lets you track habits and challenges using a secure authentication system and user management. It’s built with React Native and Expo, supporting Android, iOS, and web.

## Features

- User Authentication
- Habit tracking workflows
- Seamless navigation between main and auth screens
- Cross-platform (Android, iOS, Web)

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Expo CLI:  
  ```bash
  npm install -g expo-cli
  ```

## Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/PaulMazeau/Habit-Tracker.git
    cd Habit-Tracker
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Start the app**
    ```bash
    npm start
    ```
    You can also target specific platforms:
    ```bash
    npm run android
    npm run ios
    npm run web
    ```

## Project Structure

- `App.js`: Sets up authentication, user context, and navigation between main content and login/register screens.
- `context/AuthContext.js`: Handles user authentication state.
- `context/UserContext.js`: Manages logged-in user details.
- `component/Navigation/MainStack.js`: Main app navigation.
- `component/Navigation/AuthStack.js`: Auth flow navigation.

## Navigation Logic Example

```jsx
const { currentUser, loading } = useAuth();

if (loading) {
  return <ActivityIndicator size="large" />;
}

// App shows MainStack if authenticated, else AuthStack
<Stack.Navigator>
  {currentUser ? (
    <Stack.Screen name="Main" component={MainStack} />
  ) : (
    <Stack.Screen name="Auth" component={AuthStack} />
  )}
</Stack.Navigator>
```

## Platform Settings

- Portrait orientation
- Custom splash and app icons: Place images in the `assets` folder as referenced in `app.json`.
- Tablet support for iOS
- Adaptive icons for Android

## Useful Scripts

- `start`: Launches Expo developer tools
- `android`: Runs app on Android emulator/device
- `ios`: Runs app on iOS simulator/device
- `web`: Runs app in the browser

## More Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)

---

Ready to build your habit-tracking journey? Follow these steps and start customizing!