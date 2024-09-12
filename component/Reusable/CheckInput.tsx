import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  View,
} from "react-native";
import CheckLight from "../../assets/icons/Check-light.svg";
import { useUser } from "../../context/UserContext";
import { FB_DB } from "../../firebaseconfig";
import {
  getHabitsByDate,
  updateHabit,
  updateUserHabit,
} from "../../services/habits";
import { Timestamp } from "firebase/firestore";
import { Habits } from "../../types/habits";

interface CheckInputProps {
  id: string;
  content: string;
  isChecked: boolean;
  habits: Habits[];
  setHabits: React.Dispatch<React.SetStateAction<Habits[]>>;
}

function CheckInput({
  id,
  content,
  isChecked,
  habits,
  setHabits,
}: CheckInputProps) {
  const { profile } = useUser();

  const handlePress = () => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id ? { ...habit, checked: !habit.checked } : habit
      )
    );

    const newHabitsId = habits.map(
      (habit) => habit.id === id && !habit.checked
    );

    console.log(newHabitsId);

    updateUserHabit(profile, FB_DB, {
      date: Timestamp.now(),
      habits: [id],
      user: profile.uid,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.check}>
        {isChecked && (
          <CheckLight style={styles.checkLogo} width={"100%"} height={30} />
        )}
      </View>
      <Text style={styles.text}>{content}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F3EFEE",
    gap: 10,
    width: "95%",
    justifyContent: "flex-start",
    marginBottom: 10,
    marginHorizontal: "2.5%",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
  check: {
    position: "relative",
    fontSize: 16,
    fontWeight: "500",
    aspectRatio: 1,
    height: 30,
    width: "8%",
    backgroundColor: "white",
    borderColor: "#BBB5B5",
    borderWidth: 1,
    borderRadius: 4,
  },
  checkLogo: {
    aspectRatio: 1,
    width: "100%",
    height: 30,
    position: "absolute",
    top: 0,
  },
});

export default CheckInput;
