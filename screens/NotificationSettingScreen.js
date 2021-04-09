import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PropTypes from 'prop-types';

import { db, auth } from '../firebase';
import AppButton from '../components/AppButton';
import SendNotification from '../components/notification/SendNotification';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationSettingScreen = ({ navigation }) => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [userAlertHour, setUserAlertHour] = useState('');
  const [userAlertMinute, setUserAlertMinute] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
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
    <View style={styles.container}>
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

      <AppButton
        title="Schedule test notification (5sec interval)"
        onPress={async () => {
          await scheduleTest();
        }}
      />
      <AppButton
        title="Turn off all notifications"
        onPress={async () => {
          await cancelAllNotifications();
        }}
      />

      {/* <AppButton
        title="Schedule component"
        onPress={async () => {
          await SendNotification(time);
        }}
      /> */}
      <Text>Change daily notification time:</Text>
      <View style={styles.selectTime}>
        <AppButton
          style={styles.button}
          onPress={showTimepicker}
          title="Select time"
        />
        <AppButton
          style={styles.button}
          title="Apply new time"
          onPress={async () => {
            await changeNotificationTime();
          }}
        />
      </View>

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
      <Text style={{ fontSize: 20 }}>
        Current Daily Notification time: {userAlertHour}:
        {checkNumber(userAlertMinute)}
      </Text>
    </View>
  );

  async function changeNotificationTime() {
    setUserAlertHour(date.getHours());
    setUserAlertMinute(date.getMinutes());

    // console.log(date.getHours() + ':' + date.getMinutes());

    db.collection('Users')
      .doc(auth.currentUser.uid)
      .update({
        UserAlertHour: date.getHours(),
        UserAlertMinute: date.getMinutes(),
      })
      .then(() => {
        console.log('UserAlertTime updated!');
      });
    await cancelAllNotifications();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'This is a daily notification',
        body:
          'You should get this at: ' +
          date.getHours() +
          ':' +
          checkNumber(date.getMinutes()) +
          ' , now do your routines stupid!',
        data: { data: 'goes here' },
      },
      trigger: {
        hour: date.getHours(),
        minute: date.getMinutes(),
        repeats: true,
      },
    });
    console.log({ hour } + ':' + { minute });
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

async function scheduleTest() {
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Notification with 5sec interval',
    },
    trigger: { seconds: 5, repeats: true },
  });
  // setNotificationID(identifier);
  console.log(identifier);
}

async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync()
    .then(() => {
      console.log('Cleared all local notifications.');
    })
    .catch((err) => {
      console.log('Unable to clear local notifications. ' + err);
      reject(err);
    });
}

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
  button: {
    margin: 5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  selectTime: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    width: '60%',
  },
});

NotificationSettingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default NotificationSettingScreen;
