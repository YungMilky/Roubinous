import React from "react";
import { Image, TouchableOpacity, TouchableHighlight } from "react-native";
import { View, StyleSheet } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

function RoutineItems({ title, image, subtitle, userLevelReq, onPressOut }) {
  return (
    <TouchableHighlight
      delayPressIn={200}
      activeOpacity={0.9}
      underlayColor={colors.white}
      onPressOut={onPressOut}
    >
      <View style={styles.container}>
        <Image style={styles.image} source={image} />
        <View>
          <AppText style={styles.title}>{title}</AppText>
          <AppText style={styles.subtitle}>{subtitle}</AppText>
          <AppText style={styles.userLevelReq}>{userLevelReq}</AppText>
        </View>
      </View>
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
    fontSize: 20,
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
