import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainStack from "./component/Navigation/MainStack";
import AuthStack from "./component/Navigation/AuthStack";
import { UserProvider } from "./context/UserContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { loadAsync, useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

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
  const [loaded, error] = useFonts({
    Geist: require("./assets/fonts/Geist.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <UserProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </UserProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
