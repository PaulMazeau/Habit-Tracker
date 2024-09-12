import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import Button from "../component/Reusable/Button";
import { useNavigation } from "@react-navigation/native";
import { FB_AUTH, FB_DB } from "../firebaseconfig";
import { signOut } from "firebase/auth";
import { useUser } from "../context/UserContext";
import {
  addHabit,
  deleteHabit,
  getHabits,
  updateHabit,
} from "../services/habits";
import { Habits } from "../types/habits";
import CreateHabitBottomSheet from "../component/Reusable/CreateHabitBottomSheet";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { profile } = useUser(); // Utiliser le hook useUser pour accéder au profil
  const [habits, setHabits] = useState<Habits[]>([]);

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
      unsubscribe = getHabits(profile, FB_DB, (fetchedHabits) => {
        setHabits(fetchedHabits);
      });
    }

    return () => unsubscribe();
  }, [profile]);

  return (
    <View style={styles.container}>
      <Text>
        Bienvenue {profile.FirstName} {profile.LastName}
      </Text>
      {habits.map((habit) => (
        <Text key={habit.id}>{habit.name}</Text>
      ))}
      <Button title="Déconnexion" onPress={handleSignOut} />
      <CreateHabitBottomSheet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    backgroundColor: "#FCF8F5",
    flex: 1,
    alignItems: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
