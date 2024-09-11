import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  findNodeHandle,
} from "react-native";
import { HabitsByDate } from "../types/habits";

const habitsByDates: HabitsByDate[] = [
  {
    date: new Date(2024, 0, 1),
    totalHabits: 5,
    habits: 3,
  },
  {
    date: new Date(2024, 8, 1),
    totalHabits: 5,
    habits: 3,
  },
];

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
  ({ month, year }: { month: number; year: number }, ref) => {
    const daysInMonth = getDaysInMonth(month, year);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <View style={styles.monthContainer}>
        <Text style={styles.monthTitle}>{monthNames[month]}</Text>
        <View style={styles.calendar}>
          {days.map((day) => (
            <View key={day} style={styles.dayContainer}>
              <Text style={styles.dayNumber}>{day}</Text>
              {habitsByDates.map((habitsByDate) => {
                if (
                  habitsByDate.date.getMonth() === month &&
                  habitsByDate.date.getDate() === day
                ) {
                  return (
                    <View
                      key={habitsByDate.date.toDateString()}
                      style={styles.blueCrescent}
                    />
                  );
                }
              })}
            </View>
          ))}
        </View>
      </View>
    );
  }
);

export default function YearCalendarScreen() {
  const scrollViewRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  useEffect(() => {
    scrollViewRef.current.scrollTo({
      y: Dimensions.get("window").height * currentMonth,
      animated: false,
    });
  }, []);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {monthNames.map((_, index) => (
        <MonthCalendar key={index} month={index} year={currentYear} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    backgroundColor: "#fff",
  },
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
    marginBottom: 10,
  },
  dayNumber: {
    fontFamily: "Geist",
    fontSize: 16,
    marginBottom: 5,
  },
  blueCrescent: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#0000FF",
    transform: [{ rotate: "135deg" }],
  },
});
