import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../../assets/icons/Home.svg';
import Profile from '../../assets/icons/Profile.svg';
import Browse from '../../assets/icons/Browse.svg';
import BrowseScreen from '../../screens/BrowseScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import HomeScreen from '../../screens/HomeScreen';

const Tab = createBottomTabNavigator();

export default function MainStack() {
    return (
        <Tab.Navigator 
            initialRouteName={"HomeScreen"}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "gray",
                    display: "flex",
                },
            }}
        >
            <Tab.Screen 
                name="HomeScreen" 
                component={HomeScreen}
                options={{
                    tabBarIcon: () => <Home stroke={'black'} width={24} height={24} />,
                }} 
            />
            <Tab.Screen 
                name="BrowseScreen" 
                component={BrowseScreen}
                options={{
                    tabBarIcon: () => <Browse stroke={'black'} width={24} height={24} />,
                }} 
            />
            <Tab.Screen 
                name="ProfileScreen" 
                component={ProfileScreen}
                options={{
                    tabBarIcon: () => <Profile stroke={'black'} width={24} height={24} />,
                }} 
            />
        </Tab.Navigator>
    );
}