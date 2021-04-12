import React, { useState, useEffect } from "react";
import { Text } from "react-native";

import * as Animatable from "react-native-animatable";

import { FontAwesome } from "@expo/vector-icons";

import colors from "../config/colors";

function Tag({ content, difficulty, lock, style }) {
  const [stars, setStars] = useState();

  useEffect(() => {
    if (difficulty == 0) {
      setStars("Unrated");
    } else if (difficulty == 1) {
      setStars("★☆☆");
    } else if (difficulty == 2) {
      setStars("★★☆");
    } else if (difficulty == 3) {
      setStars("★★★");
    }
  }, []);

  return (
    <Animatable.View
      animation={"fadeIn"}
      useNativeDriver={true}
      style={[
        {
          backgroundColor: "rgba(0,0,0,0.2)",
          height: 20,
          padding: 1,
          paddingBottom: 23,
          paddingHorizontal: 7,
          borderRadius: 3,
          margin: 3,
          borderWidth: 1,
          borderColor: colors.darkmodeMediumWhite,
        },
        style,
      ]}
    >
      {content && (
        <Text
          style={{
            color: colors.darkmodeHighWhite,
            fontSize: 14,
            fontWeight: "700",
          }}
        >
          {content}
        </Text>
      )}
      {stars && (
        <Text
          style={{
            color: colors.darkmodeHighWhite,
            fontSize: 14,
            fontWeight: "700",
          }}
        >
          {stars}
        </Text>
      )}
      {lock && (
        <Text
          style={{
            paddingTop: 2,
          }}
        >
          <FontAwesome name="lock" size={18} color={colors.darkmodeDragged} />
        </Text>
      )}
    </Animatable.View>
  );
}

export default Tag;
