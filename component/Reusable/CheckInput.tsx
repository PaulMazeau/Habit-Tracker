import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import CheckLight from "../../assets/icons/Check-light.svg";

interface CheckInputProps {
  id: string;
  content: string;
  isChecked: boolean;
  onToggle: (id: string) => void;
}

function CheckInput({ id, content, isChecked, onToggle }: CheckInputProps) {
  console.log(isChecked);
  console.log("CheckInput rendered");

  const handlePress = () => {
    console.log("CheckInput handlePress");
    onToggle(id);
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

export default React.memo(CheckInput);

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
    width: "100%",
    height: 30,
  },
});
