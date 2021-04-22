import React from 'react';
import { View, Text, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useState } from 'react';

import { auth, db } from '../firebase';

import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import colors from '../config/colors';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// import { auth } from '../firebase';

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [inputError, setInputError] = useState('');

  const passwordResetMail = () => {
    //kollar om hooken/fältet är tom
    if (!email.trim()) {
      setInputError('Please enter your e-mail');
      return;
    } else {
      auth
        .sendPasswordResetEmail(email)
        .then(() => {
          alert('Email has been sent, please check inbox'),
            navigation.navigate('Login', { screen: 'Login' });
        })
        .catch((error) => setInputError(error.message));
    }
  };

  //   const email (input från textfield)

  //   auth.sendPasswordResetEmail(email)
  //   .then() =>
  //   console.log("Mail has been sent");
  //   ))
  //   .catch((error) => alert(error.message));
  // };

  //  var auth = db.auth();
  // var emailAddress = "user@example.com";

  // auth.sendPasswordResetEmail(emailAddress).then(function() {
  //   // Email sent.
  // }).catch(function(error) {
  //   // An error happened.
  // });

  // handlePasswordReset = async (values, actions) => {
  //   const { email } = values

  //   try {
  //     await this.props.firebase.passwordReset(email)
  //     console.log('Password reset email sent successfully')
  //     this.props.navigation.navigate('Login')
  //   } catch (error) {
  //     actions.setFieldError('general', error.message)
  //   }
  // }

  return (
    <Screen style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.text}> Enter your e-mail:</Text>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Text style={styles.errorText}>{inputError}</Text>
      </View>
      <AppButton
        style={styles.button}
        title="Send Email"
        onPress={passwordResetMail}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexGrow: 1,
  },

  button: {
    width: 200,
    margin: 20,
  },
  errorText: {
    color: colors.samRed,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    width: 300,
  },
  text: {
    color: colors.darkmodeMediumWhite,
  },
});

// ResetPasswordScreen.propTypes = {
//   navigation: PropTypes.object.isRequired,
// };

export default ResetPasswordScreen;
