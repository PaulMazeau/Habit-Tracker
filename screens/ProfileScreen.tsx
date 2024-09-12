import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useUser } from "../context/UserContext";
import { FB_AUTH, FB_DB } from "../firebaseconfig";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Button from "../component/Reusable/Button";
import Header from "../component/Reusable/Header";
import { getCurrentStreak } from "../services/habits";

export default function ProfileScreen() {
  const { profile } = useUser();
  const navigation = useNavigation();
  const [currentStreak, setCurrentStreak] = useState(0);

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

  useEffect(() => {
    let unsubscribe = () => {};

    if (profile?.uid) {
      unsubscribe = getCurrentStreak(profile, FB_DB, (streak) => {
        // console.log(streak);
      });
    }

    return () => unsubscribe();
  }, [profile]);

  return (
    <View style={styles.body}>
      <Header title={`${profile.FirstName} ${profile.LastName}`} />
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
    backgroundColor: "#FCF8F5",
  },
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  button: {
    marginTop: 20,
  },
  checkbox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxIndicator: {
    width: 20,
    height: 20,
    backgroundColor: "transparent",
  },
  checked: {
    backgroundColor: "green",
  },
});
