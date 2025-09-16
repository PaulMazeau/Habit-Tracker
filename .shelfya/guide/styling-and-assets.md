# Styling and Assets Guide

This guide explains how to customize the look and feel of your Habit Tracker app, including styling patterns and how to handle or add assets.

---

## Styling Conventions

The app leverages **React Native's `StyleSheet`** for styling its screens and components. Styles are defined within each file, following a flat style object pattern.

**Key Points:**

- Colors, spacing, font sizes, and alignment are handled via standard React Native styles.
- The primary color themes used are black (for backgrounds) and white (for text and borders), supporting a clean, dark-themed look.
- Error messages and interactive elements (e.g., buttons) have distinct visual cues.

### Example: Styling for Input and Error Message

```js
const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 10,
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
    width: '80%',
    marginLeft: '10%',
    marginRight: '10%'
  },
  errorText: {
    fontSize: 13,
    color: 'red',
    marginLeft: '10%',
    marginBottom: 5,
  },
});
```

**Reusable Patterns:**

- **Containers:** Use `flex: 1` for filling the screen.
- **Buttons:** Use white backgrounds for primary buttons and maintain horizontal centering with margins.
- **Alignment:** Most horizontal margins are handled with percentage widths and `marginLeft`/`marginRight` for consistency across screen sizes.

---

## Adding and Using Visual Assets

Assets (such as images and icons) should reside in the `assets/` directory at the root of your project.

**To add an asset:**

1. Place your asset file (PNG, JPG, SVG, etc.) inside the `assets/` folder.

**To use an asset in a component:**

```js
import { Image } from 'react-native';
// For instance, to use a logo.png file:
<Image source={require('../assets/logo.png')} style={{ width: 100, height: 100 }} />
```

*Adjust the path as needed, relative to the importing file.*

---

## Customizing Styles

To customize the style of a screen or component:

1. **Edit the StyleSheet** at the end of the relevant file (e.g., `SignUpScreen.js` or `SignInScreen.js`).
2. **Change color values, font sizes, and spacing** as needed to suit your design preferences.
3. **Reuse style objects** by extracting common style elements if needed.

---

## Example: Header Component

The reusable `Header` component (`component/Reusable/Header.js`) is also styled with a local `StyleSheet`.

```js
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: 44,
  },
});

// Usage:
<View style={styles.container}>
  <Text>Ceci est le header</Text>
</View>
```

Modify or replace the background color and sizing as needed.

---

## Best Practices

- **Keep styles close to components:** This improves readability and encapsulation.
- **Use absolute or percentage dimensions** thoughtfully to maximize cross-device compatibility.
- **Leverage `placeholderTextColor`** in TextInputs for improved UI clarity.
- Follow React Native [StyleSheet documentation](https://reactnative.dev/docs/stylesheet) for advanced techniques.

---

## Troubleshooting

- If an asset is not displaying, ensure the file path is correct and the file is present in the `assets/` directory.
- For consistent looks, verify colors and font sizes are harmonized across different components.

---

## Further Reading

- [React Native Styling docs](https://reactnative.dev/docs/style)
- [React Native Images and Asset Management](https://reactnative.dev/docs/images)

Feel free to edit the relevant screen or component file to adjust styles or add assets as your project grows!