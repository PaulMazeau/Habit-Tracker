import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Countdown from "./Countdown";

type HeaderProps = {
  title: string;
};

const HeaderHome: React.FC<HeaderProps> = ({ title }) => {

  const today = new Date();
  today.setHours(23, 59, 0, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Countdown endTime={today} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#00000000",
    paddingBottom: Platform.OS === "android" ? 25 : -25,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 8,
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default HeaderHome;
