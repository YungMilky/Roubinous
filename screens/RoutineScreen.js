import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  FlatList,
  Modal,
  Easing,
  Pressable,
} from 'react-native';

import AppLoading from 'expo-app-loading';

import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, BadScript_400Regular } from '@expo-google-fonts/bad-script';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import WeekdayPicker from 'react-native-weekday-picker';
import {
  ToastBannerProvider,
  ToastBannerPresenter,
  useToastBannerToggler /* or withToastBannerToggler */,
  Transition,
} from 'react-native-toast-banner';

// import { SharedElement } from "react-navigation-shared-element";

import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import colors from '../config/colors';
import RoutineDetails from '../components/RoutineDetails';
import AppText from '../components/AppText';

import { Audio } from 'expo-av';
import AddRoutine from '../components/AddRoutine';
import AddAndRemoveButton from '../components/AddAndRemoveButton';
import { TouchableWithoutFeedback } from 'react-native';
import RemoveRoutine from '../components/RemoveRoutine';

const { width, height } = Dimensions.get('screen');
const ITEM_HEIGHT = height * 0.18;
const ITEM_SIZE = width * 0.9;

const RoutineScreen = ({ navigation, route }) => {
  const { showBanner, hideBanner } = useToastBannerToggler();

  const DeleteRoutineToast = () => {
    /* If you don't want hooks, there is also HOC 'withToastBannerToggler' */
    const { showBanner, hideBanner } = useToastBannerToggler();

    const ContentView = () => {
      return (
        <View style={{ height: 120 }}>
          <Text
            style={{
              top: 60,
              fontSize: 18,
              color: colors.darkmodeHighWhite,
              textAlign: 'center',
            }}
          >
            Routine removed.
          </Text>
        </View>
      );
    };

    const onPress = () => {
      showBanner({
        contentView: <ContentView />,
        // defaultTextContainer: {
        //   padding: 10,
        //   fontSize: 16,
        //   color: colors.darkmodeHighWhite,
        // },
        backgroundColor: colors.samSexyRed /* default: undefined */,
        duration: 2500 /* default: 3000 */,
        transitions: [
          Transition.Move,
          Transition.MoveLinear,
          Transition.FadeInOut,
        ] /* default: [Transition.Move] */,
      });
    };

    return (
      showMinus && (
        <Animated.View
          style={{
            top: 20,
            width: animationWidth,
          }}
        >
          <Pressable
            onPress={() => {
              if (expanded) {
                toggleExpansion();
                setTimeout(() => setExpanded(true), 3000);
              } else {
                onPress();
                // setTimeout(() => toggleExpansion(), 500);
                RemoveRoutine(item.title);
                toggleShowMinus();
                setTimeout(() => {
                  setButtonDisabled(false);
                  setButtonTitle('Give it another shot');
                  item.removed = true;
                }, 550);
              }
            }}
            style={{
              // position: "absolute",
              zIndex: 1,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {!expanded && (
                <Text
                  // numberOfLines={expanded ? 1 : 0}
                  style={{
                    color: colors.darkmodeDisabledWhite,
                    fontWeight: '700',
                    fontSize: 16,
                    paddingRight: 6,
                  }}
                >
                  tap to quit
                </Text>
              )}
              <MaterialCommunityIcons
                name='minus'
                size={28}
                color={colors.darkmodeErrorColor}
              />
            </View>
          </Pressable>
        </Animated.View>
      )
    );
  };

  const { item } = route.params;

  let [fontsLoaded, error] = useFonts({
    BadScript_400Regular,
  });

  const difficulty = item.difficulty;
  const [stars, setStars] = useState('Unrated');
  useEffect(() => {
    if (difficulty == 0) {
      setStars('Unrated');
    } else if (difficulty == 1) {
      setStars('★☆☆');
    } else if (difficulty == 2) {
      setStars('★★☆');
    } else if (difficulty == 3) {
      setStars('★★★');
    }
  }, []);

  const [currentIndex, setCurrentIndex] = useState();

  const [showModal, setShowModal] = useState(false);

  const [buttonTitle, setButtonTitle] = useState(
    item.fromMyRoutines ? 'Ongoing routine' : 'I got this!'
  );
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [sound, setSound] = React.useState();

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/yeahhoe.mp3')
    );
    sound.setVolumeAsync(0.2);
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (item.lock) {
      setButtonTitle('Locked');
      setButtonDisabled(true);
    }
    if (!item.removed && item.alreadyAdded) {
      setButtonTitle('Ongoing routine');
      setButtonDisabled(true);
    } else if (item.removed) {
      setButtonTitle('Give it another shot');
      setButtonDisabled(false);
    }
  }, []);
  const getItemLayout = (data, index) => {
    setCurrentIndex(index);
    return { length: ITEM_SIZE, offset: ITEM_SIZE, index };
  };

  // kan vara bra för search
  // const scrollToItem = () => {
  //   refFlatList.scrollToIndex({ animated: true, index: currentIndex });
  // };

  const [descriptions, setDescriptions] = useState(() => {
    if (item.descriptionArray) {
      return item.descriptionArray.map((text, index) => ({
        text,
        key: index,
        toggled: false,
      }));
    } else if (item.shortDescription) {
      return { text: item.shortDescription, key: 0, toggled: false };
    } else return null;
  });

  const [selected, setSelected] = useState(0);

  const descriptionViewer = ({ item }) => {
    return (
      <View>
        <Pressable
          style={styles.descriptionContainer}
          onPress={() => {
            typeof descriptions[1] != 'undefined'
              ? setSelected(selected === item.key ? null : item.key)
              : null;
          }}
        >
          <View style={styles.descriptionWidth}>
            {item.key === selected ? (
              <View>
                <Animatable.Text
                  animation='bounceInUp'
                  duration={150}
                  easing={'ease-out-expo'}
                  useNativeDriver={true}
                  numberOfLines={30}
                  // ellipsizeMode={"end"}
                  style={styles.descriptionText}
                >
                  {item.text}
                </Animatable.Text>

                {typeof descriptions[1] != 'undefined' && (
                  <Pressable
                    style={{
                      height: 32,
                      marginBottom: -30,
                      marginTop: -16,
                    }}
                    onPress={() => {
                      setSelected(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.keepReading,
                        {
                          textAlign: 'right',
                          paddingRight: 8,
                          color: colors.darkmodeDisabledWhite,
                        },
                        typeof descriptions[item.key + 1] === 'undefined'
                          ? {
                              marginBottom: 20,
                            }
                          : null,
                      ]}
                    >
                      close
                    </Text>
                  </Pressable>
                )}
              </View>
            ) : (
              <View style={styles.separator}></View>
            )}
          </View>

          {item.key === selected &&
          typeof descriptions[item.key + 1] != 'undefined' ? (
            <View style={{ marginBottom: -30 }}>
              <View style={styles.separator}></View>
              <Pressable
                style={{
                  height: 40,
                }}
                onPress={() => {
                  setSelected(item.key + 1);
                }}
              >
                <Text style={[styles.keepReading]}>Keep reading...</Text>
              </Pressable>
            </View>
          ) : null}
        </Pressable>
        {/* <Pressable
          onPress={() => {
            // let toggled = descriptions.map((item) => {
            //   return { ...item, toggled: false };
            // });
            // toggled[item.key] = {
            //   ...toggled[item.key],
            //   toggled: !descriptions[item.key].toggled,
            // };
            // setDescriptions(toggled);
            // // //if 1 is open and two is closed
            // // if (expanded && !expandedTwo) {
            // //   toggleExpansionTwo();
            // //   //if 1 is closed and two is open
            // // } else if (!expanded && expandedTwo) {
            // //   toggleExpansion();
            // //   toggleExpansionTwo();
            // //   //if both are open
            // // } else {
            // //   toggleExpansion();
            // // }
          }}
          style={{ width: "100%", height: 40 }}
        >
          {/* {expanded && typeof item.descriptionArray[0 + 1] != "undefined" ? (
            <Text style={styles.keepReading}>Keep reading...</Text>
            ) : (
              <Text
              style={[
                styles.keepReading,
                { textAlign: "right", paddingRight: 40 },
              ]}
              >
              close
              </Text>
              )}  
        </Pressable> */}
      </View>
    );
  };

  const checkNumber = (number) => {
    if (number < 10) {
      number = '0' + number.toString();
    }
    return number;
  };
  let renderTimes = ({ item }) => {
    return (
      <View>
        {typeof item != 'undefined' ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                color: colors.darkmodeHighWhite,
                paddingRight: 8,
              }}
            >
              {item.hours &&
                checkNumber(item.hours) + ':' + checkNumber(item.minutes)}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const [showMinus, setShowMinus] = useState(item.removed ? false : true);
  const toggleShowMinus = () => {
    setShowMinus(!showMinus);
  };
  const [expanded, setExpanded] = useState(true);
  const animationWidth = useRef(new Animated.Value(2)).current;
  const toggleExpansion = () => {
    setExpanded(!expanded);
  };
  useEffect(() => {
    if (expanded) {
      Animated.timing(animationWidth, {
        duration: 400,
        toValue: 46,
        easing: Easing.bounce,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animationWidth, {
        duration: 100,
        toValue: 110,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  }, [expanded]);

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <Screen
        style={{
          backgroundColor: item.color ? item.color : colors.pastelRed,
          height: '100%',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={styles.one}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <MaterialCommunityIcons
              name='window-close'
              color={colors.darkmodeMediumWhite}
              size={28}
            />
          </TouchableOpacity>
          {item.alreadyAdded && !item.removed && (
            <ToastBannerProvider>
              <DeleteRoutineToast />
              <ToastBannerPresenter />
            </ToastBannerProvider>
          )}
        </View>
        <View style={styles.imgcontainer}>
          <View style={styles.two}>
            {item.image ? (
              <Image style={styles.image} source={{ uri: item.imageRoutine }} />
            ) : (
              <Image
                style={styles.imageDefault}
                source={require('../assets/RoutinesPics/defaultbig.png')}
              />
            )}
          </View>
        </View>
        <ScrollView>
          <View style={styles.container}>
            {/* <LinearGradient
              colors={[
                colors.OrchidPink,
                colors.darkmodeMediumWhite,
                item.color,
              ]}
              style={styles.background}
              start={{ x: 5, y: 0.01 }}
              end={{ x: 0.1, y: 0.3 }}
              // locations={[0.4, 0.1]}
            > */}

            <View style={styles.three}>
              {/* <SharedElement id={`item.${item.id}.title`} style={styles.three}> */}
              <Animatable.Text
                animation='fadeIn'
                useNativeDriver={true}
                duration={2100}
                style={styles.title}
              >
                {item.title}
              </Animatable.Text>
              {/* </SharedElement> */}
            </View>
            <Text style={styles.difficultyRating}>
              {'   '}difficulty: {stars}
            </Text>

            {item.descriptionArray ? (
              <FlatList data={descriptions} renderItem={descriptionViewer} />
            ) : (
              item.shortDescription &&
              item.shortDescription != '' && (
                <View style={styles.descriptionContainer}>
                  <View style={styles.descriptionWidth}>
                    <Animatable.Text
                      animation='bounceInUp'
                      duration={150}
                      easing={'ease-out-expo'}
                      useNativeDriver={true}
                      numberOfLines={30}
                      // ellipsizeMode={"end"}
                      style={styles.descriptionText}
                    >
                      {item.shortDescription}
                    </Animatable.Text>
                  </View>
                </View>
              )
            )}
            {/* </LinearGradient> */}
            <WeekdayPicker
              days={
                item.days
                  ? JSON.parse(item.days)
                  : JSON.parse('{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0}')
              }
              onChange={() => null}
              style={[
                styles.picker,
                !item.days ? { color: colors.darkmodeDisabledText } : null,
              ]}
            />
            {item.routineTimes && (
              <FlatList
                initialNumToRender={item.routineTimes.length}
                data={item.routineTimes}
                renderItem={renderTimes}
                updateCellsBatchingPeriod={0}
                windowSize={5}
                contentContainerStyle={{ flexGrow: 0 }}
              />
            )}
            {showModal && (
              <Modal
                style={{ margin: 0 }}
                animationType={'fade'}
                transparent={true}
                statusBarTranslucent={true}
                onShow={() => {
                  setTimeout(() => {
                    setShowModal(false);
                  }, 2700);
                  setTimeout(() => {
                    navigation.goBack();
                  }, 2800);
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.darkmodePressed,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 0,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: colors.darkOpacity,
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: height,
                      width: width,
                    }}
                  >
                    <Animatable.Image
                      source={require('../assets/RoutinesPics/anxious-mountain.png')}
                      animation={'bounceIn'}
                      useNativeDriver={true}
                      duration={1000}
                      style={styles.successModalImage}
                    />
                  </View>
                </View>
              </Modal>
            )}
          </View>
        </ScrollView>

        {!item.isCustom && (
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity
              style={[
                styles.button,
                buttonDisabled || item.fromMyRoutines
                  ? {
                      color: colors.darkmodeDisabledText,
                      backgroundColor: colors.darkmodeDisabledBlack,
                      borderTopWidth: 1,
                      borderRadius: 0,
                    }
                  : {
                      color: 'rgba(0,0,0,0.64)',
                      backgroundColor: colors.darkmodeHighWhite,
                      borderRadius: 0,
                    },
              ]}
              title={buttonTitle}
              disabled={buttonDisabled}
              onPress={() => {
                AddRoutine(item.title);
                setShowModal(true);
                playSound();
              }}
            >
              <Text
                style={[
                  buttonDisabled || item.fromMyRoutines
                    ? {
                        color: colors.darkmodeDisabledText,
                      }
                    : {
                        color: 'rgba(0,0,0,0.64)',
                      },
                  styles.buttonText,
                ]}
              >
                {buttonTitle}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Screen>
    );
  }
};

//  TODO:
//  settings button on notification screen
//  settings nested navigation
//  weird positioning on iOS? or differently sized screens
//  items, alreadyaddeditems, lockeditems.length ? render : null (entire flatlist)
//  reset appbutton
//  optimize
//  better AddAndRemoveButton on RoutineScreen
//  lock if user is at y level with x amount of routines
//  pull to refresh

//  ISSUES:
//  Show previous routine info if removed = true
//  style tags by default or non default image, not by locked/ongoing/rest
//  if routine is added in RoutinesScreen, it doesn't update "removed" in routineScreen
//  peep this https://rnfirebase.io/firestore/usage-with-flatlists
//  have only one open swipeable at any given point
//  some RoutinesScreen images are slightly above their touchables

//  DONE:
//  Thicker plus/minus symbols
//  Reposition styles
//  tried: top left bottom right sharp border, rest round
//  if removed = true, show "give it another shot" on routinescreen
//  show routines with removed: false on routinesscreen
//  remove swipeables
//  remove/add routine component
//  undo remove/add
//  tag styke add/remove button with animations
//  optimize
//  swipe to add/remove
//  add routine is now a component for use in more places
//  removed sharedelement
//  separated routine and routines pictures
//  routines style
//

//  HISTORY
//  update list on back
//  added sound lole
//  hide warning messages
//  searchbar
//  if user already has a routine display indicator on RoutinesScreen
//  divide by already added
//  if user already has a routine, make "I GOT THIS" unclickable and say "ONGOING ROUTINE"
//  if user rank is too low, make "I GOT THIS" unclickable and say "LOCKED"
//  unclickable touchableopacity
//  Default vector
//  RoutinesScreen style
//  RoutinesScreen difficulty
//  RoutinesScreen sort by difficulty
//  RoutinesScreen rank
//  RoutinesScreen locked routine indicator
//  assign item id based on index
//  flatlist optimization
//  on load animatable
//  I GOT THIS! db route
//  Success vector
//  RoutinesScreen colors translate to RoutineScreen colors
//  clean up
//  default image working
//  swiper
//  conditional swiper render
//  swiper animation
//  remove swiper on scroll
//  routines not loading fixed
//  images working
//  google sign in might be an issue
//  get difficulty
//  get descriptions
//  route params
//  animations
//  new vector design
//  style button
//  center image
//  pick better font
//  third gradient
//  AppButton.js ändringar, prata med max
//  Animation på AppText.js
//  flexbox
//  react-native-animated-pagination-dots
//  fonts
//  fixade janky uppstart på app.js
//  emulator batch file
//  magnetic pages
//  db interaction

const styles = StyleSheet.create({
  descriptionContainer: { width: '100%', alignItems: 'center' },
  descriptionWidth: { width: 340 },
  descriptionText: {
    paddingTop: 4,
    color: colors.darkmodeMediumWhite,
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'justify',
  },
  picker: {
    paddingTop: 10,
    marginBottom: 10,
  },
  button: {
    width: width,
    backgroundColor: '#F45B69',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '700',
  },

  container: {
    paddingHorizontal: 12,
  },
  // upper close button
  one: {
    top: 20,
    // position: "absolute",
    zIndex: 1,
    paddingLeft: 20,
  },
  // Image
  two: { alignItems: 'center' },
  //  Title
  imgcontainer: { top: 20 },
  image: {
    width: ITEM_HEIGHT * 1.24,
    height: ITEM_HEIGHT * 1.6,
    position: 'absolute',
  },
  imageDefault: {
    width: ITEM_HEIGHT * 2.6,
    height: ITEM_HEIGHT * 1.6,
    left: 40,
    top: 20,
  },
  three: {
    marginTop: 250,
    paddingBottom: 2,
    paddingLeft: 28,
  },
  title: {
    fontFamily: 'BadScript_400Regular',
    alignItems: 'center',
    fontSize: 38,
    color: colors.darkmodeHighWhite,
  },

  successModalImage: {
    bottom: -10,
    left: -6,
    width: width * 0.86,
    height: height * 0.45,
  },

  screen: {
    // flex: 1,
    // flexDirection: "column",
    // justifyContent: "flex-end",
    // alignItems: "center",
  },
  background: {
    position: 'absolute',
    // flex: 1,
    // zIndex: 2,
    height: height,
    width: width,
  },

  difficultyRating: {
    left: 28,
    bottom: 10,
    paddingBottom: 6,
    alignItems: 'center',
    fontSize: 15,
    color: colors.darkmodeMediumWhite,
  },
  separator: {
    paddingVertical: 16,
    width: 345,
    borderBottomColor: colors.darkmodeDisabledWhite,
    borderBottomWidth: 1,
  },
  keepReading: {
    paddingTop: 6,
    paddingBottom: 10,
    paddingLeft: 10,
    fontSize: 16,
    color: colors.darkmodeMediumWhite,
  },
});

// RoutineScreen.sharedElements = (route, otherRoute, showing) => {
//   const { item } = route.params;

//   return [
//     // {
//     //   id: `item.${item.id}.title`,
//     // },
//     {
//       id: `item.${item.id}.image`,
//     },
//     {
//       id: `item.${item.id}.color`,
//     },
//   ];
// };

export default RoutineScreen;
