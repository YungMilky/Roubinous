import React from "react";
import { Image, TouchableOpacity, TouchableHighlight } from "react-native";
import { View, StyleSheet } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

import * as Animatable from "react-native-animatable";

import { SharedElement } from "react-navigation-shared-element";

function RoutineItems({
  title,
  image,
  shortDescription,
  userLevelReq,
  onPressOut,
  item,
}) {
  return (
    <TouchableHighlight
      delayPressIn={200}
      activeOpacity={0.9}
      underlayColor={colors.white}
      onPressOut={onPressOut}
    >
      <Animatable.View
        style={{ flex: 1, padding: 20 }}
        animation="bounceIn"
        delay={420}
      >
        <SharedElement
          id={`item.${item.id}.color`}
          style={[StyleSheet.absoluteFillObject]}
        >
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: item.color, borderRadius: 6 },
            ]}
          />
        </SharedElement>
        <View style={styles.container}>
          <SharedElement id={`item.${item.id}.image`} style={styles.image}>
            <Image style={styles.image} source={image} />
          </SharedElement>
          <View>
            <SharedElement id={`item.${item.id}.title`}>
              <AppText style={styles.title}>{title}</AppText>
            </SharedElement>
            <AppText style={styles.subtitle}>{shortDescription}</AppText>
            <AppText style={styles.userLevelReq}>{userLevelReq}</AppText>
          </View>
        </View>
      </Animatable.View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  title: {
    marginLeft: 5,
    fontSize: 28,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    marginLeft: 5,
  },
  userLevelReq: {
    fontSize: 15,
    marginLeft: 7,
    marginTop: 25,
    color: colors.samGreen,
  },
});

export default RoutineItems;
