import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import AppButton from '../components/AppButton';
import colors from '../config/colors';
import PropTypes from 'prop-types';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/icons/ruby.png')} />
      <AppButton
        title="Continue as Guest"
        onPress={() =>
          navigation.navigate('LoginAsGuest', { screen: 'LoginAsGuest' })
        }
      />
      <AppButton
        title="Go to Login"
        onPress={() => navigation.navigate('Login', { screen: 'Login' })}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('Register', { screen: 'Register' })}
      >
        <Text style={styles.text}>Register</Text>
      </TouchableOpacity>
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
  logo: {
    width: 200,
    height: 200,
    marginBottom: 50,
  },
  text: {
    color: colors.OrchidPink,
  },
});

WelcomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default WelcomeScreen;
