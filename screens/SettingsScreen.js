import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { Input, Button } from 'react-native-elements';
import { db, auth } from '../firebase';

import Screen from '../components/Screen';
import AppButton from '../components/AppButton';

const SettingsScreen = ({ navigation }) => {
  const [name, setName] = useState();
  const [newUsername, setNewusername] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    db.collection('Users')
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        setName(documentSnapshot.get('Name'));
      });
  }, [newUsername]);

  function changeUsername() {
    if (!newUsername.trim()) {
      alert('Please Enter a new Name');
      return;
    } else {
      db.collection('Users').doc(user.uid).update({
        Name: newUsername,
      });
      alert('Success! Changed name to: ' + newUsername);
    }
  }

  function deleteAccount() {
    db.collection('Users').doc(user.uid).delete();
    setTimeout(() => {
      auth.signOut();
    }, 5000);
    auth.currentUser.delete();
  }

  return (
    <Screen>
      <Text style={styles.text}>Change Username:</Text>
      <Input
        style={styles.input}
        placeholder={name}
        onChangeText={(text) => setNewusername(text)}
      />
      <View style={styles.container}>
        <AppButton
          style={styles.button}
          title="Change username"
          onPress={changeUsername}
        />
        <AppButton
          style={styles.button}
          title={'Delete my account'}
          onPress={deleteAccount}
        />
        <AppButton
          style={styles.button}
          title={'Notification Settings'}
          onPress={() =>
            navigation.navigate('Notification Settings', {
              screen: 'Notification Settings',
            })
          }
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    width: 200,
    height: 50,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    width: '60%',
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
  },
});

SettingsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default SettingsScreen;
