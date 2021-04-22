import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
import { db, auth } from '../firebase';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

import Screen from '../components/Screen';
import colors from '../config/colors';

const MyRoutinesScreen = ({ navigation }) => {
  return <Screen style={styles.container}></Screen>;
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flex: 1,
  },
});

MyRoutinesScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default MyRoutinesScreen;
