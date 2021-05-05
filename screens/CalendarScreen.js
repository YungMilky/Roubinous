import { Agenda } from "react-native-calendars";
import React, { useEffect, useState } from "react";
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

function CalendarScreen(props) {
  const [items, setItems] = useState({});
  const userId = auth.currentUser.uid;

  console.log(userId);

  let routinesData = [];
  let routinesName = [];
  useEffect(() => {
    db.collection("Users")
      .doc(userId)
      .collection("routines")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          routinesData.push(doc.data());
          routinesName.push(doc.id);

          // routinesStartDate = doc.data().timestamp.toDate();

          // setStartDate(new Date( * 1000));

          // console.log(routinesData);
        });
      });
  }, []);

  const daysInNextThirtyDays = () => {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();

    var daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    //hämta customroutines/days från varje rutin i firestore
    //köra getDay så man vet vart i objektet man ska börja
    //förläng objektet så det har 30+ items
    //sen loopa igenom objektet med 30+ items i loopen nedan och kolla true/false
    //ny array där man listar alla de datum i dateISOstring

    //borde också hämta tiderna för rutinen och köra flera items för samma datum fast med olika tider

    for (let i = 0; i < 30; i++) {
      const days = [];
      let day = new Date(year, month - 1, date + i).toDateString();
      // if () { //kolla days boolean
      //   //lägg till day i days
      // }
    }
  };

  const loadItems = () => {
    setTimeout(() => {
      let routinesNameThatDay = [];
      let notesForThatDay = [];
      console.log(routinesData);
      console.log(routinesName);

      // const [numOfItems, setNumOfItems] = useState({});
      //Kanske lägga in en array med datum sen ta ut datumet till time
      for (let i = 0; i < routinesData.length; i++) {
        // const time = day.timestamp * 24 * 60 * 60 * 1000;
        const time = routinesData[i].StartTime.seconds * 1000 + 9500000;

        const strTime = timeToString(time);

        for (let i = 0; i < routinesData.length; i++) {
          const timeCompare =
            routinesData[i].StartTime.seconds * 1000 + 9500000;
          const strTimeCompare = timeToString(timeCompare);
          const routineNames = routinesName[i];
          const notes = routinesData[i].notes;

          if (strTime === strTimeCompare) {
            routinesNameThatDay.push(routineNames);
            notesForThatDay.push(notes);
          }
        }

        if (!items[strTime]) {
          items[strTime] = [];

          for (let i = 0; i < routinesNameThatDay.length; i++) {
            //Items[strTime] = ID (keys), vilet är datum
            items[strTime].push({
              name: routinesNameThatDay[i],
              dayNotes: notesForThatDay[i],
              height: 100,
              // height: Math.max(50, Math.floor(Math.random() * 150)),
            });
          }

          routinesNameThatDay = [];
          notesForThatDay = [];
        }
      }
      console.log(notesForThatDay);

      const newItems = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  };

  const renderItem = (item) => {
    let itemNameForThatDay = item.name;
    let itemNotesForThatDay = item.dayNotes;
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
                onPress: () =>
                  console.log(
                    "Yes Pressed. " +
                      itemNameForThatDay +
                      " " +
                      itemNotesForThatDay
                  ),
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
  };

  return (
    <Agenda
      items={items}
      loadItemsForMonth={loadItems}
      renderItem={renderItem}
      minDate={new Date() - 1}
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
