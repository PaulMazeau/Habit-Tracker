import React, { useMemo, useCallback } from "react";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { TouchableWithoutFeedback } from "react-native";

interface CustomBackdropProps extends BottomSheetBackdropProps {
  pressBehavior?: "close" | "collapse";
  onPress?: (behavior: "close" | "collapse") => void;
}

const CustomBackdrop = ({
  animatedIndex,
  style,
  pressBehavior = "collapse",
  onPress,
}: CustomBackdropProps) => {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: "rgba(171, 171, 171, 0.85)",
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(pressBehavior);
    }
  }, [onPress, pressBehavior]);

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View style={containerStyle} />
    </TouchableWithoutFeedback>
  );
};

export default CustomBackdrop;
