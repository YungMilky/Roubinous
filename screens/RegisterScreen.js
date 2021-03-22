import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Button, Input, Text } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth, db } from '../firebase';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        return db
          .collection('Users')
          .doc(cred.user.uid)
          .set({
            Name: name,
            Guest: false,
            UserRank: 1,
            Roubies: 100,
          })
          .then(() => {
            navigation.replace('Home');
          });
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="light" />
      <Text h2 style={{ marginBottom: 20 }}>
        {' '}
        Register{' '}
      </Text>

      <View style={styles.inputContainer}>
        <Input
          placeholder="Name"
          type="name"
          value={name}
          onChangeText={(text) => setName(text)}
        />

        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={register}
        />
      </View>
      <Button style={styles.button} onPress={register} title="Register" />
      {/* <Button
        title="Register"
        onPress={() => navigation.navigate('Profile'), register}
      /> */}
    </KeyboardAvoidingView>
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

RegisterScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default RegisterScreen;
