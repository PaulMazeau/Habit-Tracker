# Routing & Navigation Guide

This guide provides an overview of the navigation and routing structure in the Habit Tracker app. It covers authentication flow, main app navigation, and actionable tips for Screen and navigation management.

---

## Overview

The navigation is built with React Navigation, leveraging both stack and tab navigators:

- **Authentication flow**: Users are shown authentication screens (onboarding, sign in, sign up) when not logged in.
- **Main application flow**: Logged-in users access the app via a tab-based navigation (Home, Browse, Profile).

---

## Navigation Structure

### 1. App Entry Point (`App.js`)

The root component determines which navigation stack to render based on the user's authentication state.

```js
return (
  <Stack.Navigator>
    {currentUser ? (
      <Stack.Screen 
        name="Main" 
        component={MainStack} 
        options={{ headerShown: false }}
      />
    ) : (
      <Stack.Screen
        name="Auth"
        component={AuthStack}
        options={{ headerShown: false }}
      />
    )}
  </Stack.Navigator>
);
```

- **Authenticated**: Renders the main app navigation (`MainStack`).
- **Not Authenticated**: Renders authentication screens (`AuthStack`).

---

### 2. Authentication Stack (`component/Navigation/AuthStack.js`)

Handles onboarding and authentication screens as a stack navigator.

**Screens included:**
- FirstScreen (welcome screen)
- SignUpScreen
- SignInScreen

```js
<MainNavigation.Navigator initialRouteName="FirstPage" screenOptions={{ headerShown: false }}>
  <MainNavigation.Screen name="FirstScreen" component={FirstScreen} />
  <MainNavigation.Screen name="SignUp" component={SignUpScreen} />
  <MainNavigation.Screen name="SignIn" component={SignInScreen} />
</MainNavigation.Navigator>
```

**Navigation Example:**

To go from the welcome screen to Sign Up or Sign In:

```js
<Button 
  title="Inscription"
  onPress={() => navigation.navigate('SignUp')}
  color="#4CAF50"
/>

<Button 
  title="Connexion"
  onPress={() => navigation.navigate('SignIn')}
  color="#2196F3"
/>
```

---

### 3. Main App Stack (`component/Navigation/MainStack.js`)

Implements a bottom tab navigator for authenticated users.

**Tabs:**
- HomeScreen
- BrowseScreen
- ProfileScreen

```js
<Tab.Navigator 
  initialRouteName={"HomeScreen"}
  screenOptions={{
    headerShown: false,
    tabBarShowLabel: false,
    tabBarStyle: {
      backgroundColor: "gray",
      display: "flex",
    },
  }}
>
  <Tab.Screen 
    name="HomeScreen" 
    component={HomeScreen}
    options={{ tabBarIcon: () => <Home stroke={'black'} width={24} height={24} /> }} 
  />
  <Tab.Screen 
    name="BrowseScreen" 
    component={BrowseScreen}
    options={{ tabBarIcon: () => <Browse stroke={'black'} width={24} height={24} /> }} 
  />
  <Tab.Screen 
    name="ProfileScreen" 
    component={ProfileScreen}
    options={{ tabBarIcon: () => <Profile stroke={'black'} width={24} height={24} /> }} 
  />
</Tab.Navigator>
```

---

## Example: Redirect After Sign Up / Sign In

When a user successfully signs up or signs in, they are navigated to the main app tab navigator, resetting the navigation history:

```js
navigation.reset({
  index: 0,
  routes: [{ name: 'Main' }],
});
```

---

## Screen Navigation Usage

- Use `navigation.navigate('ScreenName')` to move to another screen in the same stack.
- Use `navigation.goBack()` to return to the previous screen.
- Use `navigation.reset()` to replace the navigation history, useful after authentication.

---

## Customization Tips

- Customize screen headers and tab icons via options in the navigator.
- Pass parameters between screens using the second argument in `navigate`:
  
  ```js
  navigation.navigate('ProfileScreen', { userId: 1234 });
  ```

---

## Additional Resources

- [React Navigation Documentation](https://reactnavigation.org/)
- For troubleshooting navigation, check the device logs and confirm screen names match in stacks.

---

## Summary Table

| Stack                | Screens/Routes                               | Main Purpose            |
|----------------------|----------------------------------------------|------------------------|
| AuthStack            | FirstScreen, SignUp, SignIn                  | Authentication flow    |
| MainStack (Tabs)     | HomeScreen, BrowseScreen, ProfileScreen      | App main navigation    |

---

This navigation system ensures a streamlined onboarding experience and easy transition between key app functionalities for authenticated users. Refer to the code examples above to add new screens and routes in your feature development.