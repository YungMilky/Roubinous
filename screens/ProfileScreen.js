import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
// import firestore from '@react-native-firebase/firestore';
import { db, auth } from '../firebase';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

import Screen from '../components/Screen';
import colors from '../config/colors';
import CancelAllNotifications from '../components/notification/CancelAllNotifications';

const ProfileScreen = ({ navigation }) => {
  const user = auth.currentUser;

  const [name, setName] = useState('');
  const [roubies, setRoubies] = useState('');
  const [userRank, setUserRank] = useState('');
  const [guest, setGuest] = useState('');

  const signOutUser = () => {
    CancelAllNotifications();
    auth.signOut();
  };

  // kolla om man är inloggad med facebook/gmail
  const getUserInfo = () => {
    db.collection('Users')
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        setName(documentSnapshot.data().Name);
        setRoubies(documentSnapshot.data().Roubies);
        setUserRank(documentSnapshot.data().UserRank);
        setGuest(documentSnapshot.data().Guest);
      });
  };
  getUserInfo();
  return (
    <Screen style={styles.container}>
      <ScrollView>
        <View style={styles.topContainer}>
          <Avatar
            rounded
            size="large"
            source={{
              uri:
                'https://png.pngtree.com/png-vector/20190803/ourlarge/pngtree-avatar-user-basic-abstract-circle-background-flat-color-icon-png-image_1647265.jpg',
            }}
          />
          <View style={styles.topTextContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.description}>Rank: {userRank}</Text>
          </View>
        </View>

        <View>
          <View style={styles.bodyContent}>
            <View style={styles.separator} />
            {!guest ? ( //if (guest == false)
              <View style={styles.bodyContent}>
                <Text style={styles.info}>Rank: {userRank}</Text>
                <Text style={styles.info}>Roubies: {roubies}</Text>

                <TouchableOpacity onPress={signOutUser}>
                  <Text style={styles.link}>I want to Logout</Text>
                </TouchableOpacity>
              </View>
            ) : (
              //else
              <View style={styles.bodyContent}>
                <Text style={styles.info}>
                  Psst, {name}! Register or log in to unlock more functions like
                  having your own avatar!
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.rowButton}
                    onPress={() =>
                      navigation.navigate('Register', { screen: 'Register' })
                    }
                  >
                    <MaterialCommunityIcons
                      name="creation"
                      size={40}
                      color={colors.samRed}
                    />
                    <Text style={styles.buttonText}>Register</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rowButton}
                    onPress={() =>
                      navigation.navigate('Login', { screen: 'Login' })
                    }
                  >
                    <MaterialCommunityIcons
                      name="login"
                      size={40}
                      color={colors.samRed}
                    />
                    <Text style={styles.buttonText}>Log in</Text>
                  </TouchableOpacity>
                </View>
                {/* <TouchableOpacity onPress={signOutUser}>
                  <Text style={styles.link}>I want to Logout</Text>
                </TouchableOpacity> */}
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
      </ScrollView>
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
    alignItems: 'flex-start',
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
  link: {
    fontSize: 16,
    color: colors.blue,
    marginBottom: 10,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 'bold',
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
    marginTop: 10,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 100,
    paddingTop: 20,
  },
  topTextContainer: {
    justifyContent: 'center',
    marginLeft: 20,
  },
});

ProfileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default ProfileScreen;
