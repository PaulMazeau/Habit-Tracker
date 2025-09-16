# Theming & Layout Guide

This guide explains the theming and layout principles used in the Habit Tracker application, focusing on consistent color usage, layout structures, and reusable components. It is intended for both developers and designers who want to maintain visual consistency across screens or extend the current look and feel.

---

## Color Palette

### Main Colors

- **Primary background:** `black` (used for authentication screens) and `#fff` (white, used for the main application/home).
- **Primary text:** `white` or `#333` depending on background.
- **Action buttons:**
  - Registration: `#4CAF50` (green)
  - Login: `#2196F3` (blue)
  - Other buttons: usually `white` or `#172ACE` (Facebook)
- **Error text:** `red`

### Example

```js
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Auth screens
  },
  text: {
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
  },
});
```

---

## Layout Basics

- **Containers**: Screens typically use `flex: 1` to fill the available space, aligning content to the center for onboarding (see `FirstScreen.js`) and to the top/left for sign-in/sign-up forms.
- **Margins & Paddings:** Most elements, such as buttons and text inputs, are given horizontal margins of 10% or `marginLeft: '10%'` to ensure generous horizontal whitespace.
- **Rounded Corners:** Input fields and buttons use `borderRadius: 10` for a friendly, modern appearance.

### Example: Form Layout

```js
<View style={styles.main}>
  <TextInput style={styles.input} placeholder="Email" />
  <TextInput style={styles.input} placeholder="Password" secureTextEntry />
  <TouchableOpacity style={styles.button}><Text>Login</Text></TouchableOpacity>
</View>
```

---

## Buttons

- **Primary action:** Large, wide buttons (80% width) with prominent background color (usually white on dark backgrounds).
- **Secondary action:** Text buttons styled as links, usually only changing text color.

### Button Example

```js
<TouchableOpacity style={styles.button}>
  <Text>S'inscrire</Text>
</TouchableOpacity>
```

---

## Text Inputs

All input fields are styled with:
- White text on black background
- Bottom-only white border
- Rounded corners
- Large font for legibility
 
### Example

```js
<TextInput
  style={styles.input}
  placeholder="Email"
  placeholderTextColor="rgba(255, 255, 255, 0.7)"
/>
```

---

## Reusable Components

### Header

A simple reusable header component is available:

```jsx
import Header from '../component/Reusable/Header';

<Header />
```

By default, it uses a white background and a fixed height of 44.

---

## Example: Consistent Theming Across Screens

**Welcome Screen (`FirstScreen.js`):**
- Light background (`#F5F5F5`)
- Centered layout for onboarding

**Auth Screens (`SignInScreen.js`, `SignUpScreen.js`):**
- Dark (black) background
- White text fields and buttons
- Inputs and buttons are consistently laid out and spaced

**Home Screen (`HomeScreen.js`):**
- Light background (`#fff`)
- Centered greeting text

---

## Customizing the Theme

To apply your theme globally, centralize your color and spacing variables. Consider creating a `theme.js`:

```js
export const COLORS = {
  background: 'black',
  primary: '#4CAF50',
  secondary: '#2196F3',
  error: 'red',
  white: '#fff',
};
```

Update your styles to use these variables for consistency and maintainability.

---

## Tips

- Use percentage-based widths and margins for responsiveness.
- Group shared styles (e.g., button, input) for reuse.
- Always use meaningful color contrasts for accessibility (e.g., white on black).

---

For deeper customization or new components, follow the examples above to maintain cohesive design across all screens. If you introduce new components, ensure to match the structure and color usage shown here.