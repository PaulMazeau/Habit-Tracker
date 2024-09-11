import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import FirstScreen from '../../screens/FirstScreen';
import SignUpScreen from '../../screens/SignUpScreen';
import SignInScreen from '../../screens/SignInScreen';

export default function AuthStack() {
    const MainNavigation = createNativeStackNavigator();
    
    return (
        <MainNavigation.Navigator initialRouteName="FirstPage" screenOptions={{ headerShown: false }}>
            <MainNavigation.Screen name="FirstScreen" component={FirstScreen} />
            <MainNavigation.Screen name="SignUp" component={SignUpScreen} />
            <MainNavigation.Screen name="SignIn" component={SignInScreen} />
         </MainNavigation.Navigator>
    )
}