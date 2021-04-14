import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import colors from '../config/colors';

const JourneyScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This page does not exist yet</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: colors.samBlack,
  },
});

JourneyScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default JourneyScreen;
