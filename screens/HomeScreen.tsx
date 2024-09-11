import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Button from "../component/Reusable/Button";
import { useNavigation } from "@react-navigation/native";
import { FB_AUTH, FB_DB } from "../firebaseconfig";
import { signOut } from "firebase/auth";
import { useUser } from "../context/UserContext";
import { addHabit, getHabits } from "../services/habits";
import { Habits } from "../types/habits";

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
      <Button
        onPress={() =>
          addHabit(profile, FB_DB, {
            name: "Faire quelque chose de cool",
          })
        }
        title="HABITS"
      />
      <Text>
        Bienvenue {profile.FirstName} {profile.LastName}
      </Text>
      {habits.map((habit) => (
        <Text key={habit.id}>{habit.name}</Text>
      ))}
      <Button title="Déconnexion" onPress={handleSignOut} />
      {/* <CreateHabitBottomSheet /> */}
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
