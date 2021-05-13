import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { auth, db, fp } from '../firebase';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import { useIsFocused } from '@react-navigation/native';

import differenceInDays from 'date-fns';

import colors from '../config/colors';
import Tag from './Tag';

const { width, height } = Dimensions.get('screen');

//weight by answers
//weight by routines
//  each routine having an array of tips field, in order
//weight by recently added routine
//weight by difficulty compared to user rank

//set weight with percentage of 1

//frequency
//  when you've added a new routine
//  when you've leveled up
//

export default () => {
  const [userID, setUserID] = useState(auth.currentUser.uid);

  const [lastTipReceived, setLastTipReceived] = useState();

  const [globalAnswers, setGlobalAnswers] = useState();
  const [globalRoutines, setGlobalRoutines] = useState();
  const [globalUserRank, setGlobalUserRank] = useState();

  const [globalFirstSteps, setGlobalFirstSteps] = useState();
  const [globalGeneralTips, setGlobalGeneralTips] = useState();
  const [globalMinmaxgodTips, setGlobalMinmaxgodTips] = useState();
  const [globalRoutineSpecificTips, setGlobalRoutineSpecificTips] = useState();

  const [expanded, setExpanded] = useState(false);
  const [show, setShow] = useState('wobble');
  const animationHeight = useRef(new Animated.Value(2)).current;

  const isFocused = useIsFocused();
  useEffect(() => {
    setTimeout(() => {
      setTipShown();
    }, 3000);
  }, [isFocused]);

  useEffect(() => {
    getLastTipReceived();
  }, []);

  function getStuff() {
    getAnswers();
    getRoutines();
    getUserRank();

    getFirstStepsTips();
    getGeneralTips();
    getMinmaxgodTips();
    getRoutineSpecificTips();
  }

  function weightedRandom(number) {
    var i,
      sum = 0,
      random = Math.random();

    for (i in number) {
      sum += number[i];
      if (random <= sum) return i;
    }
  }

  //utility functions to add days and hours
  //handles months and years when incrementing
  //crazy names to avoid javascript overwriting functions with updates
  Date.prototype.addDaysCRAZYNAMEAVOIDSUPDATE = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  Date.prototype.addHoursCRAZYNAMEAVOIDSUPDATE = function (h) {
    this.setTime(this.getTime() + h * 60 * 60 * 1000);
    return this;
  };

  let currentTime = new Date();
  //if user hasn't received a tip in the last 3 hours
  if (lastTipReceived >= currentTime.addHoursCRAZYNAMEAVOIDSUPDATE(3)) {
    getStuff();
  }

  function setTipShown() {}

  function getLastTipReceived() {
    if (userID) {
      db.collection('Users')
        .doc(userID)
        .get()
        .then((doc) => {
          setLastTipReceived(doc?.data()?.lastTipReceived);
        });
    }
  }

  function getAnswers() {
    if (userID) {
      db.collection('Users')
        .doc(userID)
        .get()
        .then((doc) => {
          setGlobalAnswers(doc?.data()?.introAnswers);
        });
    }
  }

  function getUserRank() {
    if (userID) {
      let userRank = 0;
      db.collection('Users')
        .doc(userID)
        .get()
        .then((doc) => {
          userRank = doc?.data()?.UserRank;
        });
      setGlobalUserRank(userRank);
    }
  }

  //routines that are a day old or more
  //includes name, difficulty, startdate, and color
  function getRoutines() {
    if (userID) {
      let routines = [];
      let routineColors = [];

      const officialRoutinesRef = db.collection('Routines');
      const userRoutinesRef = db
        .collection('Users')
        .doc(userID)
        .collection('routines');

      //get root routines for color
      officialRoutinesRef.get().then((officialRoutineQuery) => {
        officialRoutineQuery.forEach((doc) => {
          routineColors.push({
            name: doc.id,
            color: doc?.data()?.Color,
          });
        });
      });

      //get user routines
      userRoutinesRef.get().then((userRoutineQuery) => {
        userRoutineQuery.forEach((doc) => {
          let currentColor = routineColors.filter(
            (color) => color.name === doc?.id
          );

          routines.push({
            name: doc?.id,
            difficulty: doc?.data()?.RoutineDifficulty,
            date: doc?.data()?.StartDate,
            color: currentColor?.color,
          });
        });

        //filter by a day old
        let moreThanADayOldRoutines = routines.filter((item) => {
          return (
            new Date() >= item['date'].toDate().addDaysCRAZYNAMEAVOIDSUPDATE(1)
          );
        });

        setGlobalRoutines(
          moreThanADayOldRoutines.sort((a, b) => b.date - a.date)
        );
      });
    }
  }

  function getFirstStepsTips() {
    if (globalRoutines) {
      const tipsRef = db.collection('Tips').doc('First steps');
      let firstSteps = [];

      tipsRef.get().then((doc) => {
        firstSteps.push(doc.data());
        setGlobalFirstSteps(firstSteps[0]);
      });
    }
  }

  function getGeneralTips() {
    const tipsRef = db.collection('Tips').doc('General');
    let generalTips = [];

    tipsRef.get().then((doc) => {
      generalTips.push(doc.data());
      setGlobalGeneralTips(generalTips[0]);
    });
  }

  function getMinmaxgodTips() {
    const tipsRef = db.collection('Tips').doc('Minmaxgod');
    let minmaxgodTips = [];

    tipsRef.get().then((doc) => {
      minmaxgodTips.push(doc.data());
      setGlobalMinmaxgodTips(minmaxgodTips[0]);
    });
  }

  function getRoutineSpecificTips() {
    if (globalRoutines) {
      const routinesRef = db.collection('Routines');
      let routineSpecific = [];

      routinesRef.get().then((query) => {
        query.forEach((doc) => {
          for (let i = 0; i < globalRoutines.length; i++) {
            if (doc.id === globalRoutines[i].name) {
              let data = doc?.data()?.RoutineTips;

              if (data) {
                routineSpecific.push(data);
              }
            }
          }
        });
        // title: routineSpecific[0][0][0]
        // body: routineSpecific[0][0][1]
        // boolean: routineSpecific[0][0][2]
        setGlobalRoutineSpecificTips(routineSpecific[0]);
      });
      setPopup();
    }
  }

  // const [globalFirstSteps, setGlobalFirstSteps] = useState();
  // const [globalGeneralTips, setGlobalGeneralTips] = useState();
  // const [globalMinmaxgodTips, setGlobalMinmaxgodTips] = useState();

  function setPopup() {
    if (globalFirstSteps) {
      let length = Object.keys(globalFirstSteps.Tips).length;
      for (let i = 0; i < length; i++) {
        //boolean values for each array object in the RoutineTips array
        //if a tip hasn't been shown (false)
        if (!globalFirstSteps.Tips[i][2]) {
          // title: globalFirstSteps.Tips[i][0]
          // text: globalFirstSteps.Tips[i][1]
          // boolean: globalFirstSteps.Tips[i][2]
        }
      }
    }

    if (globalGeneralTips) {
      let length = Object.keys(globalGeneralTips.Tips).length;
      for (let i = 0; i < length; i++) {
        //boolean values for each array object in the RoutineTips array
        //if a tip hasn't been shown (false)
        if (!globalGeneralTips.Tips[i][2]) {
          // title: globalGeneralTips.Tips[i][0]
          // text: globalGeneralTips.Tips[i][1]
          // boolean: globalGeneralTips.Tips[i][2]
        }
      }
    }

    // if (globalMinmaxgodTips) {
    //   // console.log(Object.keys(globalMinmaxgodTips).length);
    //   let length = Object.keys(globalMinmaxgodTips.Tips).length;
    //   for (let i = 0; i < length; i++) {
    //     //boolean values for each array object in the RoutineTips array
    //     //if a tip hasn't been shown (false)
    //     if (!globalMinmaxgodTips.Tips[i][1]) {
    //       console.log(globalMinmaxgodTips.Tips[i][0]);
    //     }
    //   }
    // }

    if (globalRoutineSpecificTips) {
      // console.log(globalRoutineSpecificTips);
      let length = Object.keys(globalRoutineSpecificTips).length;
      for (let i = 0; i < length; i++) {
        //boolean values for each array object in the RoutineTips array
        //if a tip hasn't been shown (false)
        if (!globalRoutineSpecificTips[i][2]) {
          // title: globalRoutineSpecificTips[i][0]
          // text: globalRoutineSpecificTips[i][1]
          // boolean: globalRoutineSpecificTips[i][2]
        }
      }
    }
  }

  function setWeights() {}

  weightedRandom({ 0: 0.8, 1: 0.1, 2: 0.1 });

  useEffect(() => {
    if (expanded) {
      Animated.timing(animationHeight, {
        duration: 100,
        toValue: 144,
        easing: Easing.linear,
      }).start();
    } else {
      Animated.timing(animationHeight, {
        duration: 100,
        toValue: 80,
        easing: Easing.linear,
      }).start();
    }
  }, [expanded]);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const togglePopup = () => {
    if (show === 'fadeOutLeft') {
      setShow('wobble');
    } else if (show === 'wobble') {
      setShow('fadeOutLeft');
    }
  };

  return (
    <Animatable.View useNativeDriver={true} animation={show} duration={300}>
      <Animated.View
        useNativeDriver={true}
        style={[
          styles.container,
          {
            height: animationHeight,
          },
        ]}
      >
        <Pressable onPress={() => toggleExpansion()}>
          <MaterialCommunityIcons
            name='heart-multiple-outline'
            size={24}
            color={colors.darkmodeMediumWhite}
            style={styles.tipIcon}
          />
        </Pressable>
        <View>
          <Pressable onPress={() => toggleExpansion()}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>We gon get it bussin</Text>
              <View style={{ right: -5, top: -1 }}>
                <Pressable
                  style={{
                    paddingTop: 6,
                    paddingLeft: 3,
                    height: 20,
                    zIndex: 2,
                  }}
                  onPress={() => togglePopup()}
                >
                  <AntDesign
                    name='close'
                    size={16}
                    color={colors.darkmodeMediumWhite}
                    style={[
                      styles.tipClose,
                      expanded ? { top: -8 } : { top: -6 },
                    ]}
                  />
                </Pressable>
              </View>
            </View>
            <Text
              ellipsizeMode={'tail'}
              numberOfLines={expanded ? 4 : 2}
              style={styles.contentText}
            >
              Maintain that shit for like two weeks, boom badabap pow
            </Text>
            {expanded && (
              <View style={{ alignItems: 'flex-end' }}>
                <Pressable
                  onPress={() => {
                    console.log('do something');
                  }}
                  style={{
                    top: 5,
                    paddingLeft: 6,
                    paddingBottom: 4,
                    paddingTop: 2,
                  }}
                >
                  <Text style={styles.allTips}>All tips</Text>
                </Pressable>
              </View>
            )}
          </Pressable>
        </View>
      </Animated.View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipIcon: {
    paddingLeft: 16,
    paddingRight: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tipClose: { paddingRight: 5 },
  allTips: {
    width: 56,
    fontSize: 16,
    color: colors.darkmodeMediumWhite,
  },
  headerText: {
    fontWeight: '700',
    paddingLeft: 12,
    fontSize: 18,
    color: colors.darkmodeHighWhite,
  },
  contentText: {
    top: -0,
    width: 340,
    paddingLeft: 12,
    paddingRight: 14,
    fontSize: 17,
    color: colors.darkmodeHighWhite,
    textAlign: 'justify',
  },
});

//undviker weighted random algoritm in favor of linear progression
//fixat item.shortdescription
//lastTipReceived

// TOOD
//  visa tips
//  timer på tips
//  remove routine on routinescreen
//  ta bort listener
//  make sure shortdescription funkar
