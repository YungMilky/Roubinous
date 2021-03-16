import React from 'react';
import { View } from 'react-native';
import { useState } from 'react';
import { Button, Input } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../firebase';
import PropTypes from 'prop-types';

const LoginScreen = () => {
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
    auth
      .signInWithEmailAndPassword(email, password)

      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        console.error(error);
      });
  };

  return (
    <View style={{}}>
      <View>
        <StatusBar style="light" />
        <Input
          placeholder="Email"
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View>
        <StatusBar style="light" />
        <Input
          placeholder="Password"
          autoFocus
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <Button title="Login" onPress={signInWithEmailAndPassword} />
    </View>
  );
};

LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default LoginScreen;
