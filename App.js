import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Easing, Image } from "react-native";
import { Input } from "react-native-elements";
import "react-native-gesture-handler";
import {
  NavigationContainer,
  StackActions,
  useNavigation,
} from "@react-navigation/native";
import Svg, { Defs, Pattern, Rect, Circle } from "react-native-svg";
import * as Animatable from "react-native-animatable";
import { FloatingLabelInput } from "react-native-floating-label-input";
// import CheckBox from "@react-native-community/checkbox";
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from "@react-navigation/stack";
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
  FontAwesome,
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
import { ImageBackground } from "react-native";
import AppButton from "./components/AppButton";
import headerRoubinesButton from "./components/HeaderRoubinesButton";
import CalendarScreen from "./screens/CalendarScreen";

//  TODO:
//  keep adding nested navigation
//  loop through tab items with array prop?
//  back button color not applying
//  splash screen

//  fix back button behavior
// Removed header from routinescreen
// style
// försökte fixa labels på tab bar

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
const RoutinesStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const RootStack = createStackNavigator();
const JourneyStack = createStackNavigator();

const config = {
  änimation: "spring",
  config: {
    duration: 150,
    easing: Easing.linear,

    // stiffness: 5000,
    // damping: 100,
    // mass: 1,
    overshootClamping: false,
    // restDisplacementThreshold: 0.01,
    // restSpeedThreshold: 0.01,
  },
};

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
        gestureEnabled: true,
        gestureDirection: "horizontal",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
      }}
      headerMode="float"
      // screenOptions={{
      //   headerStyle: { backgroundColor: colors.samRed },
      //   headerTitleStyle: { color: colors.darkmodeHighWhite },
      //   headerShown: true,
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
        gestureEnabled: true,
        gestureDirection: "horizontal",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
      }}
      headerMode="float"
    >
      <RoutinesStack.Screen name="TabBar" component={TabBar} />
      <RoutinesStack.Screen
        name="Browse Routines"
        component={RoutinesScreen}
        options={{
          headerShown: true,
          headerRight: () => headerRoubinesButton(),
          headerTintColor: { color: colors.darkmodeMediumWhite },
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
        gestureEnabled: true,
        gestureDirection: "horizontal",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
      }}
      headerMode="float"
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
  headerShown: false,
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
  //  ROUBIES AND EXP
  const rewardForAddingRoutine = 30;
  //  lägga till roubies när dokument/kollektioner ändras:
  //    - när användaren lägger till en rutin
  //    - när användaren bockar av en rutin
  //      - när användaren bockar av med kombo
  //    - när användaren levlar upp
  //    -

  const introSlider = useRef(null);
  const [showIntro, setShowIntro] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [disableKeyboard, setDisableKeyboard] = useState(false);

  const introSlides = [
    {
      key: 1,
      title: "Hello!",
      text: "I'm Roubine.",
      nextText: "...what's your name?",
      image: require("./assets/icons/Group.png"),
      backgroundColor: colors.pastelRed,
      nameForm: true,
    },
    {
      key: 2,
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
  const introSkipButton = () => {
    return (
      <View style={styles.introSkipButtonContainer}>
        <Text style={styles.introSkipButtonText}>skip</Text>
      </View>
    );
  };

  const LoginAsGuestComponent = () => {
    const [name, setName] = useState("");
    setDisableKeyboard(true);

    const signInAnonymously = () => {
      if (!name.trim()) {
      } else {
        auth.signInAnonymously().then((cred) => {
          return db.collection("Users").doc(cred.user.uid).set({
            Name: name,
            Guest: true,
            UserRank: 1,
            Roubies: 50,
            UserAlertHour: 10,
            UserAlertMinute: 30,
          });
        });
        CreateDailyNotification(10, 30);
      }
    };

    return (
      <View style={styles.introInputContainer}>
        <View
          style={[
            isNameFocused
              ? {
                  borderBottomColor: colors.darkmodeMediumWhite,
                }
              : {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.darkmodeDisabledWhite,
                },
          ]}
        >
          <FloatingLabelInput
            showSoftInputOnFocus={disableKeyboard}
            isFocused={isNameFocused}
            hint="..."
            hintTextColor={colors.darkmodeMediumWhite}
            inputStyles={styles.introInputStyles}
            customLabelStyles={{
              colorFocused: colors.darkmodeHighWhite,
              colorBlurred: colors.darkmodeHighWhite,
              fontSizeBlurred: 22,
              fontSizeFocused: 12,
            }}
            containerStyles={styles.introInputInternalContainer}
            onFocus={() => {
              setIsNameFocused(true);
            }}
            onBlur={() => {
              setIsNameFocused(false);
            }}
            staticLabel="your name"
            rightComponent={
              name != "" ? (
                <View style={{ padding: 12 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setName("");
                      setIsNameFocused(false);
                      setScrollEnabled(true);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={20}
                      color={colors.darkmodeMediumWhite}
                    />
                  </TouchableOpacity>
                </View>
              ) : null
            }
            leftComponent={
              <Text
                style={[
                  { paddingRight: 4 },
                  styles.introText,
                  isNameFocused
                    ? { color: colors.darkmodeMediumWhite }
                    : { color: colors.darkmodeHighWhite },
                ]}
              >
                Hey, I'm{" "}
              </Text>
            }
            type="name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <TouchableOpacity
          style={styles.introContinueButton}
          onPress={() => {
            if (!name.trim()) {
              alert("Please enter a name");
              return;
            } else {
              introSlider.current.goToSlide(1);
              setShowSkipButton(true);
              signInAnonymously;
              setScrollEnabled(true);
            }
          }}
        >
          {name && (
            <Animatable.Text
              animation="fadeIn"
              style={styles.introContinueButtonText}
            >
              continue
            </Animatable.Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };
  const renderIntroSlides = ({ item }) => {
    return (
      <Screen
        style={[{ backgroundColor: item.backgroundColor }, styles.introScreen]}
      >
        <Svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Defs>
            <Pattern
              id="prefix__a"
              width={100}
              height={100}
              viewBox="0 0 40 40"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(135)"
            >
              <Rect width="400%" height="400%" fill="rgba(42, 67, 101,0)" />
              <Circle
                fill={
                  item.key == 1
                    ? colors.darkmodeLightBlack
                    : colors.pastelYellow
                }
                cx={20}
                cy={20}
                r={20}
              />
              <Circle fill="#ecc94b" cx={-20} cy={20} r={20} />
            </Pattern>
          </Defs>
          <Rect fill="url(#prefix__a)" height="100%" width="100%" />
        </Svg>
        {/* <Svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Defs>
            <Pattern
              id="prefix__a"
              width={10}
              height={10}
              viewBox="0 0 40 40"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(135)"
            >
              <Rect width="400%" height="400%" fill="rgba(42, 67, 101,0)" />
              <Circle fill="rgba(0, 0, 0,0.6)" cx={20} cy={20} r={4} />
              <Circle fill="rgba(46, 46, 46,0.6)" cy={40} r={3} />
              <Circle fill="rgba(46, 46, 46,0.6)" cx={40} r={3} />
              <Circle fill="rgba(46, 46, 46,0.6)" r={3} />
              <Circle fill="rgba(46, 46, 46,0.6)" cx={40} cy={40} r={3} />
            </Pattern>
          </Defs>
          <Rect fill="url(#prefix__a)" height="100%" width="100%" />
        </Svg> */}
        {/* <ImageBackground
          source={require("./assets/dots.png")}
          imageStyle={{ resizeMode: "repeat" }}
          style={{ width: "100%", height: "100%" }}
        /> */}
        <View style={styles.introContainer}>
          <Animatable.View animation="fadeIn">
            <Animatable.Text
              animation={item.key == 1 ? "fadeOut" : "fadeIn"}
              delay={3200}
              duration={1900}
              style={styles.introTitle}
            >
              {item.title}
            </Animatable.Text>
            {item.image && (
              <Image source={item.image} style={{ width: 120, height: 120 }} />
            )}
            {/* {item.questions && (
              <CheckBox
                style={styles.introCheckBox}
                disabled={false}
                value={toggleCheckBox}
                onValueChange={(newValue) => setToggleCheckBox(newValue)}
              />
            )} */}

            <Animatable.Text
              animation={item.key == 1 ? "fadeOut" : "fadeIn"}
              delay={3000}
              style={styles.introText}
            >
              {item.text}
            </Animatable.Text>
            <Animatable.Text
              animation="fadeIn"
              delay={3000}
              style={[
                styles.introText,
                item.key == 1 && {
                  top: 330,
                  textAlign: "right",
                  paddingRight: 28,
                },
              ]}
            >
              {item.nextText}
            </Animatable.Text>
          </Animatable.View>
          {item.nameForm && (
            <Screen style={styles.container}>
              <Animatable.View animation="fadeIn" delay={3000}>
                <LoginAsGuestComponent />
              </Animatable.View>
            </Screen>
          )}
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

  const updateRank = () => {
    db.collection("Users")
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        //get user exp
        let experience = doc.data().exp;
        console.log("setting exp: ", doc.data().exp);
        console.log("exp: ", experience);

        //decide rank by exp
        let newRank = 0;
        if (experience > 80) {
          newRank = 3;
        } else if (experience > 60) {
          newRank = 2;
        } else if (experience < 38) {
          newRank = 1;
        }
        console.log("new rank:", newRank);

        //set rank
        db.collection("Users").doc(auth.currentUser.uid).update({
          UserRank: newRank,
        });
      });
  };

  const rewardAddedRoutine = () => {
    let newerExp = 0;
    db.collection("Users")
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        const routineRef = db.collection("Users").doc(auth.currentUser.uid);

        routineRef.update({
          Roubies: doc.data().Roubies + rewardForAddingRoutine,
          exp: doc.data().exp + rewardForAddingRoutine,
        });
      });
  };

  var initState = true;
  useEffect(() => {
    if (isLoggedIn) {
      //use as conditional to prevent
      //onsnapshot to use initial state
      //(otherwise it runs every time you start the app
      // giving the user free rewards)
      // if (isLoggedIn) {
      const subscriber = db
        .collection("Users")
        .doc(auth.currentUser.uid)
        .collection("routines")
        .onSnapshot((documentSnapshot) => {
          if (initState) {
            initState = false;
            updateRank();
          } else {
            documentSnapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                rewardAddedRoutine();
              }
            });
            subscriber();
          }
        });
      // }
    }
  }, [rewardForAddingRoutine]);

  let content;
  if (isLoggedIn) {
    content = (
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.samRed },
            headerTitleStyle: { color: colors.darkmodeHighWhite },
            gestureEnabled: true,
            gestureDirection: "horizontal",
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: config,
              close: config,
            },
          }}
          headerMode="float"
        >
          <RootStack.Screen
            name="Home"
            component={TabBar}
            options={{
              headerRight: () => headerRoubinesButton(),
              headerShown: true,
              headerLeft: () => null,
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
            name="Reset Password"
            component={ResetPasswordScreen}
          />
          <RootStack.Screen
            name="Browse Routines"
            component={RoutinesStackScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Calendars"
            component={CalendarScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Notification Settings"
            component={NotificationSettingScreen}
            options={{ headerRight: () => headerRoubinesButton() }}
          />
          <RootStack.Screen name="Settings" component={SettingsScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  } else {
    content = (
      <NavigationContainer>
        <Stack.Navigator screenOptions={defaultScreenOptions}>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{
              animationEnabled: false,
            }}
          />
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
    return scrollEnabled ? (
      <AppIntroSlider
        ref={introSlider}
        renderItem={renderIntroSlides}
        data={introSlides}
        onDone={() => setShowIntro(false)}
        renderDoneButton={introDoneButton}
        // renderNextButton={introNextButton}
        renderSkipButton={introSkipButton}
        showNextButton={false}
        showSkipButton={showSkipButton}
        // onSkip
        bottomButton={true}
        scrollEnabled={true}

        // want to hide pagination on first page but cant
        // renderPagination={!showSkipButton ? 0 : null}

        // dotStyle
        // activeDotStyle

        // onSlideChange
        // renderPagination
      />
    ) : (
      <AppIntroSlider
        onDone={() => setShowIntro(false)}
        ref={introSlider}
        renderItem={renderIntroSlides}
        data={introSlides}
        // renderNextButton={introNextButton}
        showNextButton={false}
        showSkipButton={showSkipButton}
        // onSkip
        bottomButton={false}
        scrollEnabled={false}

        // want to hide pagination on first page but cant
        // renderPagination={!showSkipButton ? 0 : null}

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
  container: {
    justifyContent: "flex-end",
    alignItems: "center",
    bottom: 40,
  },

  introScreen: {
    width: "100%",
    height: "100%",
  },
  introContainer: {
    flexDirection: "column",

    flex: 1,
  },
  introTitle: {
    fontSize: 56,
    color: colors.darkmodeHighWhite,
    textAlign: "center",
  },
  introText: {
    color: colors.darkmodeHighWhite,
    fontSize: 26,
    textAlign: "center",
  },
  introInputContainer: {
    width: 300,
  },
  introInputInternalContainer: { height: 55 },
  introInput: {},
  introCheckBox: {},
  introInputStyles: {
    color: colors.darkmodeHighWhite,
    fontSize: 26,
  },
  introSkipButtonContainer: {
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
  introContinueButton: {},
  introContinueButtonText: {
    fontSize: 16,
    color: colors.darkmodeMediumWhite,
    textAlign: "right",
  },
});
