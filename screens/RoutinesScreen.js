import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import RoutineItems from "../components/RoutineItems";
import Screen from "../components/Screen";
import Separator from "../components/Separator";

const items = [
  {
    id: 1,
    title: "Hydration",
    description: "Water is good",
    image: require("../assets/RoutinesPics/water.jpg"),
  },
  {
    id: 2,
    title: "Yoga",
    description: "Yoga is good",
    image: require("../assets/RoutinesPics/yoga.jpg"),
  },
  {
    id: 3,
    title: "Workout",
    description: "Workout is good",
    image: require("../assets/RoutinesPics/weights.jpg"),
  },
  {
    id: 4,
    title: "Eat Breakfast",
    description: "Eat is good",
    image: require("../assets/RoutinesPics/breakfast.jpg"),
    //Customise icons??? Mosh 11,12 Lists
  },
  {
    id: 5,
    title: "Workout",
    description: "Workout is good",
    image: require("../assets/RoutinesPics/weights.jpg"),
  },
  {
    id: 6,
    title: "Workout",
    description: "Workout is good",
    image: require("../assets/RoutinesPics/weights.jpg"),
  },
  {
    id: 7,
    title: "Workout",
    description: "Workout is good",
    image: require("../assets/RoutinesPics/weights.jpg"),
  },
];

function RoutinesScreen() {
  return (
    <ScrollView>
      <FlatList
        data={items}
        keyExtractor={(items) => items.id.toString()}
        renderItem={({ item }) => (
          <RoutineItems
            title={item.title}
            subtitle={item.description}
            image={item.image}
            onPressOut={() => console.log("Selected", item)}
          />
        )}
        ItemSeparatorComponent={Separator}
      />
    </ScrollView>

    //     <Screen>
    //       <TouchableOpacity>
    //         <View style={styles.margin}>
    //           <RoutineItems
    //             image={require("../assets/RoutinesPics/water.jpg")}
    //             title="Hydration"
    //             subtitle="Drinking water is good"
    //           />
    //         </View>
    //       </TouchableOpacity>

    //       <TouchableOpacity>
    //         <View style={styles.margin}>
    //           <RoutineItems
    //             image={require("../assets/RoutinesPics/yoga.jpg")}
    //             title="Meditation"
    //             subtitle="Meditaion is good"
    //           />
    //         </View>
    //       </TouchableOpacity>

    //       <TouchableOpacity>
    //         <View style={styles.margin}>
    //           <RoutineItems
    //             image={require("../assets/RoutinesPics/weights.jpg")}
    //             title="Workout"
    //             subtitle="workout is good"
    //           />
    //         </View>
    //       </TouchableOpacity>
    //     </Screen>
    //   );
    // }

    // const styles = StyleSheet.create({
    //   margin: {
    //     marginBottom: 30,
    //     marginLeft: 10,
    //   },
    // });
  );
}

export default RoutinesScreen;
