import React from "react";
import { Image, TouchableOpacity, TouchableHighlight } from "react-native";
import { View, StyleSheet, Dimensions } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import * as Animatable from "react-native-animatable";

const { width, height } = Dimensions.get("screen");

function RoutineDetails({ description, size }) {
  return (
    <View style={[styles.container, { width: size }]}>
      <Animatable.View animation="fadeIn" duration={800} style={{ flex: 2 }}>
        <AppText
          duration={2100}
          adjustsFontSizeToFit={true}
          numberOfLines={10}
          minimumFontScale={0.76}
          style={styles.description}
        >
          {description}
        </AppText>
      </Animatable.View>
      <View style={{ flex: 1 }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height * 0.33,
    paddingLeft: 30,
    paddingRight: 12,
  },
  description: {
    color: colors.darkmodeMediumWhite,
    fontSize: 26,
    lineHeight: 28,
    textAlign: "justify",
  },
});

export default RoutineDetails;
