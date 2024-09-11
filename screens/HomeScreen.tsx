import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FB_AUTH, FB_DB } from "../firebaseconfig";
import { signOut } from "firebase/auth";
import { useUser } from "../context/UserContext";
import { getHabits } from "../services/habits";
import { HabitsType } from "../types/habits";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import CustomBackdrop from "../component/Reusable/CustomBackdrop";
import CustomHandle from "../component/Reusable/CustomHandle";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { profile } = useUser(); // Utiliser le hook useUser pour accéder au profil
  const [habits, setHabits] = useState<HabitsType[]>([]);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["10%", "50%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

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

  const handleBackdropPress = useCallback((behavior) => {
    if (behavior === "close") {
      bottomSheetRef.current?.close();
    } else if (behavior === "collapse") {
      bottomSheetRef.current?.collapse();
    }
  }, []);

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
      <Text style={{ fontFamily: "Geist" }}>HomePage</Text>
      <Text>
        Bienvenue {profile.FirstName} {profile.LastName}
      </Text>
      {habits.map((habit) => (
        <Text key={habit.id}>{habit.name}</Text>
      ))}
      <Button title="Déconnexion" onPress={handleSignOut} />
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={(props) => (
          <CustomBackdrop
            {...props}
            pressBehavior="collapse"
            onPress={handleBackdropPress}
          />
        )}
        handleComponent={CustomHandle}
      >
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheet>
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
