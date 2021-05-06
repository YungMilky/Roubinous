import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { db, auth } from "../firebase";

import colors from "../config/colors";
import Screen from "../components/Screen";

const JourneyScreen = ({ navigation }) => {
  const [totalRoubies, setTotalRoubies] = useState("");
  const user = auth.currentUser;

  const getUserInfo = () => {
    db.collection("Users")
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        setTotalRoubies(documentSnapshot.data().Exp);
      });
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <Screen style={styles.container}>
      <Text style={styles.text}>Total Roubies Earned:</Text>
      <Text style={styles.roubieText}>{totalRoubies}</Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: colors.darkmodeMediumWhite,
  },
  roubieText: {
    fontSize: 50,
    color: colors.darkmodeHighWhite,
  },
});

JourneyScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default JourneyScreen;
