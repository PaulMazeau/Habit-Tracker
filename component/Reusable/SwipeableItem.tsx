import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Swipeable, TextInput } from "react-native-gesture-handler";
import { useUser } from "../../context/UserContext";
import { updateHabit } from "../../services/habits";
import { FB_AUTH, FB_DB } from "../../firebaseconfig";

const SwipeableItem = ({ item, onDelete, enableEdit }) => {
  const [newName, setNewName] = React.useState(item.name);
  const [isEditing, setIsEditing] = React.useState(false);

  const handleUpdateChange = (text: string) => {
    setNewName(text);
  };

  const handleUpdateHabit = async () => {
    try {
      await updateHabit(FB_AUTH.currentUser, FB_DB, {
        id: item.id,
        name: newName,
      });
      console.log("Habit updated successfully");
      handleToggleEdit();
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
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
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.itemContainer}>
        {isEditing && (
          <View>
            <TextInput
              style={styles.itemText}
              value={newName}
              onChangeText={(text) => handleUpdateChange(text)}
            />
            <TouchableOpacity
              onPress={handleUpdateHabit}
              style={styles.updateButton}
            >
              <Text>Update</Text>
            </TouchableOpacity>
          </View>
        )}
        {!isEditing && <Text style={styles.itemText}>{item.name}</Text>}
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  itemText: {
    fontSize: 18,
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
    width: 80,
    height: "100%",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  updateButton: {
    backgroundColor: "#f44336",
  },
});

export default SwipeableItem;
