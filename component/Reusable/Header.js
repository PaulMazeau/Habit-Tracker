import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function BrowseScreen() {
  return (
      <View style={styles.container}>
        <Text>Ceci est le header</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: 44,
  },
});
