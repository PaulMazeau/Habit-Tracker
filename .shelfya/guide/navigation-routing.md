# Navigation & Routing Guide

This guide explains how authentication and main navigation work in the Habit Tracker app, including how users are routed between screens depending on authentication status.

## Overview

Habit Tracker uses [React Navigation](https://reactnavigation.org/) to manage routing. The navigation structure includes:

- **AuthStack**: Shown to unauthenticated users (e.g. login, signup).
- **MainStack**: Shown to authenticated users (e.g. dashboard, profile).

Navigation automatically switches depending on the authentication state.

## Navigation Flow

The app distinguishes between authenticated and unauthenticated users using context providers. The main application component (`App.js`) wraps everything with these providers and sets up navigation accordingly.

```jsx
export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </UserProvider>
    </AuthProvider>
  );
}
```

### AppNavigator Logic

Inside `AppNavigator`, the navigation stack is conditionally rendered:

- If the user is **loading**, an activity spinner is shown.
- If the user is **authenticated**, `MainStack` is presented.
- If the user is **not authenticated**, `AuthStack` is shown.

```jsx
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

## Authentication Stack (`AuthStack`)

The `AuthStack` manages routes for onboarding and authentication screens.

- **FirstScreen**: The initial landing page.
- **SignUpScreen**: Registration form.
- **SignInScreen**: Login form.

#### Example

```jsx
<MainNavigation.Navigator initialRouteName="FirstScreen" screenOptions={{ headerShown: false }}>
  <MainNavigation.Screen name="FirstScreen" component={FirstScreen} />
  <MainNavigation.Screen name="SignUp" component={SignUpScreen} />
  <MainNavigation.Screen name="SignIn" component={SignInScreen} />
</MainNavigation.Navigator>
```

Users can transition between these screens, such as moving from the onboarding to signup or signin.

## Main Stack (`MainStack`)

Authenticated users access the main content area via a tab navigator:

- **HomeScreen**: Main dashboard.
- **BrowseScreen**: Explore features/habits.
- **ProfileScreen**: User profile and settings.

Tab icons are SVGs for clarity and modern UI.

#### Example

```jsx
<Tab.Navigator initialRouteName="HomeScreen" screenOptions={{
  headerShown: false,
  tabBarShowLabel: false,
  tabBarStyle: {
    backgroundColor: "gray",
    display: "flex",
  },
}}>
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

## Customization

- **Add screens:** To add a new screen, import it and add it as a route within either the `AuthStack` or `MainStack`.
- **Initial routes:** You can change `initialRouteName` to set default navigation.
- **Header options:** All headers are currently hidden for a fullscreen experience, but you can enable them per route via `options`.

## Resources

- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started/)
- [Creating Stack Navigators](https://reactnavigation.org/docs/stack-navigator/)
- [Bottom Tab Navigator](https://reactnavigation.org/docs/bottom-tab-navigator/)

---

This structure enables smooth and clear routing between onboarding/authentication and main app experiences, ensuring users see the appropriate screens at every stage.