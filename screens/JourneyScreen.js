import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import colors from '../config/colors';
import Screen from '../components/Screen';

const JourneyScreen = ({ navigation }) => {
  return (
    <Screen style={styles.container}>
      <Text style={styles.text}>This page does not exist yet</Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontSize: 18,
    color: colors.darkmodeMediumWhite,
  },
});

JourneyScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default JourneyScreen;
