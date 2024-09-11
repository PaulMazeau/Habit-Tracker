import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import CustomBackdrop from "../../component/Reusable/CustomBackdrop";
import CustomHandle from "../../component/Reusable/CustomHandle";
import { useCallback, useMemo, useRef } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";

export default function CreateHabitBottomSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["10%", "70%"], []);

  const handleBackdropPress = useCallback((behavior) => {
    if (behavior === "close") {
      bottomSheetRef.current?.close();
    } else if (behavior === "collapse") {
      bottomSheetRef.current?.collapse();
    }
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={(props) => (
        <CustomBackdrop
          {...props}
          pressBehavior="collapse"
          onPress={handleBackdropPress}
        />
      )}
      handleComponent={CustomHandle}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Ajouter une habitude</Text>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 12,
    backgroundColor: "#FCF8F5",
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
});
