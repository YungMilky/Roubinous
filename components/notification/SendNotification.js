import React, { useState, useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// parametern time är hur många sekunder efter man kallar på metoden som notisen skickas
async function SendNotification(time, title, info) {
  console.log('time: ' + time);
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: info,
    },
    trigger: { seconds: time, repeats: false },
  });
  console.log('identifier: ' + identifier);
  return 'Notification sent';
}

export default SendNotification;
