import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
// import firestore from '@react-native-firebase/firestore';
import { db, auth } from '../firebase';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import colors from '../config/colors';
import { TouchableOpacity } from 'react-native';

const ProfileScreen = () => {
  const user = auth.currentUser;

  const [name, setName] = useState('');
  const [roubies, setRoubies] = useState('');
  const [userRank, setUserRank] = useState('');
  const [guest, setGuest] = useState('');

  // kolla om man är inloggad med facebook/gmail
  const getUserInfo = () => {
    db.collection('Users')
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        setName(documentSnapshot.get('Name'));
        setRoubies(documentSnapshot.get('Roubies'));
        setUserRank(documentSnapshot.get('UserRank'));
        setGuest(documentSnapshot.get('Guest'));
      });
  };
  getUserInfo();
  return (
    <Screen style={styles.container}>
      <Avatar
        rounded
        size="xlarge"
        source={{
          uri:
            'https://png.pngtree.com/png-vector/20190803/ourlarge/pngtree-avatar-user-basic-abstract-circle-background-flat-color-icon-png-image_1647265.jpg',
        }}
      />
      <View>
        <View style={styles.bodyContent}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.separator} />
          {!guest ? ( //if (guest == false)
            <View style={styles.bodyContent}>
              <Text style={styles.info}>Rank: {userRank}</Text>
              <Text style={styles.info}>Roubies: {roubies}</Text>
              <Text style={styles.description}>
                Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum
                electram expetendis, omittam deseruisse consequuntur ius an,
              </Text>
            </View>
          ) : (
            //else
            <View style={styles.bodyContent}>
              <Text style={styles.info}>
                Psst, {name}! Register or log in to unlock more functions like
                having your own avatar!
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.rowButton}>
                  <MaterialCommunityIcons
                    name="creation"
                    size={40}
                    color={colors.samRed}
                  />
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rowButton}>
                  <MaterialCommunityIcons
                    name="login"
                    size={40}
                    color={colors.samRed}
                  />
                  <Text style={styles.buttonText}>Log in</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.separator} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.rowButton}>
              <MaterialCommunityIcons
                name="clock-time-eight"
                size={60}
                color={colors.samRed}
              />
              <Text style={styles.buttonText}>My Routines</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rowButton}>
              <MaterialCommunityIcons
                name="run"
                size={60}
                color={colors.samRed}
              />
              <Text style={styles.buttonText}>My Journey</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rowButton}>
              <MaterialCommunityIcons
                name="chart-areaspline-variant"
                size={60}
                color={colors.samRed}
              />
              <Text style={styles.buttonText}>My Statistics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  bodyContent: {
    alignItems: 'center',
    padding: 30,
  },
  buttonContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: colors.samBlack,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#FFE9F3',
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: colors.samBlack,
    marginTop: 10,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: colors.samBlack,
    marginBottom: 10,
    textAlign: 'center',
  },
  name: {
    fontSize: 22,
    color: colors.samBlack,
    fontWeight: '600',
  },
  rowButton: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'lightgrey',
    marginTop: 50,
  },
});

ProfileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default ProfileScreen;
