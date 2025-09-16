# Application Architecture

This document provides an overview of the Habit Tracker app's architecture, focusing on how navigation, authentication, and user management are structured and interconnected.

---

## Overview

The app is built using React Native. Its structure separates concerns between authentication, primary app navigation, and user data, ensuring a clean and maintainable design.

```
App.js
│
├── AuthProvider (context/AuthContext)
│   └── UserProvider (context/UserContext)
│       └── NavigationContainer
│           └── AppNavigator
│               ├── MainStack (when authenticated)
│               └── AuthStack (when not authenticated)
```

---

## Navigation Flow

### Root Navigation

- **AppNavigator:**  
  Determines if the user is authenticated via `useAuth()`.
  - If loading, shows `ActivityIndicator`.
  - If logged in: displays the authenticated main app stack.
  - If not: displays the authentication flow stack.

### Authenticated Stack (`MainStack`)

- Rendered after successful authentication.
- Uses a bottom tab navigator with:
  - **HomeScreen:** Shows habit-related content.
  - **BrowseScreen:** Explore habits or community.
  - **ProfileScreen:** Manage user profile.
- Each tab displays an SVG icon (Home, Browse, Profile).

Example:
```js
<Tab.Screen 
  name="HomeScreen" 
  component={HomeScreen}
  options={{
    tabBarIcon: () => <Home stroke={'black'} width={24} height={24} />,
  }} 
/>
```

### Authentication Stack (`AuthStack`)

- Shown when the user is not authenticated.
- Uses stack navigation for:
  - **FirstScreen:** Landing or welcome page.
  - **SignUpScreen:** Registration form.
  - **SignInScreen:** Login form.

Example:
```js
<MainNavigation.Screen name="SignUp" component={SignUpScreen} />
```

---

## Authentication Context (`AuthContext`)

Handles all authentication logic. Wraps the app so any component can access authentication state and methods.

**Responsibilities:**
- Monitors auth state via Firebase.
- Exposes methods:
  - `signUp(email, password)`
  - `signIn(email, password)`
  - `logOut()`
  - `resetPassword(email)`
- Tracks `currentUser` and `loading` state.

**Usage:**
```js
const { currentUser, signIn, signUp, logOut } = useAuth();
```

- `AuthProvider` wraps the entire app in `App.js`.

---

## User Context (`UserContext`)

Manages user-specific profile data from Firestore.

**Responsibilities:**
- Hooks to authenticated user's Firestore document.
- Updates local profile state in real time.
- Makes user data available across the app.

**Usage:**
```js
const { profile } = useUser();
```

- `UserProvider` is nested inside `AuthProvider` to guarantee an authenticated user is available.

---

## Component Hierarchy

```js
<AuthProvider>
  <UserProvider>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  </UserProvider>
</AuthProvider>
```

- **AuthProvider:** Handles authentication state.
- **UserProvider:** Handles user profile/firestore data.
- **NavigationContainer:** Hosts the navigation state and stacks.

---

## Extending the Architecture

- **Add new screens** by updating the appropriate stack (e.g., MainStack for authenticated features).
- **Access current user or profile** in any child component using `useAuth()` or `useUser()` hooks.
- **Protect routes** based on authentication or user role by conditionally rendering screens in navigators.

---

## References

- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started/)
- [React Context API](https://react.dev/reference/react/createContext)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)

---

This architecture enables a modular, scalable, and efficient foundation for the Habit Tracker app, ensuring a responsive and consistent user experience.