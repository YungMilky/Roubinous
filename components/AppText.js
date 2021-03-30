import React from "react";
import { Text, StyleSheet, Platform } from "react-native";

import * as Animatable from "react-native-animatable";

function AppText({
  children,
  style,
  adjustsFontSizeToFit,
  minimumFontScale,
  numberOfLines,
}) {
  return (
    <Animatable.Text
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      numberOfLines={numberOfLines}
      animation="fadeIn"
      style={[styles.text, style]}
    >
      {children}
    </Animatable.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
  },
});

export default AppText;
