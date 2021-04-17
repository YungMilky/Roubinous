import React, { useState, useEffect } from "react";
import { StyleSheet, Image } from "react-native";
import "react-native-gesture-handler";
import {
  NavigationContainer,
  StackActions,
  useNavigation,
} from "@react-navigation/native";
import CheckBox from "@react-native-community/checkbox";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { TransitionSpecs } from "@react-navigation/stack";
import { Constants } from "react-native-unimodules";
import AppLoading from "expo-app-loading";
import { LogBox } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { enableScreens } from "react-native-screens";
enableScreens();

import {
  FontAwesome5,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";

import { db, auth, fv } from "./firebase";

import colors from "./config/colors";

import WelcomeScreen from "./screens/WelcomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RoutinesScreen from "./screens/RoutinesScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import LoginAsGuestScreen from "./screens/LoginAsGuestScreen";
import RoutineScreen from "./screens/RoutineScreen";
import NotificationSettingScreen from "./screens/NotificationSettingScreen";
import AddRoutineScreen from "./screens/AddRoutineScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import SettingsScreen from "./screens/SettingsScreen";
import JourneyScreen from "./screens/JourneyScreen";
import { View } from "react-native";
import { Text } from "react-native";
import Screen from "./components/Screen";

//  TODO:
//  useEffect running too many times
//  roubies+exp när användaren lägger till en rutin
//  keep adding nested navigation
//  loop through tab items with array prop?
//  back button color not applying
//  splash screen

//  fix back button behavior
// Removed header from routinescreen
// style
// försökte fixa labels på tab bar

//  ROUBIES AND EXP
const rewardForAddingRoutine = 30;
//  lägga till roubies när dokument/kollektioner ändras:
//    - när användaren lägger till en rutin
//    - när användaren bockar av en rutin
//      - när användaren bockar av med kombo
//    - när användaren levlar upp
//    -

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
const RoutinesStack = createSharedElementStackNavigator();
const ProfileStack = createStackNavigator();
const RootStack = createStackNavigator();
const JourneyStack = createStackNavigator();

const headerSettingsButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ paddingRight: 10 }}
      onPress={() => navigation.navigate("Settings")}
    >
      {/* <Image
        style={{ width: 26, height: 26 }}
        source={require('./assets/icons/tune-vertical.png')}
      /> */}
      <Octicons name="settings" size={26} color={colors.darkmodeHighWhite} />
    </TouchableOpacity>
  );
};

if (typeof LogBox != "undefined") {
  LogBox.ignoreLogs(["Warning: ...", "Setting a timer"]);
}

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.samRed },
        headerTitleStyle: { color: colors.samRed },
      }}
      // screenOptions={{
      //   headerStyle: { backgroundColor: colors.samRed },
      //   headerTitleStyle: { color: colors.darkmodeHighWhite },
      //   headerShown: true,
      //   tintColor: { color: 'rgba(255,255,255,0.60)' },
      // }}
    >
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen name="Register" component={RegisterScreen} />
      <ProfileStack.Screen name="Login" component={LoginScreen} />
      <ProfileStack.Screen name="LoginAsGuest" component={LoginAsGuestScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen
        name="Reset Password"
        component={ResetPasswordScreen}
      />
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
        headerStyle: { backgroundColor: colors.samRed },
        headerTitleStyle: { color: colors.darkmodeHighWhite },
      }}
    >
      <RoutinesStack.Screen name="TabBar" component={TabBar} />
      <RoutinesStack.Screen
        name="Routines"
        component={RoutinesScreen}
        options={{
          headerShown: true,
          headerRight: () => headerSettingsButton(),
          headerTintColor: { color: colors.darkmodeMediumWhite },
          tintColor: { color: colors.darkmodeMediumWhite },
        }}
      />
      <RoutinesStack.Screen
        name="Routine"
        component={RoutineScreen}
        options={{ headerShown: false }}
      />
      <RoutinesStack.Screen
        name="Add Custom Routine"
        component={AddRoutineScreen}
      />
      <RoutinesStack.Screen name="Settings" component={SettingsScreen} />
    </RoutinesStack.Navigator>
  );
};

