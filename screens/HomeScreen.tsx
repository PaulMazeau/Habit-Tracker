import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FB_AUTH, FB_DB } from "../firebaseconfig";
import { signOut } from "firebase/auth";
import { useUser } from "../context/UserContext";
import { getHabits } from "../services/habits";
import { HabitsType } from "../types/habits";
import CreateHabitBottomSheet from "../component/Reusable/CreateHabitBottomSheet";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { profile } = useUser(); // Utiliser le hook useUser pour accéder au profil
  const [habits, setHabits] = useState<HabitsType[]>([]);

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
      <Text style={{ fontFamily: "Geist" }}>HomePage 12345</Text>
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
});
