import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useUser } from '../../context/UserContext';
import { Habits } from '../../types/habits';
import AddButton from '../../assets/icons/AddButton.svg';

const CreateHabitBottomSheet = () => {
  const { profile } = useUser();
  const [habits, setHabits] = useState<Pick<Habits, "user" | "name">[]>([]);
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '80%'], []);

  // callbacks
  const handlePresentModalPress = () => bottomSheetModalRef.current?.present();
  
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleInputChange = (text: string) => {
    const habits = text
      .split(",")
      .map((habit) => ({ name: habit.trim(), user: profile.uid })) as Pick<
      Habits,
      "user" | "name"
    >[];

    setHabits(habits);
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current?.close();
  };

  // renders
  return (

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handlePresentModalPress}
        >
          <AddButton/>
        </TouchableOpacity>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          style={{ zIndex: 1000 }} 
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
              />
            </View>
            <Text style={styles.subTitle}>Habitudes à ajouter :</Text>
            {habits.map((habit, index) => (
              <Text style={styles.habit} key={index}>
                {habit.name}
              </Text>
            ))}
            <View style={{ flex: 1 }}></View>
            <View style={styles.buttonContainer}>
              <Button title="Ajouter l'habitude" onPress={closeBottomSheet} color="white"/>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    position: 'absolute',
    bottom: 100,
    right: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
    alignContent: 'center', 
    marginBottom: 20,
    height: 48,
  },
  habit: {
    backgroundColor: "#F3EFEE",
    padding: 10,
    textAlign: "center",
    borderRadius: 5,
  },
  
});

export default CreateHabitBottomSheet;
