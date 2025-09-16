# User Profile Guide

Learn how the user profile works in the Habit Tracker app, how to view your profile information, and where it's used in the application.

## What Is the User Profile?

Your user profile contains personal information retrieved from Firebase, such as your first and last name. This profile is securely managed while you're logged in.

## How the Profile Is Loaded

After successful authentication, your profile data is automatically loaded from Firebase Firestore using your unique user ID (`uid`). This ensures your information is kept up-to-date in real time.

### Profile Data Example

The typical profile object includes:

```json
{
  "FirstName": "Alice",
  "LastName": "Smith",
  "uid": "Xyz123Abc"
}
```

## Viewing Your Profile

On the **Home Screen**, you will see a personalized greeting using your profile data:

```jsx
<Text>Bienvenue {profile.FirstName} {profile.LastName}</Text>
```

**Example Output:**
```
Bienvenue Alice Smith
```

## Updating/Editing Your Profile

Currently, the app automatically fetches your latest profile from Firebase. Editing your profile in-app is not yet supported.

## Logging Out

On the Home Screen, you can log out by pressing the **Déconnexion** (Log Out) button:
```jsx
<Button
  title="Déconnexion"
  onPress={handleSignOut}
/>
```
This will safely sign you out and redirect you to the authentication screen.

## Technical Integration

The profile data is managed globally using React Context.
- Use the custom hook `useUser()` in any component to access the current user's profile:

```js
import { useUser } from '../context/UserContext';
const { profile } = useUser();
```

## Troubleshooting

- If the greeting doesn't show your name, your profile info may not be set in Firestore.
- Unexpected sign out or profile errors may indicate authentication issues; try logging in again.

## Need Help?

For issues with your profile, check your account details in Firebase or contact support. More features around editing profiles may be added in future updates.

---

Return to [Home Screen](../screens/HomeScreen.js) or learn more about [Authentication](../context/AuthContext.js).