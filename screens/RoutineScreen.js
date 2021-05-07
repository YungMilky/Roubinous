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
} from 'react-native';

import AppLoading from 'expo-app-loading';

import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, BadScript_400Regular } from '@expo-google-fonts/bad-script';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

// import { SharedElement } from "react-navigation-shared-element";

import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import colors from '../config/colors';
import RoutineDetails from '../components/RoutineDetails';
import AppText from '../components/AppText';

import { Audio } from 'expo-av';
import AddRoutine from '../components/AddRoutine';
import AddAndRemoveButton from '../components/AddAndRemoveButton';

const { width, height } = Dimensions.get('screen');
const ITEM_HEIGHT = height * 0.18;
const ITEM_SIZE = width * 0.9;

const RoutineScreen = ({ navigation, route }) => {
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

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState();
  const [refFlatList, setrefFlatList] = useState();

  const [animation, setAnimation] = useState('fadeIn');
  const [duration, setDuration] = useState(1800);

  const [showSwiper, setShowSwiper] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [buttonTitle, setButtonTitle] = useState('I got this!');
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

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <Screen style={{ backgroundColor: item.color, marginTop: -25 }}>
        {/* <SharedElement id={`item.${item.id}.color`} style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: item.color },
          ]}> */}
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: item.color },
          ]}
        >
          <LinearGradient
            colors={[colors.OrchidPink, colors.darkmodeMediumWhite, item.color]}
            style={styles.background}
            start={{ x: 5, y: 0.01 }}
            end={{ x: 0.1, y: 0.3 }}
            // locations={[0.4, 0.1]}
          ></LinearGradient>
        </View>
        {/* </SharedElement> */}
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.one}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <MaterialCommunityIcons
              name="window-close"
              color={colors.darkmodeMediumWhite}
              size={28}
            />
          </TouchableOpacity>
          {item.alreadyAdded && !item.removed && (
            <AddAndRemoveButton
              check={false}
              routine={item.title}
              style={{
                backgroundColor: 'rgba(0.0.0.0,0)',
                borderWidth: 0,
              }}
              // size={40}
            />
          )}

          <View style={styles.imgcontainer}>
            <View style={styles.two}>
              {/* <SharedElement id={`item.${item.id}.image`} style={styles.two}> */}
              {item.image ? (
                <Image
                  style={styles.image}
                  source={{ uri: item.imageRoutine }}
                />
              ) : (
                <Image
                  style={styles.imageDefault}
                  source={require('../assets/RoutinesPics/defaultbig.png')}
                />
              )}
              {/* </SharedElement> */}
            </View>
          </View>
          <View style={styles.three}>
            {/* <SharedElement id={`item.${item.id}.title`} style={styles.three}> */}
            <Animatable.Text
              animation="fadeIn"
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

          <FlatList
            ref={(ref) => setrefFlatList(ref)}
            style={styles.flatlist}
            data={item.descriptionArray}
            getItemLayout={getItemLayout}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                useNativeDriver: false,
              }
            )}
            snapToAlignment="center"
            scrollEventThrottle={16}
            snapToInterval={ITEM_SIZE}
            decelerationRate={0}
            snapToAlignment={'center'}
            bounces={false}
            horizontal
            onScrollBeginDrag={() => {
              setShowSwiper(!showSwiper);
            }}
            renderItem={({ item }) => (
              <RoutineDetails description={item} size={ITEM_SIZE} />
            )}
            bounces={true}
          />
          {showSwiper &&
            typeof item.descriptionArray != 'undefined' &&
            item.descriptionArray.length >= 1 && (
              <Animatable.Image
                source={require('../assets/RoutinesPics/swipe-left.gif')}
                delay={2100}
                animation={animation}
                useNativeDriver={true}
                onAnimationEnd={() => {
                  setDuration(500);
                  setTimeout(() => {
                    setAnimation('fadeOut');
                  }, 2900);
                }}
                duration={duration}
                style={styles.swiper}
                tintColor={colors.darkmodeMediumWhite}
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

          <View style={styles.buttonContainer}>
            <AppButton
              style={
                buttonDisabled
                  ? {
                      color: colors.darkmodeDisabledText,
                      height: 55,
                      backgroundColor: colors.darkmodeDisabledBlack,
                      borderTopWidth: 1,
                    }
                  : {
                      color: 'rgba(0,0,0,0.64)',
                      height: 55,
                      backgroundColor: colors.darkmodeHighWhite,
                    }
              }
              textStyle={
                buttonDisabled
                  ? {
                      color: colors.darkmodeDisabledText,
                    }
                  : {
                      color: 'rgba(0,0,0,0.64)',
                    }
              }
              title={buttonTitle}
              disabled={buttonDisabled}
              onPress={() => {
                AddRoutine(item.title);
                setShowModal(true);
              
                playSound();
              }}
            />
          </View>
        </View>
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
  container: {
    paddingHorizontal: 12,
  },
  // Close button
  one: {
    top: height * 0.06,
    position: 'absolute',
    zIndex: 1,
    paddingLeft: 20,
  },
  // Image
  two: {
    flex: 1,
    marginBottom: 178,
    padding: 40,
  },
  //  Title
  three: {
    flex: 1,
    paddingTop: 38,
    paddingBottom: 28,
    paddingLeft: 28,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'BadScript_400Regular',
    alignItems: 'center',
    fontSize: 38,
    color: colors.darkmodeHighWhite,
  },

  swiper: {
    position: 'absolute',
    width: 55,
    height: 55,
    top: height * 0.732,
    left: width * 0.74,
  },

  flatlist: {},

  buttonContainer: {
    position: 'absolute',
    top: height * 0.86,
    width: width,
  },
  //  Button
  five: {
    width: width,
    height: height,
    position: 'absolute',
    height: 55,
    backgroundColor: colors.darkmodeHighWhite,
  },

  successModalImage: {
    bottom: -10,
    left: -6,
    width: width * 0.86,
    height: height * 0.45,
  },

  screen: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    height: height,
    width: width,
  },
  closeButton: {
    padding: 20,
  },

  imgcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.032,
  },
  image: {
    width: ITEM_HEIGHT * 1.24,
    height: ITEM_HEIGHT * 1.6,
  },
  imageDefault: {
    width: ITEM_HEIGHT * 2.6,
    height: ITEM_HEIGHT * 1.6,
    left: 40,
    top: 20,
  },

  difficultyRating: {
    left: 28,
    bottom: 10,
    paddingBottom: 6,
    alignItems: 'center',
    fontSize: 15,
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
