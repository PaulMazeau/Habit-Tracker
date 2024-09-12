import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  AppRegistry,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainStack from "./component/Navigation/MainStack";
import AuthStack from "./component/Navigation/AuthStack";
import { UserProvider } from "./context/UserContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Font from "expo-font";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {currentUser ? (
        <Stack.Screen
          name="Main"
          component={MainStack}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

// Composant App
export default function App() {
  const [fontsLoaded] = Font.useFonts({
    Geist: require("./assets/fonts/Geist.ttf"),
    GeistMono: require("./assets/fonts/GeistMono.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <UserProvider>
          <BottomSheetModalProvider>
            <NavigationContainer>
              <AppNavigator/>
            </NavigationContainer>
          </BottomSheetModalProvider>
        </UserProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent("main", () => App);
