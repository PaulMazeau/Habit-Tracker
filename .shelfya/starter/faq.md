# Habit Tracker App FAQ

Welcome to the Habit Tracker App FAQ! This guide answers common questions to help you get started, troubleshoot issues, and make the most of the app.

---

## General

### What is the Habit Tracker App?

The Habit Tracker App is a mobile application designed to help users build, monitor, and maintain habits using a user-friendly interface based on React Native and Expo.

---

## Installation & Setup

### How do I run the app locally?

1. **Install Prerequisites**
   - [Node.js](https://nodejs.org/)
   - [Expo CLI](https://docs.expo.dev/get-started/installation/)

2. **Clone the Repository**
   ```sh
   git clone https://github.com/PaulMazeau/Habit-Tracker.git
   cd Habit-Tracker
   ```

3. **Install Dependencies**
   ```sh
   npm install
   ```

4. **Start the App**
   ```sh
   npm start
   ```

5. **Run on Your Device or Emulator**
   - For Android:
     ```sh
     npm run android
     ```
   - For iOS:
     ```sh
     npm run ios
     ```
   - For Web:
     ```sh
     npm run web
     ```

---

## Troubleshooting

### I get errors related to Expo or dependencies. What should I do?

- Ensure you are using the correct version of Node.js.
- Delete `node_modules` and `package-lock.json`, then run `npm install` again.
- Make sure Expo CLI is installed globally:
  ```sh
  npm install -g expo-cli
  ```

### How do I reset the project’s cache?

If you encounter unexpected errors:
```sh
expo start -c
```

---

## Features & Functionality

### Which platforms are supported?

The app supports Android, iOS, and web through Expo.

### What libraries does the app use?

Major libraries include:
- React Native
- Expo
- Firebase (for backend support)
- React Navigation (for in-app navigation)
- Async Storage (for local data persistence)

---

## Contributing

### How can I contribute?

- Fork the repository and create a pull request.
- Refer to the [official documentation](https://reactnative.dev/docs/getting-started) for contributing practices.

---

## More Questions?

If you can’t find your answer here, please check the [project README](../../README.md) or open an issue on the repository.