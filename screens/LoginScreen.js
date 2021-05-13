import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth, db } from '../firebase';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import CreateDailyNotification from '../components/notification/CreateDailyNotification';
import AppButton from '../components/AppButton';
import colors from '../config/colors';
import Screen from '../components/Screen';
import Separator from '../components/Separator';
import { color } from 'react-native-reanimated';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputError, setInputError] = useState('');
  const [notificationsState, setNotificationsState] = useState();
  const navigationn = useNavigation();

  // shoooooo

  //const signInAnonymously = () => {
  // auth.signInAnonymously().then((cred) => {
  // return db.collection("Users").doc(cred.user.uid).set({
  // Name: name,
  //Guest: false,
  //});
  //});
  //};

  //FirebaseAuth.getInstance().getCurrentUser().getUid()
  const signInWithEmailAndPassword = () => {
    if (!email.trim() && !password.trim()) {
      setInputError('Please fill out the fields');
      return;
    } else {
      auth.signOut();
      auth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          db.collection('Users')
            .doc(auth.currentUser.uid)
            .get()
            .then((documentSnapshot) => {
              if (documentSnapshot.data().Notifications) {
                CreateDailyNotification(
                  documentSnapshot.data().UserAlertHour,
                  documentSnapshot.data().UserAlertMinute
                );
                console.log('true');
              } else {
                console.log('false');
              }
            })

            .catch((err) => {
              console.log('Cant get user alert time. Error msg: ' + err);
            });
          setTimeout(() => navigationn.navigate('Home'), 1000);
        })
        .catch((err) => {
          if (err.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            setInputError('Incorrect e-mail format');
          }
          if (err.code === 'auth/wrong-password') {
            console.log('The password is invalid!');
            setInputError('Incorrect password');
          }
          if (err.code === 'auth/user-not-found') {
            console.log('The password is invalid!');
            setInputError('This user doesnt exist');
          }
          console.error(err.code);
        });
    }
  };

  return (
    <Screen style={styles.container}>
      <Text style={styles.header}> Login </Text>
      <View style={styles.inputContainer}>
        <Input
          style={styles.input}
          placeholder='Email'
          autoFocus
          type='email'
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <StatusBar style='light' />
        <Input
          style={styles.input}
          placeholder='Password'
          autoFocus
          type='password'
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <Text style={styles.errorText}>{inputError}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          style={styles.button}
          title='Login'
          onPress={signInWithEmailAndPassword}
        />
      </View>
      <TouchableOpacity style={styles.touchable}>
        <Text
          style={styles.text}
          onPress={() => {
            navigation.navigate('Reset Password');
          }}
        >
          Forgot your password?
        </Text>
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity style={styles.touchable}>
        <Text
          style={styles.text}
          onPress={() => {
            navigation.navigate('Register');
          }}
        >
          No account? Register
        </Text>
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 300,
    margin: 20,
  },
  buttonContainer: {
    width: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.samRed,
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 2,
    fontSize: 16,
  },
  header: {
    color: colors.darkmodeMediumWhite,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  icon: {
    paddingRight: 5,
    paddingBottom: 20,
  },
  input: {
    color: colors.darkmodeHighWhite,
  },
  inputContainer: {
    width: 300,
  },
  text: {
    fontSize: 16,
    color: colors.darkmodeMediumWhite,
  },
  touchable: {
    marginTop: 10,
  },
});

LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default LoginScreen;
