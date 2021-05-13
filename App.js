import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Easing,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  Pressable,
} from 'react-native';
import 'react-native-gesture-handler';
import {
  NavigationContainer,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import Svg, {
  Defs,
  Pattern,
  Rect,
  Circle,
  Path,
  G,
  Mask,
} from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { TransitionSpecs } from '@react-navigation/stack';
import { Constants } from 'react-native-unimodules';
import AppLoading from 'expo-app-loading';
import { LogBox } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { enableScreens } from 'react-native-screens';
import RNBounceable from '@freakycoder/react-native-bounceable';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
enableScreens();

import {
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
  Octicons,
} from '@expo/vector-icons';

import { db, auth, fv } from './firebase';

import colors from './config/colors';

import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RoutinesScreen from './screens/RoutinesScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import LoginAsGuestScreen from './screens/LoginAsGuestScreen';
import RoutineScreen from './screens/RoutineScreen';
import NotificationSettingScreen from './screens/NotificationSettingScreen';
import AddRoutineScreen from './screens/AddRoutineScreen';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import SettingsScreen from './screens/SettingsScreen';
import JourneyScreen from './screens/JourneyScreen';
import { View, Text } from 'react-native';
import Screen from './components/Screen';
import { ImageBackground } from 'react-native';
import AppButton from './components/AppButton';
import headerRoubinesButton from './components/HeaderRoubinesButton';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('screen');

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
  animation: 'spring',
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
      onPress={() => navigation.navigate('Settings')}
    >
      {/* <Image
        style={{ width: 26, height: 26 }}
        source={require('./assets/icons/tune-vertical.png')}
      /> */}
      <Octicons name='settings' size={26} color={colors.darkmodeHighWhite} />
    </TouchableOpacity>
  );
};

if (typeof LogBox != 'undefined') {
  LogBox.ignoreLogs(['Warning: ...', 'Setting a timer']);
}

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.samRed },
        headerTitleStyle: { color: colors.samRed },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
      }}
      headerMode='float'
      // screenOptions={{
      //   headerStyle: { backgroundColor: colors.samRed },
      //   headerTitleStyle: { color: colors.darkmodeHighWhite },
      //   headerShown: true,
      // }}
    >
      <ProfileStack.Screen
        name='Profile'
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen name='Register' component={RegisterScreen} />
      <ProfileStack.Screen name='Login' component={LoginScreen} />
      <ProfileStack.Screen name='LoginAsGuest' component={LoginAsGuestScreen} />
      <ProfileStack.Screen name='Settings' component={SettingsScreen} />
      <ProfileStack.Screen
        name='Reset Password'
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
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
      }}
      headerMode='float'
    >
      <RoutinesStack.Screen name='TabBar' component={TabBar} />
      <RoutinesStack.Screen
        name='Browse Routines'
        component={RoutinesScreen}
        options={{
          headerShown: true,
          headerRight: () => headerRoubinesButton(),
          headerTintColor: { color: colors.darkmodeMediumWhite },
        }}
      />
      <RoutinesStack.Screen
        name='Routine'
        component={RoutineScreen}
        options={{ headerShown: false }}
      />
      <RoutinesStack.Screen
        name='Add Custom Routine'
        component={AddRoutineScreen}
      />
      <RoutinesStack.Screen name='Settings' component={SettingsScreen} />
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
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
      }}
      headerMode='float'
    >
      <JourneyStack.Screen
        name='Journey'
        component={JourneyScreen}
        options={{ title: 'Journey' }}
      />
    </JourneyStack.Navigator>
  );
};

const defaultScreenOptions = {
  headerTitleStyle: { color: 'white' },
  headerTintColor: 'white',
  headerShown: false,
};

