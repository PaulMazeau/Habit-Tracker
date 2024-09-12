import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../../assets/icons/Home.svg";
import Profile from "../../assets/icons/Profile.svg";
import Calendar from "../../assets/icons/Calendar.svg";
import CalendarScreen from "../../screens/CalendarScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import HomeScreen from "../../screens/HomeScreen";
import { Platform } from "react-native";

const Tab = createBottomTabNavigator();

export default function MainStack() {
  let padding = 30;
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  return (
    <Tab.Navigator
      initialRouteName={"HomeScreen"}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#171717",
          position: "absolute",
          zIndex: 1,
          bottom: Platform.OS === "android" && keyboardStatus ? 0 : 30,
          left: 100,
          right: 100,
          borderRadius: 100,
          height: 51,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              padding: padding,
            },
            android: {
              elevation: 3,
              shadowColor: "#808080",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            },
          }),
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: () => <Home stroke={"white"} width={24} height={24} />,
        }}
      />
      <Tab.Screen
        name="CalendarScreen"
        component={CalendarScreen}
        options={{
          tabBarIcon: () => (
            <Calendar stroke={"white"} width={24} height={24} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarIcon: () => <Profile stroke={"white"} width={24} height={24} />,
        }}
      />
    </Tab.Navigator>
  );
}
