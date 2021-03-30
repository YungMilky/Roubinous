import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";

import {
  ExpandingDot,
  ScalingDot,
  SlidingDot,
  SlidingBorder,
  LiquidLike,
} from "react-native-animated-pagination-dots";

import { LinearGradient } from "expo-linear-gradient";

import AppLoading from "expo-app-loading";

import { useFonts, BadScript_400Regular } from "@expo-google-fonts/bad-script";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as Animatable from "react-native-animatable";

import { SharedElement } from "react-navigation-shared-element";

import Screen from "../components/Screen";
import AppButton from "../components/AppButton";
import colors from "../config/colors";
import RoutineDetails from "../components/RoutineDetails";

const { width, height } = Dimensions.get("screen");
const ITEM_HEIGHT = height * 0.18;
const ITEM_SIZE = width * 0.9;

const RoutineScreen = ({ navigation, route }) => {
  let [fontsLoaded, error] = useFonts({
    BadScript_400Regular,
  });

  const { item } = route.params;

  const difficultyRank = item.difficulty;
  const [stars, setStars] = useState();
  useEffect(() => {
    if (difficultyRank === "Low") {
      setStars("★☆☆");
    } else if (difficultyRank === "Medium") {
      setStars("★★☆");
    } else if (difficultyRank === "High") {
      setStars("★★★");
    }
  }, []);

  const scrollX = React.useRef(new Animated.Value(0)).current;

  const [currentIndex, setCurrentIndex] = useState();
  const [refFlatList, setrefFlatList] = useState();

  const getItemLayout = (data, index) => {
    setCurrentIndex(index);
    return { length: ITEM_SIZE, offset: ITEM_SIZE, index };
  };

  const scrollToItem = () => {
    refFlatList.scrollToIndex({ animated: true, index: currentIndex });
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    console.log(item.image);
    return (
      <Screen style={{ backgroundColor: item.color }}>
        <SharedElement
          id={`item.${item.id}.color`}
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: item.color },
          ]}
        >
          <LinearGradient
            colors={[
              colors.OrchidPink,
              colors.darkmodeDisabledWhite,
              colors.yungBlue,
            ]}
            style={styles.background}
            start={{ x: 5, y: 0.01 }}
            end={{ x: 0.1, y: 0.3 }}
            // locations={[0.4, 0.1]}
          ></LinearGradient>
        </SharedElement>
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
          <View style={styles.imgcontainer}>
            <SharedElement id={`item.${item.id}.image`} style={styles.two}>
              <Animatable.Image
                source={{ uri: item.image }}
                animation="bounceIn"
                duration={1200}
                style={styles.image}
              />
            </SharedElement>
          </View>
          <SharedElement id={`item.${item.id}.title`} style={styles.three}>
            <Animatable.Text
              animation="fadeIn"
              duration={2000}
              style={styles.title}
            >
              {item.title}
            </Animatable.Text>
          </SharedElement>
          <Text style={styles.difficultyRating}>
            {"   "}difficulty: {stars}
          </Text>
          {/* <ExpandingDot
            data={items}
            expandingDotWidth={20}
            inActiveDotOpacity={0.6}
            scrollX={scrollX}
            dotStyle={{
              backgroundColor: colors.darkmodeHighWhite,
              width: 8,
              height: 8,
              borderRadius: 5,
              marginHorizontal: 5,
            }}
            containerStyle={{
              right: width * 0.11,
              bottom: height * 0.443,
            }}
          /> */}

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
            bounces={false}
            horizontal
            renderItem={({ item }) => (
              <RoutineDetails description={item} size={ITEM_SIZE} />
            )}
          />
          <View style={styles.buttonContainer}>
            <AppButton
              style={styles.five}
              textStyle={{ color: "rgba(0,0,0,0.64)" }}
              title={"I got this!"}
              onPress={scrollToItem}
            />
          </View>
        </View>
      </Screen>
    );
  }
};

//  TODO:
//  clean up
//  I GOT THIS! route
//  automate pagination
//  lineargradient sharedelement
//  Routines har ingen tabbar

//  DONE:
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

//  HISTORY
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
    position: "absolute",
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
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: "BadScript_400Regular",
    alignItems: "center",
    fontSize: 38,
    color: colors.darkmodeHighWhite,
  },

  flatlist: {},

  buttonContainer: {
    width: width,
    left: -12,
    bottom: -18,
  },
  //  Button
  five: {
    padding: 0,
    backgroundColor: colors.darkmodeHighWhite,
  },

  screen: {
    // flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    height: height,
    width: width,
  },
  closeButton: {
    padding: 20,
  },

  imgcontainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: height * 0.032,
  },
  image: {
    width: ITEM_HEIGHT * 1.24,
    height: ITEM_HEIGHT * 1.6,
  },

  difficultyRating: {
    left: 28,
    bottom: 10,
    paddingBottom: 6,
    alignItems: "center",
    fontSize: 15,
    color: colors.darkmodeMediumWhite,
  },
});

RoutineScreen.sharedElements = (route, otherRoute, showing) => {
  const { item } = route.params;

  return [
    {
      id: `item.${item.id}.title`,
    },
    {
      id: `item.${item.id}.image`,
    },
    {
      id: `item.${item.id}.color`,
    },
  ];
};

export default RoutineScreen;
