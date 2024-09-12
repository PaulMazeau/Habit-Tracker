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
  getHabitsByDate,
  updateHabit,
} from "../services/habits";
import { Habits } from "../types/habits";
import CreateHabitBottomSheet from "../component/Reusable/CreateHabitBottomSheet";
import CheckInput from "../component/Reusable/CheckInput";
import Svg, { Circle, G } from "react-native-svg";
import Animated, {
  Easing,
  interpolate,
  useSharedValue,
  withTiming,
  useAnimatedProps,
} from "react-native-reanimated";
import Header from "../component/Reusable/Header";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function HomeScreen() {
  const navigation = useNavigation();
  const { profile } = useUser(); // Utiliser le hook useUser pour accéder au profil
  const [habits, setHabits] = useState<Habits[]>([]);

  const [progress, setProgress] = useState(0); // la progression en pourcentage (0 à 1)
  const progressAnimated = useSharedValue(0);

  useEffect(() => {
    let unsubscribeToGetHabits = () => {};
    let unsubscribeToGetHabitsByDate = () => {};

    if (profile?.uid) {
      unsubscribeToGetHabits = getHabits(profile, FB_DB, (allHabits) => {
        setHabits(allHabits);
      });

      unsubscribeToGetHabitsByDate = getHabitsByDate(
        profile,
        FB_DB,
        (todayHabits) => {
          setHabits((prev) => {
            const todayHabitsId = todayHabits?.habits as Habits["id"][];
            const allHabits = prev;
            const allHabitsWithChecked = allHabits.map((habit) => {
              const isCheckedToday = todayHabitsId?.includes(habit.id);
              habit.checked = isCheckedToday;
              return habit;
            });

            return allHabitsWithChecked;
          });
        }
      );
    }

    return () => {
      unsubscribeToGetHabitsByDate();
      unsubscribeToGetHabits();
    };
  }, [profile]);

  useEffect(() => {
    progressAnimated.value = withTiming(progress, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  }, [progress]);

  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  // Remplir le cercle
  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference - circumference * progressAnimated.value,
    };
  });

  return (
    <View style={styles.container}>
      <Header title="Aujourd'hui" />
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
      </View>

      <Text style={styles.subtitle}>Mes habitudes</Text>
      {habits.map((habit) => (
        <CheckInput
          key={habit.id}
          id={habit.id}
          content={habit.name}
          isChecked={habit.checked}
          habits={habits}
          setHabits={setHabits}
        />
      ))}
      <CreateHabitBottomSheet habits={habits} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF8F5",
  },
  checkbox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxIndicator: {
    width: 20,
    height: 20,
    backgroundColor: "transparent",
  },
  checked: {
    backgroundColor: "green",
  },
  button: {
    marginTop: 20,
  },
  circle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  subtitle: {
    marginLeft: "2.5%",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 12,
  },
});
