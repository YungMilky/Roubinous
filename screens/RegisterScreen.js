import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Input, Text } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { auth, db, fv } from '../firebase';
import { signInWithGoogle } from '../firebase';
import { signInWithFacebook } from '../firebase';
import CreateDailyNotification from '../components/notification/CreateDailyNotification';
import AppButton from '../components/AppButton';
import colors from '../config/colors';
import Screen from '../components/Screen';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [inputError, setInputError] = useState('');
  
  let currentDate = new Date();
  // let currentDate =
  //   nowDate.getFullYear() +
  //   '/' +
  //   (nowDate.getMonth() + 1) +
  //   '/' +
  //   nowDate.getDate();

  
  let day = currentDate.getDate();
  let month = currentDate.getMonth()+1;
  let year = currentDate.getFullYear();

  // const currentDate = fv.Timestamp.fromDate(new Date());

  const register = () => {
    if (!email.trim()) {
      alert('Please write an email');
      return;
    } else {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((cred) => {
          db.collection('Users').doc(cred.user.uid).set({
            Name: name,
            Guest: false,
            UserRank: 1,
            Roubies: 100,
            UserAlertHour: 10,
            UserAlertMinute: 30,
            DailyRewardDay: day,
            DailyRewardMonth: month,
            DailyRewardYear: year,
            Exp: 100,
            // DailyRewardTime: currentDate,
            
          });
          setTimeout(() => navigation.navigate('Home'), 500);
        })
        .catch((err) => {
          if (err.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            setInputError('Check your email');
          }
          if (err.code === 'auth/weak-password') {
            console.log('The password is too weak');
            setInputError('The password is too weak');
          }
          console.error(err.code);
        });
      CreateDailyNotification(10, 30);
    }
  };

  return (
    <Screen style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.header}> Register </Text>

      <View style={styles.inputContainer}>
        <Input
          style={styles.input}
          placeholder="Name"
          type="name"
          value={name}
          onChangeText={(text) => setName(text)}
        />

        <Input
          style={styles.input}
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          style={styles.input}
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={register}
        />
        <Text style={styles.errorText}>{inputError}</Text>
      </View>
      <AppButton onPress={register} title="Register" />
      {/* <Button
        style={styles.button}
        onPress={signInWithGoogle}
        title="Sign in With Google webb"
      />
      <Button
        style={styles.button}
        onPress={signInWithFacebook}
        title="Sign in With Facebook webb"
      /> */}
      {/* <Button
        title="Register"
        onPress={() => navigation.navigate('Profile'), register}
      /> */}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    width: '100%',
  },
  errorText: {
    color: colors.samRed,
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    color: colors.darkmodeMediumWhite,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    color: colors.darkmodeHighWhite,
  },
  inputContainer: {
    width: 300,
  },
});

RegisterScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default RegisterScreen;
