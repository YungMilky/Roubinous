import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { db, auth } from '../firebase';

import AppButton from '../components/AppButton';
import colors from '../config/colors';
import PropTypes from 'prop-types';

const SignedOutScreen = ({ navigation }) => {
  return (
    <View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    width: 200,
    marginTop: 20,
  },

  inputContainer: {
    width: 300,
  },
});

SignedOutScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default SignedOutScreen;
