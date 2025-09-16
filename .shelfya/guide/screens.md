# Application Screens Guide

This guide explains the main screens of the Habit Tracker application, summarizes their purpose, and introduces the user flows. Each screen fulfills a key role in the core experience of tracking habits and managing user profiles.

## Overview of Screens

| Screen Name    | Purpose                                       |
|----------------|-----------------------------------------------|
| FirstScreen    | Welcome and initial navigation                |
| SignUpScreen   | Account creation for new users                |
| SignInScreen   | User authentication (login)                   |
| HomeScreen     | Main dashboard after login                    |
| BrowseScreen   | Placeholder for exploring content             |
| ProfileScreen  | Placeholder for user profile information      |

---

## FirstScreen

**Purpose:**  
The initial landing screen welcoming users to the Habit Tracker app.

**Features:**
- Display a welcome message (`Bienvenue sur notre application!`)
- Two primary actions:
    - `Inscription` (Sign Up) navigates to account creation
    - `Connexion` (Sign In) navigates to login

**Example Navigation:**

```javascript
navigation.navigate('SignUp');
navigation.navigate('SignIn');
```

---

## SignUpScreen

**Purpose:**  
Allow new users to create an account.

**Features:**
- Input fields:
    - First Name
    - Last Name
    - Email
    - Password
- Displays validation errors for each field.
- Upon successful registration:
    - Stores user info in Firestore
    - Navigates to the main app (`Main`)
- Additional navigation options:
    - Go back to previous screen
    - Link to Sign In for existing users

**Sign Up Flow Example:**

```javascript
signUp(email, password)
.then((userCredential) => {
    // Add user details in Firestore
})
.then(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
});
```

---

## SignInScreen

**Purpose:**  
Authenticate returning users.

**Features:**
- Input fields:
    - Email
    - Password
- Error handling:
    - Displays validation errors
    - Shows message when credentials are invalid
- Upon successful login:
    - Navigates to the main app (`Main`)
- Additional navigation options:
    - Forgot password (navigates to `ForgotPassword`)
    - Link to Sign Up for new users
    - Go back to previous screen

**Sign In Flow Example:**

```javascript
signIn(email, password)
.then(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
});
```

---

## HomeScreen

**Purpose:**  
The dashboard after successful authentication.

**Features:**
- Welcomes user by first and last name (retrieved from profile context)
- Option to log out, which resets navigation to the auth screens

**Sign Out Example:**

```javascript
signOut(FB_AUTH)
.then(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
});
```

---

## BrowseScreen

**Purpose:**  
Placeholder screen where users may explore or search for content.

**Features:**
- Displays "BrowseScreen"
- No interactive elements in current implementation

---

## ProfileScreen

**Purpose:**  
Placeholder for showing and managing user profile information.

**Features:**
- Displays "ProfileScreen"
- No interactive elements in current implementation

---

## Navigating the Application

All screens use React Navigation. Generally, you move between screens by calling `navigation.navigate('ScreenName')` or resetting navigation on state changes such as login or logout.

For more information on navigation patterns, refer to the [React Navigation documentation](https://reactnavigation.org/docs/getting-started/).

---

## What Next?

- Start using the app from **FirstScreen**
- Create an account or sign in
- Explore future features in Browse and Profile screens as the app evolves

If you encounter issues signing up or signing in, verify your input and check for any displayed error messages. For further assistance, consult the main application README or reach out for support.