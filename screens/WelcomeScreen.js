import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import AppButton from '../components/AppButton';
import colors from '../config/colors';
import PropTypes from 'prop-types';
import Screen from '../components/Screen';

const WelcomeScreen = ({ navigation }) => {
  return (
    <Screen style={styles.container}>
      <Image style={styles.logo} source={require('../assets/icons/ruby.png')} />
      <AppButton
        style={styles.button}
        title="Continue as Guest"
        onPress={() =>
          navigation.navigate('LoginAsGuest', { screen: 'LoginAsGuest' })
        }
      />
      <AppButton
        style={styles.button}
        title="Go to Login"
        onPress={() => navigation.navigate('Login', { screen: 'Login' })}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('Register', { screen: 'Register' })}
      >
        <Text style={styles.text}>Register</Text>
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 100,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    width: '100%',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 50,
  },
  text: {
    fontSize: 16,
    color: colors.darkmodeMediumWhite,
  },
});

WelcomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default WelcomeScreen;
