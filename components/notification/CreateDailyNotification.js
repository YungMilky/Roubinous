import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function CreateDailyNotification(hour, minute) {
  // const [userAlertHour, setUserAlertHour] = useState('');
  // const [userAlertMinute, setUserAlertMinute] = useState('');
  console.log('inne i metoden' + ' ' + hour + ' ' + minute);

  await Notifications.cancelAllScheduledNotificationsAsync()
    .then(() => {
      console.log('Cleared all local notifications.');
    })
    .catch((err) => {
      console.log('Unable to clear local notifications. ' + err);
      reject(err);
    });

  // db.collection('Users')
  //   .doc(auth.currentUser.uid)
  //   .get()
  //   .then((documentSnapshot) => {
  //     setUserAlertHour(documentSnapshot.get('UserAlertHour'));
  //     setUserAlertMinute(documentSnapshot.get('UserAlertMinute'));
  //   })
  //   .catch((err) => {
  //     console.log('Cant get user alert time. ' + err);
  //     reject(err);
  //   });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'This is a daily notification',
      body:
        'You should get this at: ' +
        hour +
        ':' +
        checkNumber(minute) +
        ' , now do your routines stupid!',
      data: { data: 'goes here' },
    },
    trigger: {
      hour: hour,
      minute: minute,
      repeats: true,
    },
  });

  return 'Notification sent';
}

const checkNumber = (number) => {
  if (number < 10) {
    number = '0' + number.toString();
  }
  return number;
};

export default CreateDailyNotification;
