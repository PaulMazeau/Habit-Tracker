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
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useUser } from "../../context/UserContext";
import { Habits } from "../../types/habits";
import SwipeableItem from "./SwipeableItem";
import { deleteHabit, addHabit, updateHabit } from "../../services/habits";
import { FB_AUTH, FB_DB } from "../../firebaseconfig";

interface Props {
  habits: Habits[];
}

const App = ({ habits }: Props) => {
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
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
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
      deleteHabit(FB_AUTH.currentUser, FB_DB, id);
    }
  };

  const handleAddHabits = () => {
    // Filter new habits that are not already in the database
    const filteredHabits = newHabits.filter(
      (habit) => !habits.some((h) => h.name === habit.name)
    );
    filteredHabits.forEach((habit) => {
      addHabit(FB_AUTH.currentUser, FB_DB, { name: habit.name });
    });
    setInputValue("");
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current?.close();
  };

  useEffect(() => {
    setNewHabits(habits);
  }, [habits]);

  // renders
  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handlePresentModalPress}
        >
          <Text style={styles.addButtonText} onPress={handleAddHabits}>
            + Ajouter une habitude
          </Text>
        </TouchableOpacity>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
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
                placeholder="méditer,faire un popo,boire de l'eau"
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
                ></SwipeableItem>
              </View>
            ))}
            <View style={{ flex: 1 }}></View>
            <View style={styles.buttonContainer}>
              {/* Ferme la BottomSheet quand on clique sur "Ajouter l'habitude" */}
              <Button title="+ Ajouter l'habitude" onPress={closeBottomSheet} />
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
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
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    flex: 1,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#172ACE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
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
    width: "90%",
    marginHorizontal: "auto",
    backgroundColor: "#0049AC",
    borderRadius: 13,
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 20,
  },
  habit: {
    backgroundColor: "#F3EFEE",
    padding: 10,
    textAlign: "center",
    borderRadius: 5,
  },
});

export default App;
