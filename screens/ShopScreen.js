import { Pages } from 'react-native-pages';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import PropTypes from 'prop-types';
import { db, auth } from '../firebase';
import { useIsFocused } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

import colors from '../config/colors';
import Screen from '../components/Screen';
import { ImageBackground } from 'react-native';

const ShopScreen = ({ navigation }) => {
  const user = auth.currentUser;

  return (
    <Screen
      style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
    >
      <Image
        source={require('../assets/RoutinesPics/HQ/WaterDrinking.png')}
        style={{
          width: '100%',
          height: '100%',
          alignSelf: 'center',
          position: 'absolute',
          zIndex: 1,
        }}
      />
      <Pages style={{ zIndex: 5 }}>
        <View style={{ flex: 1, backgroundColor: 'red' }}>
          <Text style={styles.text}>hello</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'blue' }}>
          <Text style={styles.text}>hello</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'green' }}>
          <Text style={styles.text}>hello</Text>
        </View>
      </Pages>
    </Screen>
  );
};

const styles = StyleSheet.create({
  text: {
    zIndex: 6,
    position: 'absolute',
    width: '100%',
    height: '100%',
    textAlign: 'center',
  },
});

ShopScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default ShopScreen;

// react native pages license
// BSD License

// Copyright 2017 Alexander Nazarov

// Redistribution and use in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:

//  * Redistributions of source code must retain the above copyright notice, this
//    list of conditions and the following disclaimer.

//  * Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.

//  * Neither the name of the copyright holder nor the names of its contributors
//    may be used to endorse or promote products derived from this software
//    without specific prior written permission.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
// ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
