import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AppText from './AppText';
import { Octicons } from '@expo/vector-icons';
import colors from '../config/colors';
import { auth, db } from '../firebase';

const headerRoubinesButton = () => {
  const navigation = useNavigation();
  const [roubies, setRoubies] = useState('');

  useEffect(() => {
    try {
      const user = auth.currentUser.uid;
      db.collection('Users')
        .doc(user)
        .get('Roubies')
        .then((documentSnapshot) => {
          setRoubies(documentSnapshot.data().Roubies);
          console.log(roubies);
        });
    } catch (e) {
      console.log(
        'Timo is a dum-dum and u looged out cant get Roubies info: ' + e
      );
    }
  }, [roubies]);

  return (
    <View style={styles.groupButton}>
      <View style={styles.settings}>
        <TouchableOpacity
          style={{ paddingRight: 10 }}
          onPress={() => navigation.navigate('Settings')}
        >
          {/* <Image
        style={{ width: 26, height: 26 }}
        source={require('./assets/icons/tune-vertical.png')}
      /> */}
          <Octicons
            name="settings"
            size={26}
            color={colors.darkmodeHighWhite}
          />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('TimosShop')}>
          <View style={styles.container}>
            <Image
              style={styles.logo}
              source={require('../assets/icons/ruby.png')}
            />
            <AppText style={styles.apptext}>{roubies}</AppText>
          </View>
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
    fontSize: 20,
    color: colors.darkmodeHighWhite,
  },
  settings: {
    marginTop: 10,
  },
});

export default headerRoubinesButton;
