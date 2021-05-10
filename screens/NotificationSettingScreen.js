import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Platform, StyleSheet, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PropTypes from 'prop-types';

import { db, auth } from '../firebase';
import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import Separator from '../components/Separator';
import colors from '../config/colors';
import CreateDailyNotification from '../components/notification/CreateDailyNotification';
import CancelAllNotifications from '../components/notification/CancelAllNotifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationSettingScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [userAlertHour, setUserAlertHour] = useState('');
  const [userAlertMinute, setUserAlertMinute] = useState('');
  const [isEnabled, setIsEnabled] = useState();

  const checkNotificationField = () => {
    db.collection('Users')
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        setIsEnabled(documentSnapshot.data().Notifications);
      });
  };

  useEffect(() => {
    checkNotificationField();
  }, []);

  const toggleSwitch = () => {
    if (!isEnabled) {
      CreateDailyNotification(userAlertHour, userAlertMinute);
      db.collection('Users')
        .doc(user.uid)
        .update({
          Notifications: true,
        })
        .then(() => {
          console.log('Notifications true');
        })
        .catch((error) => {
          console.error('Catch: Error writing document: ', error);
        });
    } else {
      CancelAllNotifications();
      db.collection('Users')
        .doc(user.uid)
        .update({
          Notifications: false,
        })
        .then(() => {
          console.log('Notifications true');
        })
        .catch((error) => {
          console.error('Catch: Error writing document: ', error);
        });
    }
    setIsEnabled((previousState) => !previousState);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    if (selectedDate) {
      changeNotificationTime(selectedDate);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepicker = () => {
    showMode('time');
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  useEffect(() => {
    const getUserAlertTime = async () => {
      db.collection('Users')
        .doc(auth.currentUser.uid)
        .get()
        .then((documentSnapshot) => {
          setUserAlertHour(documentSnapshot.get('UserAlertHour'));
          setUserAlertMinute(documentSnapshot.get('UserAlertMinute'));
        })
        .catch((err) => {
          console.log('Cant get user alert time. ' + err);
          reject(err);
        });
    };
    getUserAlertTime();
  }, []);

  const checkNumber = (number) => {
    if (number < 10) {
      number = '0' + number.toString();
    }
    return number;
  };

  return (
    <Screen style={styles.container}>
      {/* <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>
          Title: {notification && notification.request.content.title}{' '}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{' '}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View> */}

      {/* <AppButton
        title="Schedule test notification (5sec interval)"
        onPress={async () => {
          await scheduleTest();
        }}
      /> */}
      <View style={styles.innerContainer}>
        <View style={styles.switchContainer}>
          <Text style={styles.text}>Turn on/off notifications:</Text>
          <Switch
            trackColor={{
              false: colors.darkmodeDisabledWhite,
              true: colors.samRed,
            }}
            thumbColor={isEnabled ? colors.OrchidPink : colors.floralWhite}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        {isEnabled && (
          <View style={styles.innerContainer2}>
            <Separator />
            <Text style={styles.innerText}>
              Current Daily Notification time:
            </Text>
            <Text style={styles.timeText}>
              {checkNumber(userAlertHour)}:{checkNumber(userAlertMinute)}
            </Text>
            {/* <Text style={styles.innerText}>
              Change daily notification time:{' '}
            </Text> */}
            <AppButton onPress={showTimepicker} title="Change time" />
            {/* <AppButton
              title="Apply selected time"
              onPress={async () => {
                await changeNotificationTime();
              }}
            /> */}

            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={onChange}
              />
            )}
          </View>
        )}
      </View>
    </Screen>
  );

  async function changeNotificationTime(selectedDate) {
    setUserAlertHour(selectedDate.getHours());
    setUserAlertMinute(selectedDate.getMinutes());

    // console.log(date.getHours() + ':' + date.getMinutes());

    db.collection('Users')
      .doc(auth.currentUser.uid)
      .update({
        UserAlertHour: selectedDate.getHours(),
        UserAlertMinute: selectedDate.getMinutes(),
      })
      .then(() => {
        console.log('UserAlertTime updated!');
      });
    await CancelAllNotifications();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'This is a daily notification',
        body:
          'You should get this at: ' +
          selectedDate.getHours() +
          ':' +
          checkNumber(selectedDate.getMinutes()) +
          ' , now do your routines stupid!',
        data: { data: 'goes here' },
      },
      trigger: {
        hour: selectedDate.getHours(),
        minute: selectedDate.getMinutes(),
        repeats: true,
      },
    });
    // console.log({ userAlertHour } + ':' + { userAlertMinute });
  }
};

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: 'This is a test notification',
//       body:
//         'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//       data: { data: 'goes here' },
//     },
//     trigger: {
//       hour: 18,
//       minute: 0,
//       repeats: true,
//     },
//   });
// }

// async function scheduleTest() {
//   const identifier = await Notifications.scheduleNotificationAsync({
//     content: {
//       title: 'Notification with 5sec interval',
//     },
//     trigger: { seconds: 5, repeats: true },
//   });
//   // setNotificationID(identifier);
//   console.log(identifier);
// }

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'space-around',
    backgroundColor: colors.darkmodeLightBlack,
  },
  innerContainer: {
    flexGrow: 0.4,
    width: 300,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  innerContainer2: {
    flexGrow: 0.4,
    width: 300,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  innerText: {
    color: colors.darkmodeMediumWhite,
    fontSize: 18,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeText: {
    color: colors.darkmodeMediumWhite,
    fontSize: 40,
  },
  text: {
    color: colors.darkmodeMediumWhite,
    fontSize: 20,
    marginTop: -2,
    marginRight: 80,
  },
});

NotificationSettingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default NotificationSettingScreen;
