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

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

function CalendarScreen() {
  const [items, setItems] = useState({});
  const [daysDateStringsList, setDaysDateStringsList] = useState([]);
  const [times, setTimes] = useState({});
  // const [routinesData, setRoutinesData] = useState([]);
  // const [routinesName, setRoutinesName] = useState([]);

  const userId = auth.currentUser.uid;

  let routinesData = [];
  let routinesName = [];
  useEffect(() => {
    getItems();
  }, []);

  // useEffect(() => {
  //   db.collection("Users")
  //     .doc(userId)
  //     .collection("routines")
  //     .get()
  //     .then((querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         if (!doc.removed) {
  //           routinesData.push(doc.data());
  //           routinesName.push(doc.id);

  //           setRoutinesData((prevState) => [...prevState, doc.data()]);
  //           setRoutinesName((prevArray) => [...prevArray, doc.id]);
  //         }
  //       });
  //     });
  // }, []);
  const daysInNextThirtyDays = (routineTime, routineName) => {
    // setDaysDateStringsList([]);
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();
    let day = new Date(year, month, date);

    //hämta customroutines/days från varje rutin i firestore
    db.collection("Users")
      .doc(userId)
      .collection(routineTime)
      .doc(routineName)
      .get()
      .then((documentSnapshot) => {
        // setDays(JSON.parse(documentSnapshot.data().days));
        // console.log(JSON.parse(documentSnapshot.data().days));

        const times = JSON.parse(documentSnapshot.data().routineTimes);
        const days = JSON.parse(documentSnapshot.data().days);
        const daysCurrent = {};
        const daysDateStrings = [];
        // console.log(times);

        setTimeout(() => {
          let firstDayFound = false;
          let x = 1;
          //förläng objektet så det har 30+ items
          for (let o = 0; o < 6; o++) {
            // console.log('loop 1 ' + o);
            for (let i = 0; i < 7; i++) {
              // console.log('loop 2 ' + i);
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
                // console.log('dgaga ', days);
                // console.log('hej');
                firstDayFound = true;
              }
            }
          }
          // console.log('current day: ' + today.getDay());
          // console.log(daysCurrent);
          setTimeout(() => {
            // console.log(daysCurrent);
            //loopar igenom objektet med 30+ items nedan och kollar true/false
            for (let i = 0; i < 31; i++) {
              //kollar days boolean
              if (daysCurrent[i] === 1) {
                //lägger till flera om man har flera tider för rutinen
                for (let i = 0; i < times.length; i++) {
                  // console.log(day.toDateString(day));

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
  useEffect(() => {
    console.log(daysDateStringsList);
  }, [daysDateStringsList]);

  const loadItems = () => {
    try {
      setTimeout(() => {
        let routinesNameThatDay = [];
        let notesForThatDay = [];
        let routinesDoneForThatDay = [];

        // !!! Så fort den kommer in i for loopen så blir det fucked !!!
        //Kanske lägga in en array med datum sen ta ut datumet till time
        for (let i = 0; i < routinesData.length; i++) {
          // const time = day.timestamp * 24 * 60 * 60 * 1000;
          const time = routinesData[i].StartDate.seconds * 1000 + 9500000;

          const strTime = timeToString(time);

          for (let i = 0; i < routinesData.length; i++) {
            const timeCompare =
              routinesData[i].StartDate.seconds * 1000 + 9500000;
            const strTimeCompare = timeToString(timeCompare);
            const routineNames = routinesName[i];
            const notes = routinesData[i].notes;
            const isDone = routinesData[i].isDone;

            if (strTime === strTimeCompare) {
              routinesNameThatDay.push(routineNames);
              notesForThatDay.push(notes);
              routinesDoneForThatDay.push(isDone);
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
                height: 100,
                // height: Math.max(50, Math.floor(Math.random() * 150)),
              });
              // console.log(routinesDoneForThatDay[i]);
            }
          }
          routinesNameThatDay = [];
          notesForThatDay = [];
          routinesDoneForThatDay = [];
        }

        // console.log("hej" + items);

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
    try {
      if (!item.ItemisDone) {
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
          </TouchableOpacity>
        );
      } else if (item.ItemisDone) {
        return (
          <View style={[styles.item, { height: item.height }]}>
            <View style={styles.box}>
              <Text style={styles.fonts}>{item.name + " is done!"}</Text>

              <Image
                style={styles.image}
                source={require("../assets/RoutinesPics/WaterDrinking.png")}
              />
            </View>
          </View>
        );
      }
    } catch (e) {
      console.log(
        "Opps, crash! Luckily OP Timo is here and you can refresh without crash :)"
      );
    }
  };

  //Behöver kanske lägga in time som parameter också om getthirtydays är implementerad
  const checkItemDone = (routineName, item) => {
    onRefresh();

    item.ItemisDone = true;

    db.collection("Users")
      .doc(userId)
      .collection("routines")
      .doc(routineName)
      .update({
        isDone: true,
      });
    // setItems({});
    routinesData = [];
    getItems();
    loadItems();
    renderItem();
    // setTimeout(() => {
    //   renderItem();
    // }, 3000);
  };

  const getItems = () => {
    db.collection("Users")
      .doc(userId)
      .collection("routines")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (!doc.removed) {
            routinesData.push(doc.data());
            routinesName.push(doc.id);
          }
        });
      });
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
    backgroundColor: "white",
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
  },
});
export default CalendarScreen;
