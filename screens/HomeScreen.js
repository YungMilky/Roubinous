import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { auth, db } from '../firebase';
import Screen from '../components/Screen';
import colors from '../config/colors';
import CreateDailyNotification from '../components/notification/CreateDailyNotification';
import CancelAllNotifications from '../components/notification/CancelAllNotifications';

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
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Profile', { screen: 'Profile' })}
      >
        <Text
          style={styles.text}
          onPress={() =>
            navigation.navigate('AddRoutine', { screen: 'AddRoutine' })
          }
        >
          Add a custom routine
        </Text>
        <MaterialCommunityIcons
          name="account"
          size={100}
          color={colors.samRed}
        />
        <Text>Profile Page</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Routines', {screen: 'Routines'})}
      >
        <MaterialCommunityIcons
          name="baseball"
          size={100}
          color={colors.samRed}
        />
        <Text>Routines</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <MaterialCommunityIcons
          name="alarm-light"
          size={100}
          color={colors.samRed}
          onPress={() =>
            navigation.navigate('NotificationSetting', {
              screen: 'NotificationSetting',
            })
          }
        />
        <Text>Notification Settings</Text>
      </TouchableOpacity>
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
});

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default HomeScreen;
