import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { db, auth } from '../firebase';

import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import colors from '../config/colors';
import PropTypes from 'prop-types';

const WelcomeScreen = ({ navigation }) => {
  const [name, setName] = useState('');

  const signInAnonymously = () => {
    auth.signInAnonymously().then((cred) => {
      return db.collection('Users').doc(cred.user.uid).set({
        Name: name,
        Guest: true,
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text styles={styles.container}>My name is Roubine, whats yours?</Text>
      <View style={styles.input}>
        <StatusBar style="light" />
        <Input
          placeholder="Your name here..."
          autoFocus
          type="name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>

      <AppButton
        style={styles.button}
        title="Let's go!"
        onPress={signInAnonymously}
      />
      <AppButton
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      />
      <TouchableOpacity>
        <Text
          title="Register"
          onPress={() => {
            navigation.navigate('Register');
          }}
        >
          {' '}
          <Text>Register</Text>
        </Text>
      </TouchableOpacity>

      <AppButton
        title="Profile"
        onPress={() => navigation.navigate('Profile')}
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
  },
  input: {
    width: '80%',
  },
});

WelcomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default WelcomeScreen;
