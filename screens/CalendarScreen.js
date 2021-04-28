import { Calendar, Agenda } from "react-native-calendars";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
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

  useEffect(() => {
    db.collection("Users")
      .doc(userId)
      .collection("routines")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          routinesData.push(doc.data());

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

    for (let i = 0; i < 30; i++) {
      let days = new Date(year, month - 1, date + i).toDateString();
    }
  };

  const loadItems = () => {
    setTimeout(() => {
      let routinesNameThatDay = [];
      // const [numOfItems, setNumOfItems] = useState({});
      //Kanske lägga in en array med datum sen ta ut datumet till time
      for (let i = 0; i < routinesData.length; i++) {
        // const time = day.timestamp * 24 * 60 * 60 * 1000;
        const time = routinesData[i].StartTime.seconds * 1000 + 9500000;

        const strTime = timeToString(time);
        console.log(strTime);

        for (let i = 0; i < routinesData.length; i++) {
          const timeCompare =
            routinesData[i].StartTime.seconds * 1000 + 9500000;
          const strTimeCompare = timeToString(timeCompare);
          const routineNames = routinesData[i].name;

          if (strTime === strTimeCompare) {
            routinesNameThatDay.push(routineNames);
          }
        }
        console.log(routinesNameThatDay);

        if (!items[strTime]) {
          items[strTime] = [];

          for (let i = 0; i < routinesNameThatDay.length; i++) {
            //Items[strTime] = ID (keys), vilet är datum
            items[strTime].push({
              name: "Item for " + strTime + " #" + routinesNameThatDay,
              height: Math.max(50, Math.floor(Math.random() * 150)),
            });
          }
          routinesNameThatDay = [];
        }
      }

      const newItems = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  };

  const renderItem = (item) => {
    return (
      <View>
        <TouchableOpacity
          style={[styles.item, { height: item.height }]}
          onPress={() => Alert.alert(item.name, item.name)}
        >
          <Text>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Agenda
      items={items}
      loadItemsForMonth={loadItems}
      renderItem={renderItem}
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
});
export default CalendarScreen;
