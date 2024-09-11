import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useUser } from "../context/UserContext";
import { FB_AUTH, FB_DB } from "../firebaseconfig";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Button from '../component/Reusable/Button';
import Header from '../component/Reusable/Header';

export default function ProfileScreen() {
  const { profile } = useUser();
  const navigation = useNavigation();

  const handleSignOut = () => {
    signOut(FB_AUTH)
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Auth" }],
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion:", error);
      });
  };

  return (
      <View style={styles.body}>
        <Header title={`${profile.FirstName} ${profile.LastName}`}/>
        <View style={styles.container}>
        <Text style={styles.subtitle}>Mes Statistiques</Text>
        <Text style={styles.subtitle}>Mes Badges</Text>
        <Button title="Déconnexion" onPress={handleSignOut} />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#FCF8F5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
  }
});
