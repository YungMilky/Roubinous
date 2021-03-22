import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Button, Input } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../firebase';
import PropTypes from 'prop-types';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    console.log(email);
    auth.signOut();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.navigate('Profile');
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <StatusBar style="light" />
        <Input
          placeholder="Email"
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <StatusBar style="light" />
        <Input
          placeholder="Password"
          autoFocus
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <TouchableOpacity>
        <Text
          onPress={() => {
            navigation.navigate('Reset Password');
          }}
        >
          <Text> Forgot your password?</Text>
        </Text>
      </TouchableOpacity>

      <Button
        style={styles.button}
        title="Login"
        onPress={signInWithEmailAndPassword}
      />

      <TouchableOpacity>
        <Text
          onPress={() => {
            navigation.navigate('Register');
          }}
        >
          <Text> Click here to register</Text>
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
    width: 300,
    margin: 20,
  },

  inputContainer: {
    width: 300,
  },
});

LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default LoginScreen;
