# Application Architecture Guide

This document provides an overview of the key architectural components of the Habit-Tracker application, focusing on navigation flow and context management. It is aimed at developers and contributors interested in understanding the structure and how major parts interact.

## Overview

The application is built using React Native and organizes logic using a combination of navigation stacks and context providers for authentication and user profile management.

```
App.js
│
├── <AuthProvider>
│   └── <UserProvider>
│        └── <NavigationContainer>
│             └── AppNavigator (dynamic stack: AuthStack or MainStack)
```

## Navigation Architecture

### Entry Point: `App.js`

- Wraps children with:
  - `AuthProvider`: Handles authentication state and actions.
  - `UserProvider`: Manages user profile state.
  - `NavigationContainer`: Core navigation context from React Navigation.

### Dynamic Stack Navigation: `AppNavigator`

- Uses the `useAuth()` hook to check authentication state.
- Displays a loading spinner during initialization.
- Chooses stack:
  - If `currentUser` is null: renders `AuthStack`
  - If authenticated: renders `MainStack`

#### Example Pseudocode

```js
if (loading) return <ActivityIndicator />;
else if (currentUser) return <MainStack />;
else return <AuthStack />;
```

### Auth Stack: `component/Navigation/AuthStack.js`

Manages unauthenticated screens:
- `FirstScreen`: Welcome or onboarding.
- `SignUpScreen`: New user registration.
- `SignInScreen`: User login.

```js
<AuthStack>
  [FirstScreen] → [SignUpScreen] ↔ [SignInScreen]
</AuthStack>
```

### Main Stack: `component/Navigation/MainStack.js`

Main navigation for authenticated users, via a bottom tab navigator:
- **HomeScreen**: Dashboard.
- **BrowseScreen**: Browse habits.
- **ProfileScreen**: User profile.

Icons are imported SVGs for each tab.

```js
<MainStack>
  [HomeScreen] [BrowseScreen] [ProfileScreen]
</MainStack>
```

## Context Architecture

### Authentication Context: `context/AuthContext.js`

Provides:
- `currentUser`: Current user state.
- `signUp(email, password)`: Registers user via Firebase.
- `signIn(email, password)`: Logs in via Firebase.
- `resetPassword(email)`: Sends password reset email.
- `logOut()`: Signs out.
- `loading`: Boolean for async status.

#### Usage Example

```js
const { signIn, currentUser } = useAuth();
await signIn('user@example.com', 'password');
```

### User Profile Context: `context/UserContext.js`

Provides:
- Real-time sync of user profile from Firestore.
- Context value: `profile` object.

Upon authentication, listens to the Firestore `users/<uid>` document for profile changes.

#### Usage Example

```js
const { profile } = useUser();
console.log(profile.username); // Access profile fields
```

## Data Flow Summary

- **Authentication:** Managed and tracked globally. UI responds to auth status.
- **User Profile:** Automatically listens for updates when authenticated.
- **Navigation:** Auth state decides which stack is shown. Authenticated users get main features, unauthenticated see login/signup screens.

## Extending the Architecture

- Add more screens to `AuthStack` or `MainStack` by modifying their respective files.
- To access authentication or user data in any component, use `useAuth()` or `useUser()` hooks.

## References

- [React Navigation Docs](https://reactnavigation.org/)
- [React Context API](https://react.dev/reference/react/useContext)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)

---

This guide provides the foundational layout for navigation and context. For feature implementation details, see the relevant screen and service/component files.