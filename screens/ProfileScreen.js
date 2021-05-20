import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Avatar, Button } from 'react-native-elements';
// import firestore from '@react-native-firebase/firestore';
import { db, auth } from '../firebase';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';

import Screen from '../components/Screen';
import colors from '../config/colors';
import CancelAllNotifications from '../components/notification/CancelAllNotifications';

const { width, height } = Dimensions.get('screen');

const ProfileScreen = ({ navigation }) => {
  const user = auth.currentUser;

  const [name, setName] = useState('');
  const [roubies, setRoubies] = useState('');
  const [userRank, setUserRank] = useState('');
  const [guest, setGuest] = useState('');

  const signOutUser = () => {
    CancelAllNotifications();
    auth.signOut().then(() => {
      setTimeout(() => navigation.navigate('Welcome'), 0);
    });
  };

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

  const isFocused = useIsFocused();
  useEffect(() => {
    getUserInfo();
  }, [isFocused]);

  return (
    <Screen style={styles.container}>
      <ScrollView>
        <View style={styles.topContainer}>
          <Avatar
            rounded
            size="large"
            source={{
              uri: 'https://png.pngtree.com/png-vector/20190803/ourlarge/pngtree-avatar-user-basic-abstract-circle-background-flat-color-icon-png-image_1647265.jpg',
            }}
          />
          <View style={styles.topTextContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.description}>Rank: {userRank}</Text>
          </View>
        </View>

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
            </View>
          )}

          <View style={styles.separator} />
          {/* <TouchableOpacity
            onPress={() =>
              navigation.navigate('Browse routines', {
                screen: 'Browse routines',
              })
            }
            style={styles.routineButtonContainer}
          >
            <MaterialCommunityIcons
              name="bell-plus-outline"
              size={35}
              color={colors.samRed}
            />
            <Text style={styles.routineButtonText}>Add Routines</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('My Routines', { screen: 'My Routines' })
            }
            style={styles.routineButtonContainer}
          >
            <MaterialCommunityIcons
              name="weight-lifter"
              size={35}
              color={colors.samRed}
            />
            <Text style={styles.routineButtonText}>My Routines</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  bodyContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  buttonContainer: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: colors.darkmodeMediumWhite,
  },
  container: {
    flexGrow: 1,
    width: width,
  },
  description: {
    fontSize: 16,
    color: colors.darkmodeMediumWhite,
    marginTop: 10,
    textAlign: 'center',
  },
  info: {
    fontSize: 20,
    color: colors.darkmodeMediumWhite,
    marginBottom: 10,
    textAlign: 'center',
  },
  link: {
    fontSize: 20,
    color: colors.blue,
    marginBottom: 10,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    color: colors.darkmodeMediumWhite,
    fontWeight: '600',
  },
  routineButtonContainer: {
    flexDirection: 'row',
    margin: 5,
    marginTop: 20,
  },
  routineButtonText: {
    fontSize: 24,
    color: colors.samRed,
    fontWeight: 'bold',
    marginTop: 3,
    marginLeft: 20,
  },
  rowButton: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  separator: {
    width: '80%',
    height: 1,
    backgroundColor: colors.darkmodeMediumWhite,
    marginTop: 10,
  },
  topContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
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
