import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { db, auth } from '../firebase';
import { useIsFocused } from '@react-navigation/native';
import { Divider } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';

import colors from '../config/colors';
import Screen from '../components/Screen';
import { ScrollView } from 'react-native-gesture-handler';
import Separator from '../components/Separator';

const JourneyScreen = ({ navigation }) => {
  const [totalRoubies, setTotalRoubies] = useState('');
  const [userRoutines, setUserRoutines] = useState([]);
  const [userCustomRoutines, setUserCustomRoutines] = useState([]);
  const user = auth.currentUser;

  const getUserRoutines = async () => {
    db.collection('Users')
      .doc(user.uid)
      .collection('customRoutines')
      .get()
      .then((QuerySnapshot) => {
        setUserCustomRoutines([]);
        QuerySnapshot.forEach((doc) => {
          setUserCustomRoutines((oldArray) => [
            ...oldArray,
            {
              label: doc.id,
              value: doc.id,
            },
          ]);
        });
      });
    db.collection('Users')
      .doc(user.uid)
      .collection('routines')
      .get()
      .then((QuerySnapshot) => {
        setUserRoutines([]);
        QuerySnapshot.forEach((doc) => {
          if (!doc.data().removed) {
            setUserRoutines((oldArray) => [
              ...oldArray,
              {
                value: doc.id,
              },
            ]);
          }
        });
      });
  };

  useEffect(() => {
    getUserRoutines();
  }, []);

  const getUserInfo = () => {
    db.collection('Users')
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        setTotalRoubies(documentSnapshot.data().Exp);
      });
  };
  const isFocused = useIsFocused();
  useEffect(() => {
    getUserInfo();
    getUserRoutines();
  }, [isFocused]);

  return (
    <Screen style={styles.container}>
      {/* <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={setRefreshing}
          onRefresh={this._onRefresh}
        />
      }
    > */}
      {/* <View style={styles.container}> */}
      <FontAwesome
        style={{ marginBottom: 20 }}
        name="trophy"
        size={100}
        color={colors.samRed}
      />
      <Text style={styles.text}>Total Roubies Earned:</Text>
      <Text style={styles.bigNumberText}>{totalRoubies}</Text>

      <Text style={styles.separator}>───────────────────────────────</Text>
      <Text style={styles.text}>Active Routines:</Text>
      <Text style={[styles.bigNumberText, { marginBottom: 20 }]}>
        {userRoutines.length + userCustomRoutines.length}
      </Text>
      <View style={styles.routineInfo}>
        <Text style={styles.smallerText}>Official:</Text>
        <Text style={styles.smallNumberText}>{userRoutines.length}</Text>
        <Text style={[styles.smallerText, { marginLeft: 20 }]}>Custom:</Text>
        <Text style={styles.smallNumberText}>{userCustomRoutines.length}</Text>
      </View>
      <View style={styles.routineInfo}></View>

      <Text style={styles.separator}>───────────────────────────────</Text>
      {/* </View> */}
      {/* </ScrollView> */}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  text: {
    fontSize: 30,
    color: colors.darkmodeMediumWhite,
  },
  bigNumberText: {
    fontSize: 50,
    color: colors.darkmodeHighWhite,
  },
  routineInfo: {
    flexDirection: 'row',
  },
  separator: {
    fontSize: 10,
    color: colors.darkmodeDisabledWhite,
    margin: 10,
  },
  smallNumberText: {
    fontSize: 30,
    color: colors.darkmodeHighWhite,
  },
  smallerText: {
    fontSize: 20,
    color: colors.darkmodeMediumWhite,
    marginTop: 7,
    marginRight: 7,
  },
});

JourneyScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default JourneyScreen;
