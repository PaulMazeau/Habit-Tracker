import React, { useEffect, useState, useCallback, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { useUser } from "../context/UserContext";
import CheckInput from "../component/Reusable/CheckInput";
import HeaderHome from "../component/Reusable/HeaderHome";
import CreateHabitBottomSheet from "../component/Reusable/CreateHabitBottomSheet";
import Svg, { Circle, G } from "react-native-svg";
import Animated, {
  Easing,
  withTiming,
  useSharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import Countdown from "../component/Reusable/Countdown";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function HomeScreen() {
  const { profile } = useUser();
  const [habits, setHabits] = useState([]);
  const [habitsDocId, setHabitsDocId] = useState("");
  const [progress, setProgress] = useState(0); // Progress as a percentage (0 to 1)
  const progressAnimated = useSharedValue(0);
  const firestore = getFirestore();

  // Fetch habits directly from the 'user_habits' collection
  useEffect(() => {
    let unsubscribeToGetHabits = () => {};

    if (profile?.uid) {
      const habitsQuery = query(
        collection(firestore, "user_habits"),
        where("user", "==", profile.uid)
      );

      unsubscribeToGetHabits = onSnapshot(habitsQuery, (snapshot) => {
        if (!snapshot.empty) {
          const habitsData = snapshot.docs[0].data().habits;
          const docId = snapshot.docs[0].id;
          console.log(docId);
          setHabitsDocId(docId);
          setHabits(habitsData);
          setProgress(
            habitsData.filter((habit) => habit.isChecked).length /
              habitsData.length
          );
        }
      });
    }

    return () => {
      unsubscribeToGetHabits();
    };
  }, [profile, firestore]);

  useEffect(() => {
    progressAnimated.value = withTiming(progress, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  }, [progress]);

  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference - circumference * progressAnimated.value,
    };
  });

  // Memoize the habits list to avoid unnecessary renders
  // Memoize the handleToggleHabit function to avoid creating a new function on every render
  const handleToggleHabit = (id) => {
    console.log(id, "clicked");
    const updatedHabits = habits.map((habit, index) =>
      habit.name === id ? { ...habit, isChecked: !habit.isChecked } : habit
    );

    console.log(updatedHabits);

    setHabits(updatedHabits);

    const checkedHabits = updatedHabits.filter((habit) => habit.isChecked);

    // Update habits in Firebase
    const docRef = doc(firestore, "user_habits", habitsDocId);
    updateDoc(docRef, {
      date: Timestamp.now(),
      habits: updatedHabits,
      user: profile.uid,
    });
  };
  const today = new Date();
  today.setHours(23, 59, 0, 0);

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <HeaderHome title="Aujourd'hui" />
      </View>
      <View style={styles.circle}>
        <Svg height="260" width="260" viewBox="0 0 120 120">
          <G transform={`rotate(-90, 60, 60)`}>
            <Circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#e6e6e6"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <AnimatedCircle
              cx="60"
              cy="60"
              r={radius}
              stroke="#0049AC"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              animatedProps={animatedProps}
              strokeLinecap="round"
              fill="none"
            />
          </G>
        </Svg>
        <Text style={styles.completion}>
          {habits.filter((habit) => habit.isChecked).length}/{habits.length}
        </Text>
      </View>

      <Text style={styles.subtitle}>Mes habitudes</Text>
      {habits.map((habit, index) => (
        <CheckInput
          key={index}
          id={habit.name}
          content={habit.name}
          isChecked={habit.isChecked}
          onToggle={handleToggleHabit}
        />
      ))}
      <CreateHabitBottomSheet habits={habits} userHabitId={habitsDocId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF8F5",
  },
  head: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  circle: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
  },
  completion: {
    fontFamily: "GeistMono",
    position: "absolute",
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    left: "50%",
    top: "50%",
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  subtitle: {
    marginLeft: "2.5%",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 12,
  },
});
