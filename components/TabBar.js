import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import RoutinesScreen from '../screens/RoutinesScreen';

import LoginScreen from '../screens/LoginScreen';

import colors from '../config/colors';
import { createStackNavigator } from '@react-navigation/stack';


const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: '#121212' },
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
          screenOptions={globalScreenOptions}>
        <Tab.Screen name="Home" component={HomeScreen} options={{tabBarColor: colors.darkmodeBlack}}/>
        <Tab.Screen name="Journey" component={LoginScreen} options={{tabBarColor: colors.samGreen}}/>
        <Tab.Screen name="Profile" component={ProfileScreen} options={{tabBarColor: colors.samRed}}/>
        <Tab.Screen name="Settings" component={RoutinesScreen} options={{tabBarColor: colors.lindaPurple}}/>
      </Tab.Navigator>
  );
}

export default TabBar;
