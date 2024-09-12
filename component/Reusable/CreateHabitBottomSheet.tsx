import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import CustomBackdrop from "../../component/Reusable/CustomBackdrop";
import CustomHandle from "../../component/Reusable/CustomHandle";
import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { HabitsType } from "../../types/habits";
import Button from "./Button";
import { useUser } from "../../context/UserContext";

export default function CreateHabitBottomSheet() {
  const { profile } = useUser();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["20%", "70%"], []);
  const [habits, setHabits] = useState<HabitsType[]>([]);

  const handleInputChange = (text: string) => {
    console.log(text);

    const habits = text
      .split(",")
      .map((habit) => ({ name: habit, user: profile.firstName }));
    setHabits(habits);
  };

  const handleBackdropPress = useCallback((behavior) => {
    if (behavior === "close") {
      bottomSheetRef.current?.close();
    } else if (behavior === "collapse") {
      bottomSheetRef.current?.collapse();
    }
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
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
        <Text style={styles.title}>Ajouter une habitude</Text>
        <View>
          <Text style={styles.subTitle}>Nom de l'habitude</Text>
          <Text style={styles.paraText}>
            Sépare les habitudes par des virgules
          </Text>
          <TextInput
            placeholderTextColor={"grey"}
            style={styles.input}
            placeholder="méditer,faire un popo,boire de l'eau"
            onChangeText={(text) => handleInputChange(text)}
          ></TextInput>
        </View>
        <Text style={styles.subTitle}>Habitude à ajoutées :</Text>
        {habits.map((habit) => (
          <Text style={styles.habit} key={habit.id}>
            {habit.name}
          </Text>
        ))}
        <View style={{ flex: 1 }}></View>
        <View style={styles.buttonContainer}>
          <Button title="+ Ajouter l'habitude"></Button>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor: "#FCF8F5",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderColor: "#BBB5B5",
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  paraText: {
    fontSize: 12,
    color: "#4E4E4E",
    fontWeight: "500",
    marginBottom: 10,
  },
  buttonContainer: {
    width: "90%",
    marginHorizontal: "auto",
  },
  habit: {
    backgroundColor: "#F3EFEE",

    padding: 10,
    textAlign: "center",
    borderRadius: 5,
  },
});
