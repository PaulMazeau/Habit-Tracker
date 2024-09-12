import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FB_AUTH, FB_DB } from "../firebaseconfig";
import { signOut } from "firebase/auth";
import { useUser } from "../context/UserContext";
import { getHabits } from "../services/habits";
import { HabitsType } from "../types/habits";
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
  const [habits, setHabits] = useState<HabitsType[]>([]);
  const [progress, setProgress] = useState(0); // la progression en pourcentage (0 à 1)
  const progressAnimated = useSharedValue(0);
  // const [checkedHabitsId , setCheckedHabitsId] = useState<string[]>([]);

  const handleCheckHabit = (id: string) => {
    console.log("id", id);
    
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id ? { ...habit, checked: !habit.checked } : habit
      )
    );

  }

  useEffect(() => {
    let unsubscribe = () => {};

    if (profile?.uid) {
      unsubscribe = getHabits(profile, FB_DB, (fetchedHabits) => {
        setHabits(fetchedHabits);
      });
    }

    return () => unsubscribe();
  }, [profile]);

  useEffect(() => {
    // Anime la progression du cercle lorsqu'on coche la case
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

        
        {/* 
        
        Permet de test pour animer le cercle

        <TouchableOpacity
          style={styles.button}
          onPress={() => setProgress((prev) => (prev < 1 ? prev + 0.25 : 0))} // Simule une case cochée changez la valeur 0.25 en fonction du nombre de tâches
        >
          <View style={styles.checkbox}>
            <View
              style={[
                styles.checkboxIndicator,
                progress >= 1 && styles.checked,
              ]}
            />
          </View>
          </TouchableOpacity> */}


      <Text style={styles.subtitle}>Mes habitudes</Text>
      {habits.map((habit) => (
        <CheckInput
          key={habit.id}
          id={habit.id}
          content={habit.name}
          checked={habit.checked}
          onChange={() => handleCheckHabit(habit.id)}
        />
        // <Text key={habit.id}>{habit.name}</Text>
      ))}


      <CreateHabitBottomSheet />
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
    marginLeft: '2.5%',
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 12,
  }
});
