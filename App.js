import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { TransitionSpecs } from "@react-navigation/stack";

import AppLoading from "expo-app-loading";

import { enableScreens } from "react-native-screens";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
enableScreens();

import {
  FontAwesome5,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";

import { db, auth } from "./firebase";

import colors from "./config/colors";

import WelcomeScreen from "./screens/WelcomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RoutinesScreen from "./screens/RoutinesScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import SignedOutScreen from "./screens/SignedOutScreen";
import RoutineScreen from "./screens/RoutineScreen";

//  TODO:
//  keep adding nested navigation
//  loop through tab items with array prop?
//  remove on press highlight on tabbar
//  fix back button behavior
//  back button color not applying

// Removed header from routinescreen
// style
// försökte fixa labels på tab bar

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
const RoutinesStack = createSharedElementStackNavigator();
const ProfileStack = createStackNavigator();
const RootStack = createStackNavigator();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.samRed },
        headerTitleStyle: { color: colors.darkmodeHighWhite },
        tintColor: { color: colors.darkmodeMediumWhite },
      }}
    >
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Register" component={RegisterScreen} />
      <ProfileStack.Screen name="Login" component={LoginScreen} />
      <ProfileStack.Screen name="SignedOut" component={SignedOutScreen} />
    </ProfileStack.Navigator>
  );
};

// RoutineScreen.defaultProps = {
//   headerMode: 'none',
// };

const RoutinesStackScreen = () => {
  return (
    <RoutinesStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.darkmodeBlack },
        headerTitleStyle: { color: colors.darkmodeHighWhite },
        tintColor: { color: colors.darkmodeMediumWhite },
      }}
    >
      <RoutinesStack.Screen name="TabBar" component={TabBar} />
      <RoutinesStack.Screen
        name="Routines"
        component={RoutinesScreen}
        options={{ headerShown: true }}
      />
      <RoutinesStack.Screen
        name="Routine"
        component={RoutineScreen}
        options={{ headerShown: false }}
      />
    </RoutinesStack.Navigator>
  );
};

const defaultScreenOptions = {
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
};

function TabBar() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="history"
      activeColor={colors.darkmodeHighWhite}
      inactiveColor={colors.darkmodeMediumWhite}
      activeColor={colors.darkmodeHighWhite}
      inactiveColor={colors.darkmodeMediumWhite}
      // shifting={false} lägger till labels men förstör activecolor
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        tabBarAccessibilityLabel="Home"
        options={{
          tabBarColor: colors.darkmodeBlack,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="flower-tulip-outline"
              color={color}
              size={22}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Journey"
        component={LoginScreen}
        tabBarAccessibilityLabel="Journey"
        options={{
          tabBarColor: colors.samGreen,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="crystal-ball"
              color={color}
              size={22}
            />
          ),
        }}
      />
      <Tab.Screen
        tabBarAccessibilityLabel="Profile"
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarColor: colors.samRed,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-astronaut" color={color} size={18} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        tabBarAccessibilityLabel="Settings"
        component={RoutineScreen}
        options={{
          tabBarColor: colors.lindaPurple,
          tabBarIcon: ({ color }) => (
            <Octicons name="settings" color={color} size={20} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState("");
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("logged in ", user.uid);
        setIsLoggedIn(true);
      } else {
        console.log("NOT logged in ", user);
        setIsLoggedIn(false);
      }
    });
  }, [auth.user]);

  let content;
  if (isLoggedIn) {
    content = (
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.darkmodeBlack },
            headerTitleStyle: { color: colors.darkmodeHighWhite },
            tintColor: { color: colors.darkmodeMediumWhite },
          }}
        >
          <RootStack.Screen
            name="Home"
            component={TabBar}
            options={{ headerShown: false }}
          />
          <RootStack.Screen name="Profile" component={ProfileScreen} />
          <RootStack.Screen
            name="Routines"
            component={RoutinesStackScreen}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  } else {
    content = (
      <NavigationContainer>
        <Stack.Navigator screenOptions={defaultScreenOptions}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Reset Password" component={ResetPasswordScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignedOut" component={SignedOutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  if (!isLoggedIn) {
    return <AppLoading />;
  } else {
    return content;
  }
}

// eslint-disable-next-line no-unused-vars
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    marginTop: 200,
  },
});
// import React from 'react';
// import { StyleSheet } from 'react-native';

// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// import LoginScreen from './screens/LoginScreen';
// import WelcomeScreen from './screens/WelcomeScreen';
// import RegisterScreen from './screens/RegisterScreen';
// import ProfileScreen from './screens/ProfileScreen';
// import colors from './config/colors';

// // ska denna behållas?
// // const globalScreenOptions = {
// //   headerStyle: { backgroundColor: '#121212' },
// //   headerTitleStyle: { color: 'white' },
// //   headerTintColor: 'white',
// // };

// export default function App() {
//   return <WelcomeScreen/>
// }

// // eslint-disable-next-line no-unused-vars
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'blue',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   input: {
//     marginTop: 200,
//   },
// });
