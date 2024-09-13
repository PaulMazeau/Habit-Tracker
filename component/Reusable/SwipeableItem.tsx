import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Swipeable, TextInput } from "react-native-gesture-handler";
import { useUser } from "../../context/UserContext";
import { updateHabit } from "../../services/habits";
import { FB_AUTH, FB_DB } from "../../firebaseconfig";
import Button from "./Button";

const SwipeableItem = ({ item, onDelete, enableEdit, userHabitId }) => {
  const [newName, setNewName] = React.useState(item.name);
  const [isEditing, setIsEditing] = React.useState(false);

  const swipeableElement = useRef(null);

  const handleUpdateChange = (text: string) => {
    setNewName(text);
  };

  const handleUpdateHabit = async () => {
    try {
      await updateHabit(
        FB_AUTH.currentUser,
        FB_DB,
        {
          id: item.id,
          name: newName,
        },
        userHabitId
      );
      console.log("Habit updated successfully");
      handleToggleEdit();
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    swipeableElement.current.close();
  };

  const { profile } = useUser();

  const renderRightActions = () => {
    return (
      <View style={styles.actionsContainer}>
        {enableEdit && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleToggleEdit}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onDelete}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} ref={swipeableElement}>
      <View style={styles.itemContainer}>
        {isEditing && (
          <View>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={(text) => handleUpdateChange(text)}
            />
            <View style={styles.updateButtonContainer}>
              <Button onPress={handleUpdateHabit} title="Modifier"></Button>
            </View>
          </View>
        )}
        {!isEditing && <Text style={styles.itemText}>{item.name}</Text>}
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: "#BBB5B5",
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
  },
  itemContainer: {
    display: "flex",
    padding: 20,
    backgroundColor: "#F3EFEE",
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  actionButton: {
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: "100%",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  updateButton: {
    backgroundColor: "#172ACE",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  updateButtonContainer: {
    marginTop: 10,
  },
  updateButtonText: {
    color: "white",
  },
  contentContainer: {
    display: "flex",
    backgroundColor: "blue",
  },
});

export default SwipeableItem;
