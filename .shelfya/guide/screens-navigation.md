# Screens & Navigation

This guide provides an overview of the main screen flows and navigation patterns in the Habit Tracker app, including authentication and post-auth screens.

## Overview

The app uses React Navigation to manage screen transitions:

- **Authentication stack (AuthStack)** is used for onboarding, sign in, and registration.
- **Main stack (MainStack)** is used for the main app experience after logging in, organized as a bottom tab navigator.

---

## Authentication Flow

### AuthStack

Defined in [`component/Navigation/AuthStack.js`](../../component/Navigation/AuthStack.js):

```js
<MainNavigation.Navigator initialRouteName="FirstPage" screenOptions={{ headerShown: false }}>
  <MainNavigation.Screen name="FirstScreen" component={FirstScreen} />
  <MainNavigation.Screen name="SignUp" component={SignUpScreen} />
  <MainNavigation.Screen name="SignIn" component={SignInScreen} />
</MainNavigation.Navigator>
```

**Screens:**

- **FirstScreen**: Welcome page, offers options to sign up or log in.
- **SignUp**: Registration form for new users.
- **SignIn**: Login form for existing users.

#### Navigation Example

On the FirstScreen:

```js
<Button 
  title="Inscription"
  onPress={() => navigation.navigate('SignUp')}
/>
<Button 
  title="Connexion"
  onPress={() => navigation.navigate('SignIn')}
/>
```

On successful login or sign up, the app navigates to the MainTab by resetting the navigation stack:

```js
navigation.reset({
  index: 0,
  routes: [{ name: 'Main' }],
});
```

---

## Main App Flow

### MainStack

Defined in [`component/Navigation/MainStack.js`](../../component/Navigation/MainStack.js):

```js
<Tab.Navigator initialRouteName={"HomeScreen"}>
  <Tab.Screen 
    name="HomeScreen" 
    component={HomeScreen}
    options={{ tabBarIcon: ... }} 
  />
  <Tab.Screen 
    name="BrowseScreen" 
    component={BrowseScreen}
    options={{ tabBarIcon: ... }} 
  />
  <Tab.Screen 
    name="ProfileScreen" 
    component={ProfileScreen}
    options={{ tabBarIcon: ... }} 
  />
</Tab.Navigator>
```

This uses a bottom tab bar **without labels**, with custom icons for Home, Browse, and Profile.

**Screens:**

- **HomeScreen**: Main dashboard.
- **BrowseScreen**: Explore or search habits.
- **ProfileScreen**: User profile and settings.

---

## Screen Reference

### `FirstScreen`

- Entry point for new users.
- Options: "Inscription" (Sign up), "Connexion" (Log in).

### `SignUpScreen`

- User registration.
- Validates user input (first name, last name, email, password).
- On successful registration:
  - User info is stored in Firestore.
  - Navigates to main app tab stack.

### `SignInScreen`

- User login.
- Validates email and password.
- On successful authentication, navigates to the main app tab stack.
- Offers password reset and alternative to go to sign up.

---

## Navigation Structure Diagram

```
AuthStack (Stack Navigator)
│
├── FirstScreen
│    ├── SignUpScreen
│    └── SignInScreen
│
└── MainStack (Bottom Tab Navigator)
     ├── HomeScreen
     ├── BrowseScreen
     └── ProfileScreen
```

---

## Best Practices

- Use `navigation.navigate` for screen transitions within the authentication flow.
- Use `navigation.reset` after sign-in/sign-up to prevent users from returning to the authentication screens using the back button.
- Customize each screen's header and appearance using `screenOptions`.

---

## Resources

- [React Navigation Documentation](https://reactnavigation.org/)
- [Main AuthStack.js Source](../../component/Navigation/AuthStack.js)
- [Main MainStack.js Source](../../component/Navigation/MainStack.js)

---

For questions or suggestions about navigation and screens, feel free to open an issue or check the source files linked above.