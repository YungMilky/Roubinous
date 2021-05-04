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
  CancelAllNotifications();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Roubine',
      body: 'Dont forget to do your routines!',
      data: { data: 'goes here' },
    },
    trigger: {
      hour: hour,
      minute: minute,
      repeats: true,
    },
  });
  console.log(
    'Created daily notification for time: ' + ' ' + hour + ' ' + minute
  );
  return 'Notification sent';
}

const checkNumber = (number) => {
  if (number < 10) {
    number = '0' + number.toString();
  }
  return number;
};

export default CreateDailyNotification;
