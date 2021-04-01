import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { db, auth } from '../firebase';

import AppButton from '../components/AppButton';
import colors from '../config/colors';
import PropTypes from 'prop-types';

const LoginAsGuestScreen = ({ navigation }) => {
  const [name, setName] = useState('');

  const signInAnonymously = () => {
    if (!name.trim()) {
      alert('Please Enter a Name');
      return;
    } else {
      auth.signInAnonymously().then((cred) => {
        return db.collection('Users').doc(cred.user.uid).set({
          Name: name,
          Guest: true,
          UserRank: 1,
          Roubies: 50,
          UserAlertHour: 10,
          UserAlertMinute: 30,
        });
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>We just need your name</Text>
      <View style={styles.input}>
        <StatusBar style="light" />
        <Input
          placeholder="Your name here..."
          autoFocus
          type="name"
          value={name}
          onChangeText={(text) => setName(text)}
          color={colors.OrchidPink}
          selectionColor={colors.OrchidPink}
        />
      </View>

      <AppButton
        style={styles.button}
        title="Let's go!"
        onPress={signInAnonymously}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.samBlack,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
  },
  container: {
    backgroundColor: colors.samBlack,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    width: '80%',
  },
  text: {
    color: colors.OrchidPink,
  },
});

LoginAsGuestScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default LoginAsGuestScreen;
