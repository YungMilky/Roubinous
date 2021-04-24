// import { Calendar, CalendarList, Agenda } from "react-native-calendars";
// import React, { useState } from "react";
// import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
// import { db, auth } from "../firebase";

import React from "react";
import { View, Text } from "react-native";

function CalendarScreen(props) {
  return (
    <View>
      <Text>Hi</Text>
    </View>
  );
}

export default CalendarScreen;

// const timeToString = (time) => {
//   const date = new Date(time);
//   return date.toISOString().split("T")[0];
// };

// function CalendarScreen(props) {
//   const [items, setItems] = useState({});
//   const [refresh, setRefresh] = useState();

//   const userId = auth.currentUser.uid;
//   console.log(userId);

//   let routinesData = [];

//   db.collection("Users")
//     .doc(userId)
//     .collection("routines")
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         routinesData.push(doc.data());
//         // routinesStartDate = doc.data().timestamp.toDate();
//         // console.log(doc.id, " => ", doc.data());

//         // setStartDate(new Date( * 1000));

//         console.log(routinesData);
//       });
//     });

//   const loadItems = () => {
//     setTimeout(() => {
//       //Kanske lägga in en array med datum sen ta ut datumet till time
//       for (let i = 0; i < routinesData.length; i++) {
//         // const time = day.timestamp + i * 24 * 60 * 60 * 1000;
//         const time = routinesData[i].StartTime.seconds * 1000;
//         console.log(time);
//         // console.log(day.timestamp + i * 24 * 60 * 60 * 1000);
//         // console.log(day);
//         const strTime = timeToString(time);
//         console.log(strTime);

//         if (!items[strTime]) {
//           items[strTime] = [];
//           // const numItems = Math.floor(Math.random() * 3 + 1);
//           const numItems = 1;
//           //Letar igenom antal items för dagen
//           for (let j = 0; j <= numItems; j++) {
//             //Items[strTime] = ID (keys), vilet är datum
//             items[strTime].push({
//               name: "Item for " + strTime + " #" + j,
//               height: Math.max(50, Math.floor(Math.random() * 150)),
//             });
//           }
//         }
//       }

//       setTimeout(() => {
//         console.log("refreshed");
//         setRefresh(true);
//       }, 5000);

//       const newItems = {};
//       Object.keys(items).forEach((key) => {
//         newItems[key] = items[key];
//       });
//       setItems(newItems);
//       console.log(items);
//     }, 1000);
//   };
//   // const renderItem = (item) => {
//   //   return (
//   //     <View>
//   //       <TouchableOpacity
//   //         style={[styles.item, { height: item.height }]}
//   //         onPress={() => Alert.alert(item.name, item.name)}
//   //       >
//   //         <Text>{item.name}</Text>
//   //       </TouchableOpacity>
//   //     </View>
//   //   );
//   // };
//   return (
//     <Agenda
//       items={items}
//       loadItemsForMonth={loadItems}
//       renderItem={(item) => {
//         <View>
//           <TouchableOpacity
//             style={[styles.item, { height: item.height }]}
//             onPress={() => Alert.alert(item.name, item.name)}
//           >
//             <Text>{item.name}</Text>
//           </TouchableOpacity>
//         </View>;
//       }}
//       refreshing={refresh}
//     />
//   );
// }
// const styles = StyleSheet.create({
//   item: {
//     backgroundColor: "white",
//     flex: 1,
//     borderRadius: 5,
//     padding: 10,
//     marginRight: 10,
//     marginTop: 17,
//   },
// });
// export default CalendarScreen;