function TabBar() {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      backBehavior='history'
      shifting={true}
      barStyle={{ backgroundColor: colors.pastelRed }}
      // shifting={false} lägger till labels men förstör activecolor
      activeColor={colors.darkmodeHighWhite}
      inactiveColor={colors.darkmodeMediumWhite}
      activeColor={colors.darkmodeHighWhite}
      inactiveColor={colors.darkmodeMediumWhite}
    >
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        tabBarAccessibilityLabel='Home'
        options={{
          title: 'Home',
          tabBarColor: colors.samRed,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              // style={{ width: 22, height: 22 }}
              // source={require('./assets/icons/home-outline.png')}
              name='home'
              color={color}
              size={22}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Journey'
        component={JourneyScreen}
        tabBarAccessibilityLabel='Journey'
        options={{
          title: 'Journey',
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
            <MaterialCommunityIcons name='run' color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        tabBarAccessibilityLabel='Profile'
        name='Profile'
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerRight: () => headerSettingsButton(),
          tabBarColor: colors.samRed,
          tabBarIcon: ({ color }) => (
            // <Image
            //   style={{ width: 22, height: 22 }}
            //   source={require('./assets/icons/account-outline.png')}
            // />
            <FontAwesome5 name='user-astronaut' color={color} size={18} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  //  ROUBIES AND EXP
  const rewardForAddingRoutine = 30;

  const roubiesForIntroCompletion = 50;
  const roubiesPerQuestion = 5;

  //is set to "Users" collection user profile - db as opposed to auth
  const [user, setUser] = useState(null);

  //introslider hooks
  const introSlider = useRef(null);
  const [showIntro, setShowIntro] = useState(null);
  const handComponentRef = useRef(null);
  const animatedTextRef1 = useRef(null);
  const animatedTextRef2 = useRef(null);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [globalName, setGlobalName] = useState('');
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [continuePressed, setContinuePressed] = useState(false);
  const [delay, setDelay] = useState(2300);
  const [handComponentDelay, setHandComponentDelay] = useState(6300);
  const [duration, setDuration] = useState(2000);
  // const [disableKeyboard, setDisableKeyboard] = useState(false);
  // const [autoFocus, setAutoFocus] = useState(true);

  const [selections, setSelections] = useState([
    {
      key: 0,
      answerText: 'Taming vices',
      selected: false,
    },
    {
      key: 1,
      answerText: 'Taming stress',
      selected: false,
    },
    {
      key: 2,
      answerText: 'Taming anxiety',
      selected: false,
    },
    {
      key: 3,
      answerText: 'Learning',
      selected: false,
    },
    {
      key: 4,
      answerText: 'Sleeping well',
      selected: false,
    },
    {
      key: 5,
      answerText: 'Eating well',
      selected: false,
    },
    {
      key: 6,
      answerText: 'Being productive',
      selected: false,
    },
    {
      key: 7,
      answerText: 'Communicating\neffectively',
      selected: false,
    },
    {
      key: 8,
      answerText: 'Other',
      selected: false,
    },
    //    NEXT SLIDE
    {
      key: 9,
      answerText: '12+',
      selected: false,
    },
    {
      key: 10,
      answerText: '8-12',
      selected: false,
    },
    {
      key: 11,
      answerText: '4-8',
      selected: false,
    },
    {
      key: 12,
      answerText: '1-4',
      selected: false,
    },
  ]);

  const [introSlides, setIntroSlides] = useState([
    {
      key: 0,
      backgroundColor: colors.pastelRed,
      image: require('./assets/icons/Group.png'),
      title: 'Hello!',
      text: "I'm Roubine.",
      nextText: "what's your name?",
      nameForm: true,
    },
    {
      key: 1,
      backgroundColor: '#71778A',
      image: require('./assets/IntroSlides/landscape1.png'),
      component: 'second',
      nameForm: false,
    },
    {
      key: 2,
      backgroundColor: '#9298AD',
      image: require('./assets/IntroSlides/landscape2.png'),
      title: 'Real quick,',
      text: 'What do you feel is the most important right now?',
      answers: [
        {
          key: 0,
          answerText: selections[0].answerText,
        },
        {
          key: 1,
          answerText: selections[1].answerText,
        },
        {
          key: 2,
          answerText: selections[2].answerText,
        },
        {
          key: 3,
          answerText: selections[3].answerText,
        },
        {
          key: 4,
          answerText: selections[4].answerText,
        },
        {
          key: 5,
          answerText: selections[5].answerText,
        },
        {
          key: 6,
          answerText: selections[6].answerText,
        },
        {
          key: 7,
          answerText: selections[7].answerText,
        },
        {
          key: 8,
          answerText: selections[8].answerText,
        },
      ],
    },
    {
      key: 3,
      backgroundColor: '#A8C3D6',
      image: require('./assets/IntroSlides/landscape3.png'),
      title: 'And...',
      text: 'How many routines do you maintain as of now?',
      answers: [
        {
          key: 9,
          answerText: selections[9].answerText,
        },
        {
          key: 10,
          answerText: selections[10].answerText,
        },
        {
          key: 11,
          answerText: selections[11].answerText,
        },
        {
          key: 12,
          answerText: selections[12].answerText,
        },
      ],
    },
    {
      key: 4,
      backgroundColor: '#A0DCE9',
      image: require('./assets/IntroSlides/landscape4.png'),
      title: 'Finally,',
      text: 'Why is this important to you?',
    },
    {
      key: 5,
      backgroundColor: '#A7F0FF',
      image: require('./assets/IntroSlides/landscape5.png'),
      component: 'fourth',
    },
  ]);

  const postIntroAnswers = () => {
    if (isLoggedIn) {
      user.set(
        {
          introAnswers: selections,
        },
        { merge: true }
      );
    }
  };

  const postRewards = () => {
    if (isLoggedIn) {
      let amountAnswered = introSlides.filter((slide) => slide.selected).length;

      user.get().then((doc) => {
        let roubiesReward =
          safeParseFloat(doc?.data()?.Roubies) +
          amountAnswered * roubiesPerQuestion +
          roubiesForIntroCompletion;

        user.set(
          {
            Roubies: roubiesReward,
          },
          { merge: true }
        );
      });
    }
  };

  //NaN number handler
  const safeParseFloat = (str) => {
    const value = Number.parseFloat(str);

    return Number.isNaN(value) ? 0 : value;
  };

  const introSkipButton = () => {
    return (
      <View style={styles.introSkipButtonContainer}>
        <Text style={styles.introSkipButtonText}>skip</Text>
      </View>
    );
  };

  onContinuePress = () => {
    //continuePressed is true if:
    //  user has tapped screen once already
    //  OR
    //  animations have ended
    if (!continuePressed) {
      animatedTextRef1.current
        .animate(
          {
            0: { opacity: 1 },
            1: { opacity: 0 },
          },
          250
        )
        .then(setContinuePressed(true));

      setDelay(0);
      setHandComponentDelay(0);
      setDuration(200);
    } else {
      //stop ongoing animation, go to the next slide,
      animatedTextRef2.current.stopAnimation();
      introSlider.current.goToSlide(2);

      //enable scrolling and pagination
      setTimeout(() => {
        setScrollEnabled(true);
      }, 100);
    }
  };

  const LoginAsGuestComponent = () => {
    const [name, setName] = useState('');
    const signInAnonymously = () => {
      if (!name.trim()) {
      } else {
        auth.signInAnonymously().then((cred) => {
          return db.collection('Users').doc(cred.user.uid).set({
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
        <FloatingLabelInput
          // autoFocus={autoFocus}
          // isFocused={isNameFocused}
          // showSoftInputOnFocus={disableKeyboard}
          hint='...'
          staticLabel='...'
          hintTextColor={colors.darkmodeMediumWhite}
          inputStyles={styles.introInputStyles}
          customLabelStyles={{
            colorFocused: colors.darkmodeHighWhite,
            colorBlurred: colors.darkmodeHighWhite,
            fontSizeBlurred: 22,
            fontSizeFocused: 12,
          }}
          containerStyles={styles.introInputInternalContainer}
          // onFocus={() => {
          // setIsNameFocused(true);
          // setDisableKeyboard(false);
          // }}
          // onBlur={() => {
          //   setIsNameFocused(false);
          // }}
          rightComponent={
            name != '' || globalName != '' ? (
              <View style={{ padding: 12 }}>
                <TouchableOpacity
                  onPress={() => {
                    setName('');
                    setGlobalName('');
                    setIsNameFocused(false);
                    setScrollEnabled(false);
                  }}
                >
                  <MaterialCommunityIcons
                    name='close'
                    size={20}
                    color={colors.darkmodeMediumWhite}
                  />
                </TouchableOpacity>
              </View>
            ) : null
          }
          leftComponent={
            <Animatable.Text
              animation='pulse'
              style={[
                { paddingLeft: 20, paddingRight: 6 },
                styles.introText,
                { color: colors.darkmodeMediumWhite },
                isNameFocused
                  ? { color: colors.darkmodeHighWhite }
                  : { color: colors.darkmodeMediumWhite },
              ]}
            >
              Hey, I'm
            </Animatable.Text>
          }
          type='name'
          value={name ? name : globalName}
          onChangeText={(text) => setName(text)}
        />

        <TouchableOpacity
          style={styles.introContinueButton}
          onPress={() => {
            introSlider.current.goToSlide(1);
            setShowSkipButton(true);
            setGlobalName(name);
            signInAnonymously;
          }}
        >
          {(name != '' || globalName != '') && (
            <Animatable.Text
              animation='fadeIn'
              style={styles.introContinueButtonText}
            >
              continue
            </Animatable.Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const SecondSlideComponent = () => {
    setInterval(() => {
      if (handComponentRef.current) {
        handComponentRef.current.pulse(2000);
      }
    }, 5000);
    return (
      <TouchableWithoutFeedback
        style={{
          width: '100%',
        }}
        onPress={onContinuePress}
      >
        <View
          style={{
            height: 540,
            paddingHorizontal: 30,
            alignItems: 'center',
          }}
        >
          <Animatable.Text
            ref={animatedTextRef1}
            animation='fadeOut'
            delay={delay}
            duration={duration}
            style={[styles.introText, { fontSize: 30, position: 'absolute' }]}
          >
            Using psychology, we're going to get you to do what you{' '}
            <Text style={[styles.italics, { color: colors.pastelPink }]}>
              really
            </Text>{' '}
            want to do!
          </Animatable.Text>

          <Animatable.Text
            ref={animatedTextRef2}
            onAnimationEnd={() =>
              setTimeout(() => setContinuePressed(true), delay)
            }
            animation='fadeIn'
            delay={delay}
            duration={duration}
            style={[styles.introText, { fontSize: 30 }]}
          >
            But first, let's get to know each other
          </Animatable.Text>
        </View>
        {!scrollEnabled ? (
          <Animatable.View
            animation='fadeIn'
            style={{
              alignItems: 'flex-end',
            }}
          >
            <Animatable.View
              ref={handComponentRef}
              animation='fadeIn'
              delay={handComponentDelay}
              style={{
                height: 300,
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 20,
              }}
            >
              <Text style={styles.tapToContinue}>continue</Text>
              <Animatable.View>
                <MaterialCommunityIcons
                  name='gesture-tap'
                  size={36}
                  color={colors.darkmodeMediumWhite}
                />
              </Animatable.View>
            </Animatable.View>
          </Animatable.View>
        ) : null}
      </TouchableWithoutFeedback>
    );
  };
  const FourthSlideComponent = () => {
    return (
      <View>
        <Text
          style={[
            styles.introText,
            {
              fontSize: 22,
              paddingHorizontal: 22,
              textAlign: 'center',
              top: 45,
            },
          ]}
        >
          Big lifestyle changes are dauntingly difficult, and it's much easier
          to simply put them off (don't worry, I do it all the time too!) {'\n'}
          {'\n'}
          This is why we're going to focus on making this as{' '}
          <Text style={[styles.italics, { color: colors.pastelPink }]}>
            easy
          </Text>{' '}
          as possible, to focus on{' '}
          <Text style={[styles.italics, { color: colors.pastelPink }]}>
            consistency
          </Text>
          , and build from there.
          {'\n'}
          {'\n'}Following these principles, using psychology, behavioral
          science, and user data, you can predictably reach your goals.
        </Text>
      </View>
    );
  };

  const [refreshSlider, setRefreshSlider] = useState(false);
  const renderIntroAnswers = ({ item }) => {
    const selectAnswers = () => {
      let newSelection = selections;
      let boolVal = newSelection.find((obj) => obj.key === item.key).selected;
      newSelection.find((obj) => obj.key === item.key).selected = !boolVal;
      setSelections(newSelection);

      rewardAnswers();
    };

    //there's definitely a better way to do this that doesn't require
    //hardcoding indexes, but I'm a little burnt out
    //and this page is a mess depleting my brain RAM
    const rewardAnswers = () => {
      //using current answer keys,
      //find the same answers in the selections array
      let slideOneAnswers = selections.filter(
        (item) => item.key >= 0 && item.key <= 8
      );
      let slideTwoAnswers = selections.filter(
        (item) => item.key >= 9 && item.key <= 12
      );

      //check if there's anything selected
      let anythingSelectedSlideOne = slideOneAnswers?.some(
        (answer) => answer.selected
      );
      let anythingSelectedSlideTwo = slideTwoAnswers?.some(
        (answer) => answer.selected
      );

      //introslide copy
      let introSlidesWithSelected = introSlides;

      if (anythingSelectedSlideOne) {
        introSlidesWithSelected[2].selected = true;
      } else if (!anythingSelectedSlideOne) {
        introSlidesWithSelected[2].selected = false;
      }
      if (anythingSelectedSlideTwo) {
        introSlidesWithSelected[3].selected = true;
      } else if (!anythingSelectedSlideTwo) {
        introSlidesWithSelected[3].selected = false;
      }

      // replace introSlides to include selected
      setIntroSlides(introSlidesWithSelected);

      //refresh slider flatlist
      setRefreshSlider(!refreshSlider);
      setTimeout(() => setRefreshSlider(!refreshSlider), 300);
    };

    return (
      <View style={styles.inputContainer}>
        <View
          style={{
            zIndex: 0,
            // flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'center',
          }}
        >
          <BouncyCheckbox
            iconStyle={{
              borderWidth: 0,
              // borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,0.0)',
              marginLeft: 4,
              marginRight: -5,
            }}
            bounceEffect={1}
            bounceFriction={4}
            style={[
              {
                // backgroundColor: colors.pastelBlue,
                borderWidth: 2,
                borderColor: colors.darkmodeFocused,
                width: item.key >= 9 ? 85 : 260,
                height: 52,
                borderRadius: 3,
                zIndex: 2,
              },
            ]}
            textStyle={[
              styles.introText,
              {
                textDecorationLine: 'none',
                textAlign: 'left',
                // padding: 30,
                // paddingRight: 28,
                // position: 'absolute',
                // zIndex: 1,
                color: colors.darkmodeHighWhite,
                fontWeight: '600',
                fontSize: 20,
                left: -10,
              },
            ]}
            onPress={selectAnswers}
            text={item.answerText}
          ></BouncyCheckbox>
          <View
            style={{
              width: item.key >= 9 ? 84 : 260,
              position: 'absolute',
              top: 0,
              left: item.key >= 9 ? 155 : 70,
              right: 0,
              bottom: 0,
              // zIndex: -1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Svg style={{}}>
              <Defs>
                <Pattern
                  id='prefix__a'
                  width={15}
                  height={15}
                  viewBox='0 0 40 40'
                  patternUnits='userSpaceOnUse'
                  patternTransform='rotate(135)'
                >
                  <Rect width='400%' height='400%' fill='rgba(42, 67, 101,0)' />
                  <Circle
                    fill='rgba(255, 255, 255,0.6)'
                    cx={20}
                    cy={20}
                    r={2}
                  />
                  <Circle fill='rgba(255, 255, 255,0)' cx={20} cy={20} r={1} />
                  <Circle fill='rgba(255, 255, 255,0)' cx={-20} cy={20} r={1} />
                </Pattern>
              </Defs>
              <Rect fill='url(#prefix__a)' height='100%' width='100%' />
            </Svg>
          </View>
        </View>
      </View>
    );
  };
  const IntroDoneButton = () => {
    return (
      <Animatable.View
        animation='fadeIn'
        duration={4000}
        style={styles.introDoneButtonContainer}
      >
        <Pressable
          onPress={() => {
            console.log('hej2');
            postIntroAnswers();
            postRewards();
            setShowIntro(false);
          }}
        >
          <Animatable.View animation='fadeInUp' duration={1000}>
            <Animatable.Text
              ellipsizeMode='clip'
              numberOfLines={1}
              animation='pulse'
              style={styles.introDoneButtonText}
            >
              I'm ready
            </Animatable.Text>
          </Animatable.View>
        </Pressable>
      </Animatable.View>
    );
  };
  const [importance, setImportance] = useState('');
  const renderIntroSlides = ({ item }) => {
    return (
      <View
        style={[
          item.key == 0
            ? { justifyContent: 'center' }
            : { justifyContent: 'flex-start' },
          {
            backgroundColor: item.backgroundColor,
            alignItems: 'center',
            flexGrow: 1,
          },
          styles.introScreen,
        ]}
      >
        <Image
          source={item.image}
          style={[
            {
              bottom: 0,
              right: 0,
              width: item.key === 0 ? 120 : width,
              height: item.key === 0 ? 120 : height,
              zIndex: 0,
            },
            item.key != 0 && { position: 'absolute' },
          ]}
        />

        {item.key == 1 && (
          <LinearGradient
            style={{
              flex: 1,
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: -1,
            }}
            colors={['rgba(0,0,0,0.0)', '#303852']}
          ></LinearGradient>
        )}

        <View style={styles.introContainer}>
          <Animatable.View animation='fadeIn'>
            <Animatable.Text
              animation={item.key == 0 ? 'fadeOut' : 'fadeIn'}
              delay={3200}
              duration={1900}
              style={[
                styles.introTitle,
                item.key != 0 && { textAlign: 'left' },
              ]}
            >
              {item.title}
            </Animatable.Text>
            {item.component === 'second' ? <SecondSlideComponent /> : null}
            {item.component === 'fourth' ? <FourthSlideComponent /> : null}

            <Animatable.Text
              animation={item.key == 0 ? 'fadeOut' : 'fadeIn'}
              delay={3000}
              style={[
                styles.introText,
                { paddingBottom: 14, paddingHorizontal: 30 },
                item.key == 0 && {
                  textAlign: 'center',
                },
              ]}
            >
              {item.text}
            </Animatable.Text>
            {item.nextText && (
              <Animatable.Text
                animation='fadeIn'
                delay={3000}
                style={[
                  styles.introText,
                  item.key == 0 && {
                    textAlign: 'center',
                    paddingBottom: 8,
                  },
                ]}
              >
                {item.nextText}
              </Animatable.Text>
            )}
            {item.nameForm && (
              <Animatable.View animation='fadeIn' delay={4200} duration={1000}>
                <LoginAsGuestComponent />
              </Animatable.View>
            )}
            <IntroDoneButton />
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-around' }}
            >
              {item.answers && item.answers.length > 0 && (
                <View>
                  <FlatList
                    data={item.answers}
                    renderItem={renderIntroAnswers}
                    horizontal={true}
                  />
                </View>
              )}
              {item.selected && (
                <View style={styles.rewardPopupContainer}>
                  <View
                    style={{
                      // alignSelf: 'flex-end',
                      //marginRight: 300,
                      // marginTop: 542,
                      padding: 5,
                      // backgroundColor: colors.darkmodeFocused,
                      // borderRadius: 5,
                      // borderWidth: 1,
                      // borderColor: colors.darkmodeDisabledWhite,
                    }}
                  >
                    <Animatable.Text
                      animation='bounceInUp'
                      style={{
                        fontSize: 20,
                        textAlign: 'right',
                        color: colors.darkmodeSuccessColor,
                        fontWeight: '600',
                        alignContent: 'flex-end',
                      }}
                    >
                      +5{' '}
                      <FontAwesome5
                        name='gem'
                        size={24}
                        color={colors.darkmodeSuccessColor}
                      />
                    </Animatable.Text>
                  </View>
                </View>
              )}
            </View>
            {item.key === 4 && (
              <View>
                <Text
                  style={[
                    styles.introText,
                    { paddingHorizontal: 32, fontSize: 20 },
                  ]}
                >
                  Before starting a course, students told to write down why
                  their course mattered to them, performed on average 40% better
                </Text>
                <View
                  style={{
                    width: 340,
                    paddingTop: 20,
                    alignSelf: 'center',
                  }}
                >
                  <FloatingLabelInput
                    label="Doesn't have to be much, but details help!"
                    value={importance}
                    hintTextColor={colors.darkmodeDisabledText}
                    hint='One must imagine Sisyphus happy'
                    animationDuration={175}
                    multiline={true}
                    containerStyles={{
                      borderWidth: 3,
                      paddingHorizontal: 10,
                      borderColor: colors.darkmodeMediumWhite,
                      borderRadius: 5,
                      backgroundColor: colors.darkmodeFocused,
                    }}
                    customLabelStyles={{
                      colorBlurred: colors.darkmodeHighWhite,
                      colorFocused: colors.darkmodeMediumWhite,
                      fontSizeFocused: 12,
                      fontSizeBlurred: 14,
                      topBlurred: -42,
                    }}
                    inputStyles={{
                      fontSize: 16,
                      color: colors.pastelRed,
                      paddingHorizontal: 10,
                      minHeight: 120,
                      top: -28,
                    }}
                    rightComponent={
                      importance != '' && (
                        <View style={{ paddingRight: 2, paddingTop: 6 }}>
                          <TouchableOpacity
                            onPress={() => {
                              setImportance('');
                            }}
                          >
                            <MaterialCommunityIcons
                              name='close'
                              size={20}
                              color={colors.darkmodeMediumWhite}
                            />
                          </TouchableOpacity>
                        </View>
                      )
                    }
                    onChangeText={(value) => {
                      setImportance(value);
                    }}
                  />
                </View>
              </View>
            )}
          </Animatable.View>
        </View>
      </View>
    );
  };

  const checkIfIntroCompleted = (dbUser) => {
    if (dbUser) {
      setShowIntro(false);
    } else {
      setShowIntro(true);
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState('');
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        let dbUser = db.collection('Users').doc(user.uid);

        setUser(dbUser);

        console.log('logged in ', user.uid);

        setIsLoggedIn(true);

        dbUser
          .get()
          .then((doc) => checkIfIntroCompleted(doc.data().introAnswers));
      } else {
        setUser(db.collection('Users').doc(user.uid));
        console.log('NOT logged in ', user);
        setIsLoggedIn(false);
      }
    });
  }, [auth.user]);

  const updateRank = () => {
    if (isLoggedIn) {
      user.get().then((doc) => {
        //get user exp
        let experience = doc.data().Exp ? doc.data().Exp : 0;

        //decide rank by exp
        let newRank = 0;
        if (experience > 90) {
          newRank = 3;
        } else if (experience > 60) {
          newRank = 2;
        } else if (experience < 30) {
          newRank = 1;
        }

        //set rank
        user.update({
          UserRank: newRank,
        });
      });
    }
  };

  const rewardAddedRoutine = () => {
    if (isLoggedIn) {
      user.get().then((doc) => {
        const routineRef = db.collection('Users').doc(auth.currentUser.uid);

        let roubieReward =
          safeParseFloat(doc?.data()?.Roubies) + rewardForAddingRoutine;
        let expReward =
          safeParseFloat(doc?.data()?.Exp) + rewardForAddingRoutine;

        routineRef.set(
          {
            Roubies: roubieReward,
            Exp: expReward,
          },
          { merge: true }
        );
      });
    }
  };

  var initState = true;
  useEffect(() => {
    if (isLoggedIn) {
      //use as conditional to prevent
      //onsnapshot to use initial state
      //(otherwise it runs every time you start the app
      // giving the user free rewards)

      const subscriber = db
        .collection('Users')
        .doc(auth.currentUser.uid)
        .collection('routines')
        .onSnapshot((documentSnapshot) => {
          if (initState) {
            initState = false;
            updateRank();
          } else {
            documentSnapshot.docChanges().forEach((change) => {
              if (change.type === 'added') {
                console.log('expReward ');
                rewardAddedRoutine();
              }
            });
            subscriber();
          }
        });
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
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: config,
              close: config,
            },
          }}
          headerMode='float'
        >
          <RootStack.Screen
            name='Home'
            component={TabBar}
            options={{
              headerRight: () => headerRoubinesButton(),
              headerShown: true,
              headerLeft: () => null,
            }}
          />
          <RootStack.Screen
            name='Profile'
            component={ProfileStackScreen}
            options={{ title: 'Profile' }}
          />
          <RootStack.Screen name='Register' component={RegisterScreen} />
          <RootStack.Screen name='Login' component={LoginScreen} />
          <RootStack.Screen
            name='Reset Password'
            component={ResetPasswordScreen}
          />
          <RootStack.Screen
            name='Browse Routines'
            component={RoutinesStackScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name='Notification Settings'
            component={NotificationSettingScreen}
            options={{ headerRight: () => headerRoubinesButton() }}
          />
          <RootStack.Screen name='Settings' component={SettingsScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  } else {
    content = (
      <NavigationContainer>
        <Stack.Navigator screenOptions={defaultScreenOptions}>
          <Stack.Screen
            name='Welcome'
            component={WelcomeScreen}
            options={{
              animationEnabled: false,
            }}
          />
          <Stack.Screen name='Reset Password' component={ResetPasswordScreen} />
          <Stack.Screen name='Register' component={RegisterScreen} />
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='LoginAsGuest' component={LoginAsGuestScreen} />
          <Stack.Screen name='AddRoutine' component={AddRoutineScreen} />
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
        onDone={() => {
          postIntroAnswers();
          postRewards();
          setShowIntro(false);
        }}
        showDoneButton={false}
        // renderDoneButton={introDoneButton}
        renderSkipButton={introSkipButton}
        showNextButton={false}
        showSkipButton={showSkipButton}
        // bottomButton={true}
        scrollEnabled={true}
        dotStyle={{
          backgroundColor: colors.darkmodeDisabledWhite,
          height: 6,
          width: 6,
        }}
        activeDotStyle={{ backgroundColor: 'rgba(0,0,0,0.0)' }}
        // onSlideChange
        extraData={refreshSlider}
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
        bottomButton={false}
        scrollEnabled={false}
        renderPagination={(index) => null}

        // dotStyle
        // activeDotStyle

        // onSlideChange
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    bottom: 40,
  },
  inputContainer: {
    marginRight: 26,
    marginVertical: 4,
    width: width,
  },
  introScreen: {
    width: '100%',
    // top: -200,
  },
  introContainer: {
    flexDirection: 'column',
    // flex: 1,
  },
  introTitle: {
    padding: 30,
    paddingBottom: 24,
    top: 20,
    fontSize: 44,
    color: colors.darkmodeHighWhite,
    textAlign: 'center',
  },
  introText: {
    color: colors.darkmodeHighWhite,
    fontSize: 24,
    textAlign: 'left',
  },
  introInputContainer: {
    width: 375,
  },
  introInputInternalContainer: { height: 55 },
  introInput: {},
  introCheckBox: {},
  introInputStyles: {
    color: colors.darkmodeHighWhite,
    fontSize: 26,
  },
  introSkipButtonContainer: {
    padding: 16,
    bottom: 4,
    borderRadius: 15,
  },
  introSkipButtonText: {
    fontSize: 18,
    color: colors.darkmodeDisabledWhite,
    textAlign: 'center',
  },
  introDoneButtonContainer: {
    alignSelf: 'center',
    // backgroundColor: colors.darkmodeFocused,
    // bottom: 286,
    height: 55,
    width: 160,
    alignItems: 'center',
    // marginTop: 200,
    paddingTop: 55,
  },
  introDoneButtonText: {
    width: 130,
    fontSize: 32,
    color: colors.pastelPink,
    textAlign: 'center',
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.pastelPink,
  },
  introContinueButton: {},
  introContinueButtonText: {
    fontSize: 16,
    color: colors.darkmodeMediumWhite,
    textAlign: 'right',
    paddingRight: 18,
  },
  tapToContinue: {
    color: colors.darkmodeMediumWhite,
    fontSize: 18,
  },
  rewardPopupContainer: {
    position: 'absolute',
    marginTop: 537,
    paddingRight: 0,
    left: 316,
  },
  italics: {
    fontStyle: 'italic',
  },
});

//  TODO
// sunrise vectors on top of everything:
//  try: ItemSeparatorComponent
//       ListFooterComponent
//       ListHeaderComponent
// fast image component
//
//  lägga till roubies när dokument/kollektioner ändras:
//    - när användaren lägger till en rutin
//    - när användaren bockar av en rutin
//      - när användaren bockar av med kombo
//    - när användaren levlar upp
//    -
