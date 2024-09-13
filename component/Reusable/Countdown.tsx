import React, { useState, useEffect } from "react";

interface CountdownProps {
  endTime: Date;
}

import { StyleSheet, View, Text } from "react-native";

// Removed unused CountdownContainer component

const CountdownText = ({ children }) => (
  <Text style={styles.countdownText}>{children}</Text>
);

const Countdown: React.FC<CountdownProps> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        setTimeLeft(
          `${hours}h${minutes.toString().padStart(2, "0")} restantes`
        );
      } else {
        setTimeLeft("Temps écoulé");
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return <CountdownText>{timeLeft}</CountdownText>;
};

const styles = StyleSheet.create({
  countdownContainer: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 12,
  },
  countdownText: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignSelf: "flex-start",
    fontFamily: "sans-serif",
    fontWeight: "bold",
    color: "#4D4D4D",
    backgroundColor: "#D9D9D9",
    borderRadius: 12,
    overflow: "hidden",
  },
});

export default Countdown;
