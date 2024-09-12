import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  findNodeHandle,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import Animated, { useAnimatedProps } from "react-native-reanimated";
import Header from "../component/Reusable/Header";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import { FB_DB } from "../firebaseconfig";
import { getAllHabitsCalendar } from "../services/habits";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const MonthCalendar = React.forwardRef(
  (
    {
      month,
      year,
      habitsCalendar,
    }: {
      month: number;
      year: number;
      habitsCalendar: {
        [key: string]: { totalHabits: number; habits: number };
      };
    },
    ref
  ) => {
    const daysInMonth = getDaysInMonth(month, year);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const radius = 15;
    const strokeWidth = 7;
    const circumference = 2 * Math.PI * radius;

    const calculateProgress = (day: number) => {
      const date = `${year}/${month + 1}/${day}`;
      const habits = habitsCalendar[date];
      if (!habits) {
        return 0;
      }
      return habits.habits / habits.totalHabits;
    };

    const getAnimatedProps = (progress: number) => {
      return useAnimatedProps(() => {
        return {
          strokeDashoffset: circumference - circumference * progress,
        };
      });
    };

    return (
      <View ref={ref} style={styles.monthContainer}>
        <Text style={styles.monthTitle}>{monthNames[month]}</Text>
        <View style={styles.calendar}>
          {days.map((day) => (
            <View key={day} style={styles.dayContainer}>
              <Text style={styles.dayNumber}>{day}</Text>
              <View style={styles.progress}>
                <Svg height="120" width="120" viewBox="0 0 120 120">
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
                      animatedProps={getAnimatedProps(calculateProgress(day))}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </G>
                </Svg>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }
);

export default function YearCalendarScreen() {
  const scrollViewRef = useRef(null);
  const monthRefs = useRef([]);
  const { profile } = useUser(); // Utiliser le hook useUser pour accéder au profil
  const [habitsCalendar, setHabitsCalendar] = useState<{
    [key: string]: { totalHabits: number; habits: number };
  }>({});

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const scrollToCurrentMonth = () => {
    if (monthRefs.current[currentMonth]) {
      monthRefs.current[currentMonth].measureLayout(
        findNodeHandle(scrollViewRef.current),
        (x, y) => {
          const scrollPosition = y - 50;
          scrollViewRef.current.scrollTo({
            y: scrollPosition,
            animated: false,
          });
        },
        () => console.error("measureLayout failed")
      );
    }
  };

  // Scroll to the current month when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      scrollToCurrentMonth();
    }, [])
  );

  useEffect(() => {
    let unsubscribe = () => {};

    if (profile?.uid) {
      unsubscribe = getAllHabitsCalendar(profile, FB_DB, (fetchedHabits) => {
        setHabitsCalendar(fetchedHabits);
      });
    }

    return () => unsubscribe();
  }, [profile]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.body}>
        <Header title={`Calendrier`} />
        {monthNames.map((_, index) => (
          <MonthCalendar
            key={index}
            month={index}
            year={currentYear}
            ref={(el) => (monthRefs.current[index] = el)}
            habitsCalendar={habitsCalendar}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#FCF8F5",
  },
  container: {},
  contentContainer: {
    paddingBottom: 50,
  },
  yearTitle: {
    fontFamily: "Geist",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  monthContainer: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  monthTitle: {
    fontFamily: "GeistMono",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayContainer: {
    fontFamily: "Geist",
    width: "14.2857%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
  },
  dayNumber: {
    fontFamily: "Geist",
    fontWeight: "bold",
    fontSize: 16,
  },
  progress: {
    position: "absolute",
    top: -6,
  },
});
