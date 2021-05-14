import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  View,
  Dimensions,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

import { auth, db } from '../firebase';
import Screen from '../components/Screen';
import colors from '../config/colors';
import CreateDailyNotification from '../components/notification/CreateDailyNotification';
import CancelAllNotifications from '../components/notification/CancelAllNotifications';
import * as Animatable from 'react-native-animatable';
import { TouchableWithoutFeedback } from 'react-native';
import AppButton from '../components/AppButton';
import InfographicPopup from '../components/InfographicPopup';
import { SimpleAnimation } from 'react-native-simple-animations';

const { width, height } = Dimensions.get('screen');
const HomeScreen = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  let nowDate = new Date();

  const checkDailyRewardTime = () => {
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
          setShowModal(true);
          console.log('Eligible for daily reward!!');
          resetRoutinesIsDone('routines');
          resetRoutinesIsDone('customRoutines');
        } else {
          console.log('Not eligible for daily reward!');
        }
      });
  };

  useEffect(() => {
    checkDailyRewardTime();
  }, []);

  const resetRoutinesIsDone = (routineType) => {
    db.collection('Users')
      .doc(auth.currentUser.uid)
      .collection(routineType)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let times = [];

          db.collection('Users')
            .doc(auth.currentUser.uid)
            .collection(routineType)
            .doc(doc.id)
            .get()
            .then((doc) => {
              times = JSON.parse(doc.data().routineTimes);
              // console.log(JSON.parse(doc.data().routineTimes));
            });

          setTimeout(() => {
            for (let i = 0; i < times.length; i++) {
              times[i].isDone = false;
            }

            db.collection('Users')
              .doc(auth.currentUser.uid)
              .collection(routineType)
              .doc(doc.id)
              .update({
                routineTimes: JSON.stringify(times),
              })
              .then(() => {
                console.log('IsDone updated!');
              });
          }, 500);
        });
      });
  };

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
        onPress={() =>
          navigation.navigate('Calendars', { screen: 'Calendars' })
        }
      >
        <MaterialCommunityIcons
          name="baseball"
          size={70}
          color={colors.samRed}
        />
        <Text style={styles.buttonText}>Calendars</Text>
      </TouchableOpacity>
      {showModal && (
        <Modal
          style={{
            borderWidth: 0,
            borderColor: 'none',
            width: '100%',
            height: '100%',
          }}
          animationType={'fade'}
          transparent={true}
          statusBarTranslucent={true}
        >
          <SimpleAnimation
            style={{ flex: 1 }}
            delay={500}
            duration={1000}
            fade
            staticType="zoom"
          >
            <View style={styles.centeredView}>
              <View
                style={
                  styles.modalView
                  //   {
                  //   backgroundColor: colors.darkmodePressed,
                  //   flex: 1,
                  //   justifyContent: "center",
                  //   alignItems: "center",
                  //   marginTop: 0,
                  //   borderRadius: 10,
                  // }
                }
              >
                <Image
                  style={styles.imageDefault}
                  source={require('../assets/RoutinesPics/confetti.png')}
                />
                <Text style={styles.text}>Daily reward:</Text>
                <View style={styles.rubyContianer}>
                  <Text style={styles.roubieText}>+50</Text>
                  <FontAwesome
                    style={{ marginTop: 5, marginLeft: 5 }}
                    name="diamond"
                    size={30}
                    color={colors.samRed}
                  />
                  {/* <Image
                    style={styles.imageRuby}
                    source={require("../assets/icons/ruby.png")}
                  /> */}
                </View>

                <AppButton
                  style={styles.buttonReward}
                  title="Okay!"
                  onPress={() => setShowModal(false)}
                />
              </View>
            </View>
          </SimpleAnimation>
        </Modal>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    //
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalText: {
    //
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    color: colors.darkmodeMediumWhite,
  },
  modalView: {
    //
    width: '70%',
    margin: 20,
    backgroundColor: colors.darkmodeDisabledBlack,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
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
  buttonReward: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    width: 20,
    height: 10,
    marginTop: 50,
  },
  buttonText: {
    fontSize: 16,
    color: colors.darkmodeMediumWhite,
  },
  imageDefault: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageRuby: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowButton: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  press: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',

    backgroundColor: colors.darkmodePressed,
    // flex: 1,

    borderRadius: 10,
  },
  rubyContianer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  roubieText: {
    fontSize: 30,
    color: colors.darkmodeHighWhite,
  },
  text: {
    fontSize: 25,
    color: colors.darkmodeHighWhite,
    marginBottom: 20,
    textAlign: 'center',
  },
});

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default HomeScreen;
