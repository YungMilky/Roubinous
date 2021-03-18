import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { db, auth } from './firebase';

import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import HomeScreen from './screens/HomeScreen';
import RoutinesScreen from './screens/RoutinesScreen';

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: '#121212' },
  headerTitleStyle: { color: 'white' },
  headerTintColor: 'white',
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState('');

  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('logged in ', user.uid);
      setIsLoggedIn(true);
    } else {
      console.log('NOT logged in ', user);
      setIsLoggedIn(false);
    }
  });
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        {isLoggedIn ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
        )}
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Routines" component={RoutinesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
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