const JourneyStackScreen = () => {
  return (
    <JourneyStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.samRed },
        headerTitleStyle: { color: colors.samRed },
      }}
    >
      <JourneyStack.Screen
        name="Journey"
        component={JourneyScreen}
        options={{ title: "Journey" }}
      />
    </JourneyStack.Navigator>
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
      shifting={true}
      barStyle={{ backgroundColor: colors.pastelRed }}
      // shifting={false} lägger till labels men förstör activecolor
      activeColor={colors.darkmodeHighWhite}
      inactiveColor={colors.darkmodeMediumWhite}
      activeColor={colors.darkmodeHighWhite}
      inactiveColor={colors.darkmodeMediumWhite}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        tabBarAccessibilityLabel="Home"
        options={{
          title: "Home",
          tabBarColor: colors.samRed,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              // style={{ width: 22, height: 22 }}
              // source={require('./assets/icons/home-outline.png')}
              name="home"
              color={color}
              size={22}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Journey"
        component={JourneyScreen}
        tabBarAccessibilityLabel="Journey"
        options={{
          title: "Journey",
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.samRed,
          },
          tabBarColor: colors.samRed,
          tabBarIcon: ({ color }) => (
            // <Image
            //   style={{ width: 22, height: 22 }}
            //   source={require('./assets/icons/run.png')}
            // />
            <MaterialCommunityIcons name="run" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        tabBarAccessibilityLabel="Profile"
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          headerRight: () => headerSettingsButton(),
          tabBarColor: colors.samRed,
          tabBarIcon: ({ color }) => (
            // <Image
            //   style={{ width: 22, height: 22 }}
            //   source={require('./assets/icons/account-outline.png')}
            // />
            <FontAwesome5 name="user-astronaut" color={color} size={18} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const introSlides = [
    {
      key: "one",
      title: "Title 1",
      text: "intro text",
      // image: require('./assets/1.jpg'),
      backgroundColor: "#59b2ab",
    },
    {
      key: "one",
      title: "Title 1",
      text: "Description.\nSay something cool",
      // image: require('./assets/1.jpg'),
      backgroundColor: "#59b2ab",
    },
  ];
  const introDoneButton = () => {
    return (
      <View style={styles.introDoneButtonContainer}>
        <Text style={styles.introDoneButtonText}>less gooo</Text>
      </View>
    );
  };
  // const introNextButton = () => {
  //   return (
  //     <View>
  //       <Text>nex</Text>
  //     </View>
  //   );
  // };
  const introSkipButton = () => {
    return (
      <View style={styles.introSkipButtonContainer}>
        <Text style={styles.introSkipButtonText}>skip</Text>
      </View>
    );
  };
  const renderIntroSlides = ({ item }) => {
    return (
      <Screen style={styles.introScreen}>
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>{item.title}</Text>
          <CheckBox
            style={styles.introCheckBox}
            disabled={false}
            value={toggleCheckBox}
            onValueChange={(newValue) => setToggleCheckBox(newValue)}
          />
          {/* <Image source={item.image} /> */}
          <Text style={styles.introText}>{item.text}</Text>
        </View>
      </Screen>
    );
  };

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

  //use as conditional to prevent
  //onsnapshot to use initial state
  //(otherwise it runs every time you start the app
  // giving the user free rewards)
  var initState = true;
  useEffect(() => {
    if (isLoggedIn) {
      const subscriber = db
        .collection("Users")
        .doc(auth.currentUser.uid)
        .collection("routines")
        .onSnapshot((documentSnapshot) => {
          try {
            // console.log(documentSnapshot.docChanges());
            if (initState) {
              initState = false;
            } else {
              documentSnapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                  db.collection("Users")
                    .doc(auth.currentUser.uid)
                    .update({
                      Roubies: fv.FieldValue.increment(rewardForAddingRoutine),
                      exp: fv.FieldValue.increment(rewardForAddingRoutine),
                    });
                }
                if (change.type === "modified") {
                  console.log("modified");
                  // reward on combo
                }
              });
            }
          } catch (e) {
            console.log(e);
          }
        });
      return () => subscriber();
    }
  }, []);

  let content;
  if (isLoggedIn) {
    content = (
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.samRed },
            headerTitleStyle: { color: colors.darkmodeHighWhite },
            tintColor: { color: colors.darkmodeMediumWhite },
          }}
        >
          <RootStack.Screen
            name="Home"
            component={TabBar}
            options={{
              headerRight: () => headerSettingsButton(),
              headerShown: true,
            }}
          />
          <RootStack.Screen
            name="Profile"
            component={ProfileStackScreen}
            options={{ title: "Profile" }}
          />
          <RootStack.Screen name="Register" component={RegisterScreen} />
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen
            name="Routines"
            component={RoutinesStackScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Notification Settings"
            component={NotificationSettingScreen}
            options={{ headerRight: () => headerSettingsButton() }}
          />
          <RootStack.Screen name="Settings" component={SettingsScreen} />
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
          <Stack.Screen name="LoginAsGuest" component={LoginAsGuestScreen} />
          <Stack.Screen name="AddRoutine" component={AddRoutineScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // if (!isLoggedIn) { skapar white screen om man inte e inloggad :/
  //   return <AppLoading />;
  // } else {
  if (!showIntro) {
    return content;
  } else {
    return (
      <AppIntroSlider
        renderItem={renderIntroSlides}
        data={introSlides}
        onDone={() => setShowIntro(false)}
        renderDoneButton={introDoneButton}
        // renderNextButton={introNextButton}
        renderSkipButton={introSkipButton}
        showNextButton={false}
        showSkipButton={true}
        // onSkip
        bottomButton={true}

        // dotStyle
        // activeDotStyle

        // onSlideChange
        // renderPagination
      />
    );
  }
}

// eslint-disable-next-line no-unused-vars
const styles = StyleSheet.create({
  input: {
    marginTop: 200,
  },
  introScreen: {
    backgroundColor: colors.darkmodeLightBlack,
  },
  introContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  introTitle: {
    fontSize: 36,
    color: colors.darkmodeHighWhite,
    textAlign: "center",
  },
  introText: {
    fontSize: 20,
    color: colors.darkmodeHighWhite,
    textAlign: "center",
  },
  introCheckBox: {},
  introSkipButtonContainer: {
    justifyContent: "center",
    backgroundColor: colors.darkmodeFocused,
    padding: 16,
    borderRadius: 15,
  },
  introSkipButtonText: {
    fontSize: 26,
    color: colors.darkmodeDisabledWhite,
    textAlign: "center",
  },
  introDoneButtonContainer: {
    justifyContent: "center",
    backgroundColor: colors.darkmodeFocused,
    padding: 16,
    borderRadius: 15,
  },
  introDoneButtonText: {
    fontSize: 26,
    color: colors.darkmodeDisabledWhite,
    textAlign: "center",
  },
});
