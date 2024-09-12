import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useUser } from "../../context/UserContext";
import { Habits } from "../../types/habits";
import AddButton from "../../assets/icons/AddButton.svg";

import SwipeableItem from "./SwipeableItem";
import { deleteHabit, addHabit, updateHabit } from "../../services/habits";
import { FB_AUTH, FB_DB } from "../../firebaseconfig";

interface Props {
  habits: Habits[];
  userHabitId: string;
}

const CreateHabitBottomSheet = ({ habits, userHabitId }: Props) => {
  const { profile } = useUser();
  const [newHabits, setNewHabits] = useState<
    Pick<Habits, "user" | "name" | "id">[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "80%"], []);

  // callbacks
  const handlePresentModalPress = () => bottomSheetModalRef.current?.present();

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleInputChange = (text: string) => {
    const newHabits = text
      .split(",")
      .map((habit) => ({ name: habit.trim(), user: profile.uid })) as Pick<
      Habits,
      "user" | "name" | "id"
    >[];
    setInputValue(text);
    setNewHabits([...habits, ...newHabits]);
  };

  const handleDelete = (name: string, id?: string) => {
    console.log("delete", id, name);

    const filterKey = id ? "id" : "name";
    const filterValue = name || id;

    const filteredHabits = newHabits.filter(
      (habit) => habit[filterKey] !== filterValue
    );

    const inputValue = filteredHabits
      .filter((habit) => !habits.some((h) => h.id === habit.id))
      .map((habit) => habit.name)
      .join(",");

    setNewHabits([...filteredHabits]);
    setInputValue(inputValue);

    if (filterKey === "id") {
      // delete habit from database
      console.log(id);
      deleteHabit(FB_AUTH.currentUser, FB_DB, id, userHabitId);
    }
  };

  const handleAddHabits = () => {
    // Filter new habits that are not already in the database
    const filteredHabits = newHabits.filter(
      (habit) => !habits.some((h) => h.name === habit.name)
    );
    filteredHabits.forEach((habit) => {
      addHabit(FB_AUTH.currentUser, FB_DB, { name: habit.name }, userHabitId);
    });
    setInputValue("");
  };

  const closeBottomSheet = () => {
    handleAddHabits();
    bottomSheetModalRef.current?.close();
  };

  useEffect(() => {
    setNewHabits(habits);
  }, [habits]);

  // renders
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={handlePresentModalPress}
      >
        <AddButton />
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        style={{ zIndex: 1000 }}
        snapPoints={snapPoints}
        handleComponent={null}
        onChange={handleSheetChanges}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
          />
        )}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.title}>Ajouter une habitude</Text>
          <View>
            <Text style={styles.subTitle}>Nom de l'habitude</Text>
            <Text style={styles.paraText}>
              Sépare les habitudes par des virgules
            </Text>
            <TextInput
              placeholderTextColor={"grey"}
              style={styles.input}
              placeholder="méditer, pouette, boire de l'eau"
              onChangeText={handleInputChange}
              value={inputValue}
            />
          </View>
          <Text style={styles.subTitle}>Habitudes à ajouter :</Text>
          {newHabits.map((habit, index) => (
            <View key={index}>
              <SwipeableItem
                item={habit}
                onDelete={() => handleDelete(habit.name, habit.id)}
                enableEdit={habits.includes(habit)}
                userHabitId={userHabitId}
              ></SwipeableItem>
            </View>
          ))}
          <View style={{ flex: 1 }}></View>
          <View>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={closeBottomSheet}
            >
              <Text style={styles.buttonText}>+ Ajouter l'habitude</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor: "#FCF8F5",
    borderRadius: 20,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    flex: 1,
  },
  addButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderColor: "#BBB5B5",
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
  },
  paraText: {
    fontSize: 12,
    color: "#4E4E4E",
    fontWeight: "500",
    marginBottom: 10,
  },
  buttonContainer: {
    width: "95%",
    marginHorizontal: "auto",
    backgroundColor: "#0049AC",
    borderRadius: 13,
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 50,
    height: 48,
    fontWeight: "600",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  habit: {
    backgroundColor: "#F3EFEE",
    padding: 10,
    textAlign: "center",
    borderRadius: 5,
  },
});

export default CreateHabitBottomSheet;
