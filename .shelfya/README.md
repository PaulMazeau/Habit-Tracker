# Shelfya Workspace — Habit Tracker App

Welcome to the developer workspace for the Habit Tracker App, codenamed "thechallengeapp." This document provides workspace-level guidance to help you set up, run, and contribute to the project.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Quick Start](#quick-start)
- [Development Workflow](#development-workflow)
- [Available Scripts](#available-scripts)
- [Key Dependencies](#key-dependencies)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

---

## Project Overview

Habit Tracker App is a React Native application designed to help users build and track their daily habits. The project uses Expo for rapid development and includes authentication, user management, and navigation stacks.

---

## Quick Start

**Prerequisites:**

- [Node.js](https://nodejs.org/) (v14 or above recommended)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

**Installation:**

```sh
git clone https://github.com/PaulMazeau/Habit-Tracker.git
cd Habit-Tracker
yarn install              # or npm install
```

**Starting the App:**

```sh
yarn start                # or npm start
```

You can also run on specific platforms:

- Android: `yarn android`
- iOS: `yarn ios`
- Web: `yarn web`

---

## Development Workflow

The main entry point is `App.js`. The app uses two main context providers: `AuthProvider` for authentication state, and `UserProvider` for user data. Navigation uses React Navigation's Native Stack and Bottom Tabs.

- **Auth Flow:** Unauthenticated users are shown the `AuthStack` (authentication screens). When logged in, users access the `MainStack` (main app content).
- **Loading State:** While authentication state is being established, a centered loading spinner (`ActivityIndicator`) is displayed.

---

## Available Scripts

| Script      | Description                      |
|-------------|----------------------------------|
| `start`     | Launches the Expo development server |
| `android`   | Runs the app on an Android simulator/device |
| `ios`       | Runs the app on an iOS simulator/device     |
| `web`       | Runs the app in a web browser    |

Example usage:

```sh
yarn start
```

---

## Key Dependencies

- `react-native`: App core
- `expo`: Platform and build tooling
- `@react-navigation/native`: Navigation
- `firebase`: Backend and authentication
- `@react-native-async-storage/async-storage`: Local storage
- `react-native-reanimated`, `react-native-svg`: UI/Animation

_See [`package.json`](../package.json) for a full list._

---

## Troubleshooting

- **Blank screen at startup:** Ensure your Firebase configuration is correct in your context files.
- **Emulator issues:** Make sure Android Studio or Xcode simulators are running.
- **Dependencies not found:** Run `yarn install` or `npm install` to resolve.

---

## Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Guide](https://reactnavigation.org/docs/getting-started)
- [Firebase for JavaScript](https://firebase.google.com/docs)

---

Happy tracking — improve your habits with every commit!