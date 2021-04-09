import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function CancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync()
    .then(() => {
      console.log('Cleared all local notifications.');
    })
    .catch((err) => {
      console.log('Unable to clear local notifications. ' + err);
      reject(err);
    });
  return 'Notification sent';
}

export default CancelAllNotifications;
