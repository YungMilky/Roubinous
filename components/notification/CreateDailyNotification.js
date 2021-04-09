import * as Notifications from 'expo-notifications';
import CancelAllNotifications from './CancelAllNotifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function CreateDailyNotification(hour, minute) {
  console.log('inne i metoden' + ' ' + hour + ' ' + minute);

  CancelAllNotifications();

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
