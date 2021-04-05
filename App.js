import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { TransitionSpecs } from '@react-navigation/stack';
import { Constants } from 'react-native-unimodules';
import { LogBox } from 'react-native';

import {
  FontAwesome5,
  MaterialCommunityIcons,
  Octicons,
} from '@expo/vector-icons';

import { db, auth } from './firebase';

import colors from './config/colors';

import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RoutinesScreen from './screens/RoutinesScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import LoginAsGuestScreen from './screens/LoginAsGuestScreen';
import NotificationSettingScreen from './screens/NotificationSettingScreen';
import AddRoutineScreen from './screens/AddRoutineScreen';

//  TODO:
//  keep adding nested navigation
//  loop through tab items with array prop?
//  remove on press highlight on tabbar
//  fix back button behavior
//  back button color not applying

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();

LogBox.ignoreLogs(['Warning: ...', 'Setting a timer']);

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.darkmodeBlack },
        headerTitleStyle: { color: colors.darkmodeHighWhite },
        tintColor: { color: colors.darkmodeMediumWhite },
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Profile" component={ProfileScreen} />
      <HomeStack.Screen name="Routines" component={RoutinesScreen} />
      <HomeStack.Screen name="AddRoutine" component={AddRoutineScreen} />
      <HomeStack.Screen name="Register" component={RegisterScreen} />
      <HomeStack.Screen name="Login" component={LoginScreen} />
      <HomeStack.Screen name="Reset Password" component={ResetPasswordScreen} />
      <HomeStack.Screen
        name="NotificationSetting"
        component={NotificationSettingScreen}
      />
    </HomeStack.Navigator>
  );
};

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.samRed },
        headerTitleStyle: { color: colors.darkmodeHighWhite },
        tintColor: { color: colors.darkmodeMediumWhite },
      }}
    >
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          transitionSpec: {
            open: TransitionSpecs.RevealFromBottomAndroidSpec,
            close: TransitionSpecs.RevealFromBottomAndroidSpec,
          },
        }}
      />
      <ProfileStack.Screen name="Register" component={RegisterScreen} />
      <ProfileStack.Screen name="Login" component={LoginScreen} />
      <ProfileStack.Screen name="LoginAsGuest" component={LoginAsGuestScreen} />
      <ProfileStack.Screen
        name="Reset Password"
        component={ResetPasswordScreen}
      />
    </ProfileStack.Navigator>
  );
};

const defaultScreenOptions = {
  headerTitleStyle: { color: 'white' },
  headerTintColor: 'white',
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
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
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
        tabBarAccessibilityLabel="Home"
      />
      <Tab.Screen
        name="Journey"
        component={LoginScreen}
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
        tabBarAccessibilityLabel="Journey"
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarColor: colors.samRed,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-astronaut" color={color} size={18} />
          ),
        }}
        tabBarAccessibilityLabel="Profile"
      />
      <Tab.Screen
        name="Settings"
        component={RoutinesScreen}
        options={{
          tabBarColor: colors.lindaPurple,
          tabBarIcon: ({ color }) => (
            <Octicons name="settings" color={color} size={20} />
          ),
        }}
        tabBarAccessibilityLabel="Settings"
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState('');

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('logged in ', user.uid);
        setIsLoggedIn(true);
      } else {
        console.log('NOT logged in ', user);
        setIsLoggedIn(false);
      }
    });
  }, [auth.user]);

  let content;
  if (isLoggedIn) {
    content = (
      <NavigationContainer>
        <TabBar />
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
          <Stack.Screen name="LoginAsGuest" component={LoginAsGuestScreen} />
          <Stack.Screen name="AddRoutine" component={AddRoutineScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return content;
}

// eslint-disable-next-line no-unused-vars
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
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
