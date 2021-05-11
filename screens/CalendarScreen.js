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
import colors from '../config/colors';
import { Icon } from 'react-native-elements';

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

function CalendarScreen() {
  const [items, setItems] = useState({});

  const userId = auth.currentUser.uid;

  let allRoutinesData = [];

  const getItems = (routineType) => {
    db.collection('Users')
      .doc(userId)
      .collection(routineType)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let today = new Date();
          let day = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );
          let times = JSON.parse(doc.data().routineTimes);
          const days = JSON.parse(doc.data().days);
          for (let i = 0; i < times.length; i++) {
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
              for (let i = 0; i < 11; i++) {
                //loopar igenom objektet med items och kollar true/false
                if (daysCurrent[i] === 1) {
                  for (let i = 0; i < times.length; i++) {
                    //lägger till flera om man har flera tider för rutinen
                    daysDateStrings.push(day.toDateString(day)); //ny array där alla de datum i dateStrings listas
                  }
                }
                day.setDate(day.getDate() + 1);
              }
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
        });
      });
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

        console.log('loadItems allRoutinesData: ' + allRoutinesData.length);
        // console.log(allRoutinesData);
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
            const isDone = allRoutinesData[i].isDone;

            if (strTime === strTimeCompare) {
              routinesNameThatDay.push(routineNames);
              notesForThatDay.push(notes);
              routinesDoneForThatDay.push(isDone);
              routineHoursThatDay.push(hoursThatDay);
              routineMinutesThatDay.push(minutesThatDay);
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
                timeToDo: `${routineHoursThatDay[i]}:${routineMinutesThatDay[i]}`,
                height: 100,
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
      }, 1000);
    } catch (e) {
      console.log('Något gick fel!');
    }
  };

  const renderItem = (item) => {
    // itemTimesADay = JSON.parse(documentSnapshot.data().routineTimes);

    try {
      // const todayCheck = new Date().toISOString().split('T')[0];
      console.log('hej');
      const todayCheck = new Date().toDateString();
      const itemTimeCompare = item.itemTime;
      console.log(todayCheck);
      if (!item.ItemisDone && todayCheck == itemTimeCompare) {
        {
          return (
            <TouchableOpacity
              style={[styles.item, { height: item.height }]}
              onPress={() =>
                Alert.alert(
                  item.name,
                  item.dayNotes,
                  [
                    {
                      text: 'Nope',
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
                )
              }
            >
              <View style={styles.box}>
                <Text style={styles.fonts}>{item.name}</Text>
                <Image
                  style={styles.image}
                  source={require('../assets/RoutinesPics/WaterDrinking.png')}
                />
              </View>
              <Text style={styles.timeSheet}>{item.timeToDo}</Text>
            </TouchableOpacity>
          );
        }
      } else if (item.ItemisDone) {
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
              <Text style={styles.fonts}>{item.name + ' u failed'}</Text>
              <Image
                style={styles.image}
                source={require('../assets/RoutinesPics/WaterDrinking.png')}
              />
            </View>
            <Text style={styles.fontsDone}>{'Bad Boy'}</Text>
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

    db.collection('Users')
      .doc(userId)
      .collection('routines')
      .doc(routineName)
      .update({
        isDone: true,
      });

    routinesData = [];
    getItems();
    loadItems();
    renderItem();
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
