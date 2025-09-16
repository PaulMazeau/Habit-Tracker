# Architecture Overview

This document outlines the architecture of the Habit Tracker app, describing its core structure, navigation flow, state management, and integration with Firebase services.

## Application Structure

The app is built using React Native and utilizes the following main components:

- **App Initialization** (`App.js`): Entry point of the app, setting up global providers and navigation.
- **Navigation**:
  - **AuthStack**: Screens for authentication (sign-up, sign-in, onboarding).
  - **MainStack**: Main app tabs (Home, Browse, Profile).
- **State Management**:
  - **AuthContext**: Handles authentication state and operations.
  - **UserContext**: Manages user profile data from Firestore.
- **Firebase Integration**: Manages authentication, database, and storage via Firebase.

## Core Providers

### AuthProvider

- Responsible for authentication state.
- Methods: `signUp`, `signIn`, `logOut`, `resetPassword`.
- Holds `currentUser`, detects auth state changes.
- Wraps the whole app to provide context accessible via `useAuth()`.

#### Example Usage

```js
import { useAuth } from './context/AuthContext';

const { currentUser, signIn } = useAuth();
```

### UserProvider

- Fetches and provides user's profile data from Firestore.
- Syncs to the authenticated user (`currentUser`).
- Accessible via `useUser()`.

#### Example Usage

```js
import { useUser } from './context/UserContext';

const { profile } = useUser();
```

## Navigation Flow

The app uses React Navigation with two main stack navigators, dynamically chosen based on authentication state.

### App Flow (`App.js`)

1. AuthProvider and UserProvider wrap the app.
2. `AppNavigator` checks if user is authenticated:
    - If **loading**, shows a spinner.
    - If **authenticated** (`currentUser` exists), loads `MainStack`.
    - Otherwise, loads `AuthStack`.

```js
if (currentUser) {
  <Stack.Screen name="Main" component={MainStack} />
} else {
  <Stack.Screen name="Auth" component={AuthStack} />
}
```

### AuthStack (`component/Navigation/AuthStack.js`)

- Handles onboarding and authentication screens.
- Initial screen: FirstScreen.
- Includes SignUp and SignIn flows.

### MainStack (`component/Navigation/MainStack.js`)

- Bottom tab navigator for main features:
    - `HomeScreen`
    - `BrowseScreen`
    - `ProfileScreen`
- Icons for tabs are provided via SVG assets.

## Firebase Integration

All Firebase configuration and initialization is located in `firebaseconfig.js`. 

### Services

- **Authentication**: With native persistence using AsyncStorage.
- **Firestore**: For user profile and app data.
- **Storage**: For file uploads (e.g., profile images).

```js
const FB_APP = initializeApp(firebaseconfig);
const FB_AUTH = initializeAuth(FB_APP, { persistence: getReactNativePersistence(AsyncStorage) });
const FB_DB = getFirestore(FB_APP);
const FB_STORE = getStorage(FB_APP);
```

Exported for use throughout the app.

## Data Flow

- **AuthContext** monitors authentication from Firebase Auth.
- **UserContext** listens to Firestore user document changes for the authenticated user.
- **Navigation** switches between authentication stack and main app tabs based on user state.

## Extensibility & Modularity

- **Contexts**: Encapsulate logic and state for authentication and profile management, making the app modular and easy to extend.
- **Navigation**: Stack and tab navigation allow for expandable screen flows.

## Summary

The Habit Tracker app is architected to be modular, scalable, and secure, with clear separation between authentication, user data management, navigation, and Firebase integration. For further extension, developers can add screens to either stack, expand profile/user contexts, or integrate new Firebase services as needed.

---

**Related files and links:**

- [App.js](../../App.js)
- [AuthContext.js](../../context/AuthContext.js)
- [UserContext.js](../../context/UserContext.js)
- [firebaseconfig.js](../../firebaseconfig.js)
- [AuthStack.js](../../component/Navigation/AuthStack.js)
- [MainStack.js](../../component/Navigation/MainStack.js)