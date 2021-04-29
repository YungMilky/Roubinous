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
  let nowDate = new Date();

  const getDailyRewardTime = () => {
    db.collection('Users')
      .doc(auth.currentUser.uid)
      .get()
      .then((documentSnapshot) => {
        const date = documentSnapshot.data().DailyRewardDay;
        const month = documentSnapshot.data().DailyRewardMonth;
        const year = documentSnapshot.data().DailyRewardYear;

        if (
          date < nowDate.getDate() ||
          month < nowDate.getMonth() + 1 ||
          year < nowDate.getFullYear()
        ) {
          db.collection('Users')
            .doc(auth.currentUser.uid)
            .update({
              Roubies: documentSnapshot.data().Roubies + 50,
              Exp: documentSnapshot.data().Exp + 50,
              DailyRewardDay: nowDate.getDate(),
              DailyRewardMonth: nowDate.getMonth() + 1,
              DailyRewardYear: nowDate.getFullYear(),
            });
          console.log('Eligible for daily reward!!');
        } else {
          console.log('Not eligible for daily reward!');
        }
      });
  };

  useEffect(() => {
    getDailyRewardTime();
  }, []);

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
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Browse Routines', { screen: 'Browse Routines' })
        }
      >
        <MaterialCommunityIcons
          name="baseball"
          size={70}
          color={colors.samRed}
        />
        <Text style={styles.buttonText}>Browse Routines</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <MaterialCommunityIcons
          name="clock-time-eight"
          size={70}
          color={colors.samRed}
          onPress={() =>
            navigation.navigate('My Routines', { screen: 'My Routines' })
          }
        />
        <Text style={styles.buttonText}>My Routines</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        // onPress={
        //   //() =>
        //   // navigation.navigate("Calendars", { screen: "Calendars" })
        // }
      >
        <MaterialCommunityIcons
          name="baseball"
          size={70}
          color={colors.samRed}
        />
        <Text style={styles.buttonText}>Calendars</Text>
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
