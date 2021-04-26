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
  let numOfRoutines = [];

  useEffect(() => {
    db.collection("Users")
      .doc(userId)
      .collection("routines")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          routinesData.push(doc.data());
          numOfRoutines.push(doc.id);

          // routinesStartDate = doc.data().timestamp.toDate();

          // setStartDate(new Date( * 1000));

          // console.log(routinesData);
        });
      });
  }, []);

  const loadItems = () => {
    setTimeout(() => {
      //Kanske lägga in en array med datum sen ta ut datumet till time
      for (let i = 0; i < routinesData.length; i++) {
        // const time = day.timestamp * 24 * 60 * 60 * 1000;
        const time = routinesData[i].StartTime.seconds * 1000 + 9500000;
        const routineName = routinesData[i].name;
        console.log("R name: " + routineName);
        // StartTime.seconds * 1000 + 86400;

        const strTime = timeToString(time);
        console.log(strTime);
        if (!items[strTime]) {
          items[strTime] = [];
          // const numItems = Math.floor(Math.random() * 3 + 1);
          // const numItems = 1;

          //Letar igenom antal items för dagen
          // for (let j = 0; j <= numOfRoutines.length; j++) {
          //Items[strTime] = ID (keys), vilet är datum
          items[strTime].push({
            name: "Item for " + strTime + " #" + routineName,
            height: Math.max(50, Math.floor(Math.random() * 150)),
          });
          // }
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
