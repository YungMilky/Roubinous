import { Agenda } from 'react-native-calendars';
import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Image,
} from 'react-native';
import { db, auth } from '../firebase';
import { Icon } from 'react-native-elements';

import firebase from 'firebase/app';
import colors from '../config/colors';

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

function CalendarScreen() {
  const [items, setItems] = useState({});
  const [addedRoutines, setAddedRoutines] = useState([]);

  const userId = auth.currentUser.uid;

  let allRoutinesData = [];
  let routinesThatHaveBeenAdded = [];

  const checkNumber = (number) => {
    if (number < 10) {
      number = '0' + number.toString();
    }
    return number;
  };

  const getItems = (routineType) => {
    db.collection('Users')
      .doc(userId)
      .collection(routineType)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (!getIfRoutineHasBeenAdded(doc.id)) {
            let today = new Date();
            let day = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate()
            );
            let times = JSON.parse(doc.data().routineTimes);
            const days = JSON.parse(doc.data().days);
            if (!doc.data().removed) {
              const daysCurrent = {};
              let daysDateStrings = [];

              let firstDayFound = false;
              let x = 1;
              //förlänger daysobjektet och gör så att det börjar på dagens datum
              for (let o = 0; o < 2; o++) {
                for (let i = 0; i < 7; i++) {
                  //förläng objektet så det har 30+ items
                  if (firstDayFound) {
                    daysCurrent[x] = days[i];
                    x++;
                  }
                  if (i === today.getDay() && !firstDayFound) {
                    daysCurrent[0] = days[i]; //köra getDay så man vet vart i objektet man ska börja
                    firstDayFound = true;
                  }
                }
              }
              for (let i = 0; i < 10; i++) {
                //loopar igenom objektet med items och kollar true/false
                day.setDate(day.getDate() + 1);
                if (daysCurrent[i] === 1) {
                  daysDateStrings.push(day.toISOString().split('T')[0]); //ny array där alla de datum i dateStrings listas
                }
              }
              //lägger till flera om man har flera tider för rutinen
              for (let i = 0; i < times.length; i++) {
                for (let x = 0; x < daysDateStrings.length; x++) {
                  allRoutinesData.push({
                    routineName: doc.id,
                    dates: daysDateStrings[x],
                    isDone: doc.data().isDone,
                    times: times[i],
                  });
                }
              }
            }
            routinesThatHaveBeenAdded.push({
              name: doc.id,
              type: routineType,
            });
            setAddedRoutines(routinesThatHaveBeenAdded);
          }
        });
      });
  };

  const getIfRoutineHasBeenAdded = (routineName) => {
    let hasBeenAdded = false;

    for (let i = 0; i < routinesThatHaveBeenAdded.length; i++) {
      if (routineName == routinesThatHaveBeenAdded[i].name) {
        hasBeenAdded = true;
      }
    }
    return hasBeenAdded;
  };

  const getRoutineType = (routineName) => {
    let routineType = '';
    for (let i = 0; i < addedRoutines.length; i++) {
      if (routineName === addedRoutines[i].name) {
        routineType = addedRoutines[i].type;
      }
    }
    return routineType;
  };

  const loadItems = () => {
    getItems('routines');
    getItems('customRoutines');
    try {
      setTimeout(() => {
        let routinesNameThatDay = [];
        let notesForThatDay = [];
        let routinesDoneForThatDay = [];
        let routineHoursThatDay = [];
        let routineMinutesThatDay = [];
        let routineTimesKey = [];

        // console.log(allRoutinesData.length);
        // for (let i = 0; i < routinestimes.length; i++) {
        //   let array = routinestimes[i];
        // !!! Så fort den kommer in i for loopen så blir det fucked !!!
        //Kanske lägga in en array med datum sen ta ut datumet till time //refereshed
        for (let i = 0; i < allRoutinesData.length; i++) {
          // const time = day.timestamp * 24 * 60 * 60 * 1000;

          const strTime = allRoutinesData[i].dates;

          for (let i = 0; i < allRoutinesData.length; i++) {
            const strTimeCompare = allRoutinesData[i].dates;
            const routineNames = allRoutinesData[i].routineName;
            const hoursThatDay = allRoutinesData[i].times.hours;
            const minutesThatDay = allRoutinesData[i].times.minutes;
            const notes = allRoutinesData[i].notes;
            const isDone = allRoutinesData[i].times.isDone;
            const key = allRoutinesData[i].times.key;

            if (strTime === strTimeCompare) {
              routinesNameThatDay.push(routineNames);
              notesForThatDay.push(notes);
              routinesDoneForThatDay.push(isDone);
              routineHoursThatDay.push(hoursThatDay);
              routineMinutesThatDay.push(minutesThatDay);
              routineTimesKey.push(key);
            }
          }

          if (!items[strTime]) {
            items[strTime] = [];

            for (let i = 0; i < routinesNameThatDay.length; i++) {
              //Items[strTime] = ID (keys), vilet är datum
              items[strTime].push({
                name: routinesNameThatDay[i],
                dayNotes: notesForThatDay[i],
                ItemisDone: routinesDoneForThatDay[i],
                itemTime: strTime,
                timeToDo: `${checkNumber(routineHoursThatDay[i])}:${checkNumber(
                  routineMinutesThatDay[i]
                )}`,
                hours: routineHoursThatDay[i],
                minutes: routineMinutesThatDay[i],
                height: 100,
                timeKey: routineTimesKey[i],
                // height: Math.max(50, Math.floor(Math.random() * 150)),
              });
            }
          }
          routineHoursThatDay = [];
          routineMinutesThatDay = [];
          routinesNameThatDay = [];
          notesForThatDay = [];
          routinesDoneForThatDay = [];
        }

        const newItems = {};
        Object.keys(items).forEach((key) => {
          newItems[key] = items[key];
        });
        // console.log(newItems);
        setItems(newItems);
      }, 500);
    } catch (e) {
      console.log('Något gick fel!');
    }
  };

  const renderItem = (item) => {
    // itemTimesADay = JSON.parse(documentSnapshot.data().routineTimes);

    try {
      // const todayCheck = new Date().toISOString().split('T')[0];

      const todayCheck = new Date().toISOString().split('T')[0];
      const itemTimeCompare = item.itemTime;

      if (!item.ItemisDone && todayCheck === itemTimeCompare) {
        {
          return (
            <TouchableOpacity
              style={[styles.item, { height: item.height }]}
              onPress={() => {
                Alert.alert(
                  'Are you done this routine?',
                  item.name,
                  //item.dayNotes,
                  [
                    {
                      text: 'No',
                      onPress: () => console.log('Nope Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Yes!',
                      onPress: () => checkItemDone(item.name, item),
                    },
                  ],
                  {
                    cancelable: true,
                    onDismiss: () => console.log('Dismissed'),
                  }
                );
              }}
            >
              <View style={styles.box}>
                <Text style={styles.fonts}>{item.name}</Text>
                <Image
                  style={styles.image}
                  source={require('../assets/RoutinesPics/WaterDrinking.png')}
                />
              </View>
              <Text style={styles.timeSheet}>
                {' '}
                {checkNumber(item.hours)}:{checkNumber(item.minutes)}
              </Text>
            </TouchableOpacity>
          );
        }
      } else if (item.ItemisDone && todayCheck === itemTimeCompare) {
        return (
          <View style={[styles.itemDone, { height: item.height }]}>
            <View style={styles.box}>
              <Text style={styles.fonts}>{item.name + ' is done!'}</Text>

              <Icon name="checkmark" type="ionicon" color="#39B91C" />

              <Image
                style={styles.image}
                source={require('../assets/RoutinesPics/WaterDrinking.png')}
              />
            </View>
            <Text style={styles.fontsDone}>{'Good Job!'}</Text>
          </View>
        );
      } else {
        return (
          <View style={[styles.itemDone, { height: item.height }]}>
            <View style={styles.box}>
              <Text style={styles.fonts}>{item.name}</Text>
              <Image
                style={styles.image}
                source={require('../assets/RoutinesPics/WaterDrinking.png')}
              />
            </View>
            <Text style={styles.fontsDone}>{'Coming'}</Text>
          </View>
        );
      }
    } catch (e) {
      console.log(
        'Opps, crash! Luckily OP Timo is here and you can refresh without crash :)' +
          e
      );
    }
  };

  //Behöver kanske lägga in time som parameter också om getthirtydays är implementerad
  const checkItemDone = (routineName, item) => {
    onRefresh();
    //Sätter item till annan render i logiken under loadItems
    item.ItemisDone = true;

    let doneTime = [
      {
        key: item.timeKey,
        hours: item.hours,
        minutes: item.minutes,
        isDone: true,
      },
    ];
    let times = [];
    let newTimes = [];

    db.collection('Users')
      .doc(userId)
      .collection(getRoutineType(routineName))
      .doc(routineName)
      .get()
      .then((doc) => {
        times = JSON.parse(doc.data().routineTimes);
        // console.log(JSON.parse(doc.data().routineTimes));
      });

    const increment = firebase.firestore.FieldValue.increment(1);
    db.collection('Users')
      .doc(userId)
      .update({ Roubies: increment, Exp: increment });

    setTimeout(() => {
      for (let i = 0; i < times.length; i++) {
        if (times[i].key == item.timeKey) {
          times[i].isDone = true;
        }
        console.log('times[i].key): ' + times[i].key);
        console.log('item.timeKey: ' + item.timeKey);
        console.log('times.length: ' + times.length);
      }
      console.log(times);
      db.collection('Users')
        .doc(userId)
        .collection(getRoutineType(routineName))
        .doc(routineName)
        .update({
          routineTimes: JSON.stringify(times),
        });
    }, 500);
    allRoutinesData = [];
    getItems('routines');
    getItems('customRoutines');
    loadItems();
    renderItem(item);
  };

  const [refreshing, setRefresh] = useState(false);

  const onRefresh = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1500);
  };

  return (
    <Agenda
      items={items}
      loadItemsForMonth={loadItems}
      renderItem={renderItem}
      // minDate={new Date() }
      onRefresh={onRefresh}
      refreshing={refreshing}
      theme={{
        agendaDayTextColor: colors.samRed,
        agendaDayNumColor: colors.samRed,
        agendaTodayColor: colors.samRed,
        agendaKnobColor: colors.samRed,
      }}
    />
  );
}
const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.test,
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemDone: {
    backgroundColor: '#D1D0CE',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  box: {
    flexDirection: 'row',
  },
  image: {
    flex: 1,
    width: 100,
    height: 130,
    position: 'absolute',
    marginLeft: 190,
    top: -40,
  },
  fonts: {
    fontSize: 15,
    fontFamily: 'Roboto',
    color: 'black',
    marginTop: 5,
    marginRight: 3,
  },
  fontsDone: {
    fontSize: 20,
    fontFamily: 'Roboto',
    fontStyle: 'italic',
    color: 'black',
    marginTop: 6,
  },
  timeSheet: {
    marginTop: 4,
  },
});
export default CalendarScreen;
