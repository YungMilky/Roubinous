import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AppText from './AppText';
import { Octicons, FontAwesome } from '@expo/vector-icons';
import colors from '../config/colors';
import { auth, db } from '../firebase';
import { useIsFocused } from '@react-navigation/native';

const headerRoubinesButton = () => {
  const navigation = useNavigation();
  const [roubies, setRoubies] = useState('');

  const isFocused = useIsFocused();
  useEffect(() => {
    try {
      const user = auth.currentUser.uid;
      db.collection('Users')
        .doc(user)
        .get('Roubies')
        .then((documentSnapshot) => {
          setRoubies(documentSnapshot.data().Roubies);
        });
    } catch (e) {
      console.log(
        'Timo is a dum-dum and u looged out cant get Roubies info: ' + e
      );
    }
  }, [isFocused]);

  // useEffect(() => {

  // }, []);

  return (
    <View style={styles.groupButton}>
      {/* <TouchableOpacity onPress={() => navigation.navigate('TimosShop')}> */}
      <View style={styles.container}>
        <AppText style={styles.apptext}>{roubies}</AppText>
        <FontAwesome
          style={{ marginTop: 14, marginRight: -10, marginLeft: 2 }}
          name="diamond"
          size={20}
          color={'#a30010'}
        />
      </View>
      {/* </TouchableOpacity> */}
      <View style={styles.separator} />
      <View style={styles.settings}>
        <TouchableOpacity
          style={{ paddingRight: 10 }}
          onPress={() => navigation.navigate('Settings')}
        >
          <Octicons
            name="settings"
            size={26}
            color={colors.darkmodeHighWhite}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 35,
    marginTop: 5,
    marginRight: -5,
  },
  container: {
    flexDirection: 'row',
    marginLeft: 2,
    marginBottom: 10,
  },
  groupButton: {
    flexDirection: 'row',
    padding: 5,
    marginRight: 10,
  },
  apptext: {
    marginTop: 10,
    marginRight: 2,
    fontSize: 20,
    color: colors.darkmodeHighWhite,
  },
  separator: {
    width: 1,
    height: 25,
    marginTop: 12,
    marginLeft: 15,
    marginRight: 10,
  },
  settings: {
    marginTop: 10,
  },
});

export default headerRoubinesButton;
