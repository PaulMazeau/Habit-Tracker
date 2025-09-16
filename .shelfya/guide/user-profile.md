# User Profile Guide

This guide explains how user profiles work in the Habit Tracker app, how to access user profile data in your components, and where to view profile information in the app interface.

---

## How User Profile Data Works

User profile information is managed via a React context (`UserContext`) which fetches user data in real-time from Firestore. This ensures that any changes to the user profile are immediately reflected in the app.

### Data Flow

- On authentication, the app listens to changes in the Firestore document for the logged-in user.
- User data is stored in the `profile` object and made available throughout the app via the `useUser` hook.

---

## Accessing Profile Data in Components

To use the user's profile information in your React components, use the `useUser` hook provided by `UserContext`.

```js
import { useUser } from '../context/UserContext';

const { profile } = useUser();

console.log(profile.FirstName, profile.LastName); // Access user data fields
```

**Example in `HomeScreen`:**

```js
const { profile } = useUser();

<Text>Bienvenue {profile.FirstName} {profile.LastName}</Text>
```

This will display a personalized welcome message using fields from the user's profile.

---

## Profile Information in the App

- **Home Screen:** Displays the user's first and last name as a greeting.
- **Profile Screen:** Currently displays only a static title. (Future updates may expand this screen's functionality.)

---

## Updating User Profile

The current implementation fetches and displays user profile data but does not include profile editing features in the UI. User data is expected to be modified either through other app features or directly in Firestore.

---

## Related Files

- `context/UserContext.js`: Handles profile context and data fetching.
- `screens/HomeScreen.js`: Shows a personalized message using user profile data.
- `screens/ProfileScreen.js`: Placeholder for future profile features.

---

## More Resources

- [React Context Documentation](https://react.dev/reference/react/createContext)
- [Firebase Firestore Realtime Updates](https://firebase.google.com/docs/firestore/query-data/listen)

For further support, contact the project maintainers or visit the [project repository](https://github.com/PaulMazeau/Habit-Tracker).