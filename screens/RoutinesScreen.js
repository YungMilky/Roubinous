import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import RoutineItems from '../components/RoutineItems';
import Screen from '../components/Screen';
import Separator from '../components/Separator';
import colors from '../config/colors';
import AppText from '../components/AppText';
import { db, auth } from '../firebase';

function RoutinesScreen({ navigation }) {
  const user = auth.currentUser;
  const [userRankNumber, setuserRankNumber] = useState();
  // var userRank;

  const getUserInfo = () => {
    db.collection('Users')
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        setuserRankNumber(documentSnapshot.get('UserRank'));
      });
  };
  getUserInfo();

  const getUserRank = () => {
    if (userRankNumber > 10) {
      return <AppText style={styles.levelText}>Pro</AppText>;
    }
    if (userRankNumber < 10) {
      return <AppText style={styles.levelText}>Amature</AppText>;
    }
  };
  // if (userRankNumber > 10) {
  //   var userRank = "Pro";
  // } else if (userRankNumber < 10) {
  //   var userRank = "Amature";
  // }

  const items = [
    {
      id: 1,
      title: 'Hydration',
      description: 'Water is good',
      userLevelReq: 'Lv 1',
      image: require('../assets/RoutinesPics/water.jpg'),
    },
    {
      id: 2,
      title: 'Yoga',
      description: 'Yoga is good',
      userLevelReq: 'Lv 1',
      image: require('../assets/RoutinesPics/yoga.jpg'),
    },
    {
      id: 3,
      title: 'Workout',
      description: 'Workout is good',
      userLevelReq: 'Lv 1',
      image: require('../assets/RoutinesPics/weights.jpg'),
    },
    {
      id: 4,
      title: 'Eat Breakfast',
      description: 'Eat is good',
      userLevelReq: 'Lv 1',
      image: require('../assets/RoutinesPics/breakfast.jpg'),
      //Customise icons??? Mosh 11,12 Lists
    },
  ];

  const itemlevel2 = [
    {
      id: 5,
      title: 'Workout',
      description: 'Workout is good',
      userLevelReq: 'Lv 2',
      image: require('../assets/RoutinesPics/weights.jpg'),
    },
    {
      id: 6,
      title: 'Workout',
      description: 'Workout is good',
      userLevelReq: 'Lv 2',
      image: require('../assets/RoutinesPics/weights.jpg'),
    },
    {
      id: 7,
      title: 'Workout',
      description: 'Workout is good',
      userLevelReq: 'Lv 2',
      image: require('../assets/RoutinesPics/weights.jpg'),
    },
  ];
  return (
    <Screen>
      <ScrollView>
        <View style={styles.max}>
          <Text
            style={styles.text}
            onPress={() =>
              navigation.navigate('AddRoutine', { screen: 'AddRoutine' })
            }
          >
            Add a custom routine
          </Text>
          <View style={styles.container}>{getUserRank()}</View>
          {/* <View style={styles.container}>
            <AppText style={styles.levelText}>{userRank}</AppText>
          </View> */}
          <View style={styles.container}>
            <AppText style={styles.levelText}>Level 1</AppText>
          </View>
          <FlatList
            data={items}
            keyExtractor={(items) => items.id.toString()}
            renderItem={({ item }) => (
              <RoutineItems
                title={item.title}
                subtitle={item.description}
                image={item.image}
                userLevelReq={item.userLevelReq}
                onPressOut={() => console.log('Selected', item)}
              />
            )}
            ItemSeparatorComponent={Separator}
          />
          <View style={styles.container}>
            <AppText style={styles.levelText}>Level 2</AppText>
          </View>
          <FlatList
            data={itemlevel2}
            keyExtractor={(items) => items.id.toString()}
            renderItem={({ item }) => (
              <RoutineItems
                title={item.title}
                subtitle={item.description}
                image={item.image}
                userLevelReq={item.userLevelReq}
                onPressOut={() => console.log('Selected', item)}
              />
            )}
            ItemSeparatorComponent={Separator}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 45,
    padding: 10,
    backgroundColor: colors.samRed,
    borderRadius: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
  levelText: {
    textAlign: 'center',
    fontSize: 20,
  },
  max: {
    display: 'flex',
    flex: 1,
  },
  text: {
    textAlign: 'center',
    textShadowRadius: 3,
    color: colors.samBlue,
    fontSize: 20,
    marginBottom: 20,
  },
});

export default RoutinesScreen;
