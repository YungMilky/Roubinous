import React, { useState } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { db, auth } from '../firebase';

import colors from '../config/colors';

function RoubineShower(props) {
  const [roubies, setRoubies] = useState('');

  const getUserInfo = () => {
    db.collection('Users')
      .doc(auth.currentUser.uid)
      .get()
      .then((documentSnapshot) => {
        setRoubies(documentSnapshot.get('Roubies'));
      });
  };
  getUserInfo();
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../images/ruby.png')} />
      <Text style={styles.text}>{roubies}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  image: {
    width: 40,
    height: 40,
  },
  text: {
    color: colors.OrchidPink,
    fontSize: 16,
  },
});

export default RoubineShower;
