import { Agenda } from "react-native-calendars";
import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Image,
} from "react-native";
import { db, auth } from "../firebase";
import colors from "../config/colors";
import { Icon } from "react-native-elements";

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

function CalendarScreen() {
  const [items, setItems] = useState({});
  const [daysDateStringsList, setDaysDateStringsList] = useState([]);
  const [times, setTimes] = useState({});
  const [routinesDataComplete, setRoutinesDataComplete] = useState([]);
  // const [routinesData, setRoutinesData] = useState([]);
  // const [routinesName, setRoutinesName] = useState([]);

  const userId = auth.currentUser.uid;

  let allRoutinesData = [];
  let allCustomRoutinesData = [];

  // data.sort(function (a, b) {
  //   return a.count - b.count || a.year - b.year;
  // });

  // const applyFurureDates = () =>{
  //   allRoutinesData =
  // };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    let allRoutinesDataComplete = [];
    db.collection("Users")
      .doc(userId)
      .collection("routines")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let id = doc.id;
          let time = JSON.parse(doc.data().routineTimes);
          for (let i = 0; i < time.length; i++) {
            if (!doc.data().removed) {
              allRoutinesData.push({
                routineName: doc.id,
                dates: "",
                isDone: doc.data().isDone,
                times: time[i],
                notes: doc.data().shortDescription,
              });
            }
          }
          // console.log(allRoutinesData);
        });
      })
      .then(() => {
        for (let i = 0; i < allRoutinesData.length; i++) {
          daysInNextThirtyDays("routines", allRoutinesData[i].routineName);
          // console.log(daysDateStringsList);

          // console.log(allRoutinesData[i]);

          for (let x = 0; x < daysDateStringsList.length; x++) {
            // allRoutinesData[i].dates.push()
            allRoutinesDataComplete.push({
              routineName: allRoutinesData[i].routineName,
              dates: daysDateStringsList[x],
              isDone: allRoutinesData[i].isDone,
              times: allRoutinesData[i].times,
              notes: allRoutinesData[i].shortDescription,
            });
          }
          // console.log(allRoutinesDataComplete);
        }
        // setRoutinesDataComplete(allRoutinesDataComplete);
      });
    // .then(() => {
    db.collection("Users")
      .doc(userId)
      .collection("customRoutines")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let id = doc.id;
          let time = JSON.parse(doc.data().routineTimes);
          for (let i = 0; i < time.length; i++) {
            if (!doc.data().removed) {
              allCustomRoutinesData.push({
                routineName: doc.id,
                dates: "",
                isDone: doc.data().isDone,
                times: time[i],
                notes: doc.data().shortDescription,
              });
            }
          }
          // console.log(allRoutinesData);
        });
      })
      .then(() => {
        for (let i = 0; i < allCustomRoutinesData.length; i++) {
          daysInNextThirtyDays(
            "customRoutines",
            allCustomRoutinesData[i].routineName
          );
          // console.log(daysDateStringsList);

          // console.log(allRoutinesData[i]);

          for (let x = 0; x < daysDateStringsList.length; x++) {
            // allRoutinesData[i].dates.push()
            allRoutinesDataComplete.push({
              routineName: allCustomRoutinesData[i].routineName,
              dates: daysDateStringsList[x],
              isDone: allCustomRoutinesData[i].isDone,
              times: allCustomRoutinesData[i].times,
              notes: allCustomRoutinesData[i].notes,
            });
          }
          // console.log(allRoutinesDataComplete);
        }
        // });
        setRoutinesDataComplete(allRoutinesDataComplete);
      });
  };

  const daysInNextThirtyDays = (routineType, routineName) => {
    // setDaysDateStringsList([]);
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();
    let day = new Date(year, month, date);

    //hämta customroutines/days från varje rutin i firestore
    db.collection("Users")
      .doc(userId)
      .collection(routineType)
      .doc(routineName)
      .get()
      .then((documentSnapshot) => {
        // setDays(JSON.parse(documentSnapshot.data().days));

        const times = JSON.parse(documentSnapshot.data().routineTimes);
        const days = JSON.parse(documentSnapshot.data().days);
        const daysCurrent = {};
        let daysDateStrings = [];

        setTimeout(() => {
          let firstDayFound = false;
          let x = 1;
          //förläng objektet så det har 30+ items
          for (let o = 0; o < 2; o++) {
            for (let i = 0; i < 7; i++) {
              if (firstDayFound) {
                daysCurrent[x] = days[i];
                // daysCurrent.push({ [x]: days[i] });
                // setDaysCurrent((prevState) => ({ ...prevState, [x]: days[i] }));
                x++;
              }
              //köra getDay så man vet vart i objektet man ska börja
              if (i === today.getDay() && !firstDayFound) {
                daysCurrent[0] = days[i];
                // daysCurrent.push({ 0: days[i] });
                // setDaysCurrent({ 0: days[i] });

                firstDayFound = true;
              }
            }
          }

          setTimeout(() => {
            //loopar igenom objektet med 30+ items nedan och kollar true/false
            for (let i = 0; i < 11; i++) {
              //kollar days boolean
              if (daysCurrent[i] === 1) {
                //lägger till flera om man har flera tider för rutinen
                for (let i = 0; i < times.length; i++) {
                  //ny array där alla de datum i dateStrings listas
                  daysDateStrings.push(day.toDateString(day));
                  // setDaysDateStrings((prevArray) => [
                  //   ...prevArray,
                  //   day.toDateString(day),
                  // ]);
                }
              }
              day.setDate(day.getDate() + 1);
            }
            setDaysDateStringsList(daysDateStrings);
            // console.log(daysDateStrings);
            // return daysDateStrings;
          }, 200);
        }, 200);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // useEffect(() => {
  //   daysInNextThirtyDays("Kaffedag");
  // }, []);
  // useEffect(() => {
  //   console.log(daysDateStringsList);
  // }, [daysDateStringsList]);

  const loadItems = () => {
    try {
      setTimeout(() => {
        console.log(routinesDataComplete);
        let routinesNameThatDay = [];
        let notesForThatDay = [];
        let routinesDoneForThatDay = [];
        let routineHoursThatDay = [];
        let routineMinutesThatDay = [];

        // for (let i = 0; i < routinestimes.length; i++) {
        //   let array = routinestimes[i];
        // !!! Så fort den kommer in i for loopen så blir det fucked !!!
        //Kanske lägga in en array med datum sen ta ut datumet till time //refereshed
        for (let i = 0; i < routinesDataComplete.length; i++) {
          // const time = day.timestamp * 24 * 60 * 60 * 1000;

          const strTime = routinesDataComplete.dates[i];

          for (let i = 0; i < routinesDataComplete.length; i++) {
            const strTimeCompare = routinesDataComplete.dates[i];
            const routineNames = routinesDataComplete[i].routineName;
            const hoursThatDay = routinesDataComplete[i].time.hours;
            const minutesThatDay = routinesDataComplete[i].time.minutes;
            const notes = routinesDataComplete[i].notes;
            const isDone = routinesDataComplete[i].isDone;

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
        setItems(newItems);
      }, 1000);
    } catch (e) {
      console.log("Något gick fel!");
    }
  };

  const renderItem = (item) => {
    // itemTimesADay = JSON.parse(documentSnapshot.data().routineTimes);

    try {
      const todayCheck = new Date().toISOString().split("T")[0];
      const itemTimeCompare = item.itemTime;
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
                      text: "Nope",
                      onPress: () => console.log("Nope Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Yes!",
                      onPress: () => checkItemDone(item.name, item),
                    },
                  ],
                  {
                    cancelable: true,
                    onDismiss: () => console.log("Dismissed"),
                  }
                )
              }
            >
              <View style={styles.box}>
                <Text style={styles.fonts}>{item.name}</Text>
                <Image
                  style={styles.image}
                  source={require("../assets/RoutinesPics/WaterDrinking.png")}
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
              <Text style={styles.fonts}>{item.name + " is done!"}</Text>

              <Icon name="checkmark" type="ionicon" color="#39B91C" />

              <Image
                style={styles.image}
                source={require("../assets/RoutinesPics/WaterDrinking.png")}
              />
            </View>
            <Text style={styles.fontsDone}>{"Good Job!"}</Text>
          </View>
        );
      } else {
        return (
          <View style={[styles.itemDone, { height: item.height }]}>
            <View style={styles.box}>
              <Text style={styles.fonts}>{item.name + " u failed"}</Text>
              <Image
                style={styles.image}
                source={require("../assets/RoutinesPics/WaterDrinking.png")}
              />
            </View>
            <Text style={styles.fontsDone}>{"Bad Boy"}</Text>
          </View>
        );
      }
    } catch (e) {
      console.log(
        "Opps, crash! Luckily OP Timo is here and you can refresh without crash :)" +
          e
      );
    }
  };

  //Behöver kanske lägga in time som parameter också om getthirtydays är implementerad
  const checkItemDone = (routineName, item) => {
    onRefresh();
    //Sätter item till annan render i logiken under loadItems
    item.ItemisDone = true;

    db.collection("Users")
      .doc(userId)
      .collection("routines")
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
    backgroundColor: "#D1D0CE",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  box: {
    flexDirection: "row",
  },
  image: {
    flex: 1,
    width: 100,
    height: 130,
    position: "absolute",
    marginLeft: 190,
    top: -40,
  },
  fonts: {
    fontSize: 15,
    fontFamily: "Roboto",
    color: "black",
    marginTop: 5,
    marginRight: 3,
  },
  fontsDone: {
    fontSize: 20,
    fontFamily: "Roboto",
    fontStyle: "italic",
    color: "black",
    marginTop: 6,
  },
  timeSheet: {
    marginTop: 4,
  },
});
export default CalendarScreen;
