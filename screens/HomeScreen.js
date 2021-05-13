import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import InfographicPopup from '../components/InfographicPopup';
import CreateDailyNotification from '../components/notification/CreateDailyNotification';
import CancelAllNotifications from '../components/notification/CancelAllNotifications';
import colors from '../config/colors';

const HomeScreen = ({ navigation }) => {
  // const user = auth.currentUser;

  // const getUserTime = () => {
  //   CancelAllNotifications();
  //   db.collection('Users')
  //     .doc(user.uid)
  //     .get()
  //     .then((documentSnapshot) => {
  //       CreateDailyNotification(
  //         documentSnapshot.data().UserAlertHour,
  //         documentSnapshot.data().UserAlertMinute
  //       );
  //     })
  //     .catch((err) => {
  //       console.log('Cant get user alert time. ' + err);
  //       reject(err);
  //     });
  // };

  // useEffect(() => {
  //   setTimeout(() => {
  //     getUserTime();
  //   }, 2000);
  // }, [auth.currentUser]);

  return (
    <Screen style={styles.container}>
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Profile', { screen: 'Profile' })}
      >
        <MaterialCommunityIcons
          name="account"
          size={100}
          color={colors.samRed}
        />
        <Text>Profile Page</Text>
      </TouchableOpacity> */}
      <InfographicPopup />
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Browse Routines', { screen: 'Browse Routines' })
        }
      >
        <MaterialCommunityIcons
          name='baseball'
          size={70}
          color={colors.samRed}
        />
        <Text style={styles.buttonText}>Browse Routines</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <MaterialCommunityIcons
          name='clock-time-eight'
          size={70}
          color={colors.samRed}
        />
        <Text style={styles.buttonText}>My Routines</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Notification Settings', {
            screen: 'Notification Settings',
          })
        }
      >
        <MaterialCommunityIcons
          name="alarm-light"
          size={100}
          color={colors.samRed}
        />
        <Text>Notification Settings</Text>
      </TouchableOpacity> */}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    width: 120,
    height: 120,
  },
  buttonText: {
    fontSize: 16,
    color: colors.darkmodeMediumWhite,
  },
  rowButton: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
});

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default HomeScreen;
