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

async function SendNotification(time, title, info) {
  console.log(time);
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: info,
    },
    trigger: { seconds: time, repeats: false },
  });
  console.log(identifier);
  return 'Notification sent';
}

export default SendNotification;
