import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
} from "react-native";
import { FlatList } from "react-native";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import RoutineItems from "../components/RoutineItems";
import Screen from "../components/Screen";
import Separator from "../components/Separator";
import colors from "../config/colors";
import AppText from "../components/AppText";
import { db, auth, storage, cloud } from "../firebase";

import { LinearGradient } from "expo-linear-gradient";

import { SharedElement } from "react-navigation-shared-element";

import * as Animatable from "react-native-animatable";

const DURATION = 400;

const { width, height } = Dimensions.get("screen");

const ITEM_HEIGHT = height * 0.18;

function RoutinesScreen({ navigation }) {
  const user = auth.currentUser;
  const [userRankNumber, setuserRankNumber] = useState();
  // var userRank;
  const [items, setItems] = useState([]);

  useEffect(() => {
    db.collection("Routines").onSnapshot((docs) => {
      docs.forEach((doc) => {
        let imageRef = cloud.ref(doc.id + ".png");
        imageRef.getDownloadURL().then(onResolve, onReject);

        function onResolve() {
          imageRef.getDownloadURL().then((url) => {
            setItems((oldArray) => [
              ...oldArray,
              {
                id: 1,
                title: doc.id,
                shortDescription: doc.data().ShortDescription,
                descriptionArray: doc.data().LongDescription,
                difficulty: doc.data().DifficultyRank,
                userLevelReq: "Lv 2",
                image: url,
                color: doc.data().Color,
              },
            ]);
          });
        }
        function onReject() {
          imageRef.getDownloadURL().then((url) => {
            setItems((oldArray) => [
              ...oldArray,
              {
                id: 1,
                title: doc.id,
                shortDescription: doc.data().ShortDescription,
                descriptionArray: doc.data().LongDescription,
                difficulty: doc.data().DifficultyRank,
                userLevelReq: "Lv 2",
                image: require("../assets/RoutinesPics/default.png"),
                color: doc.data().Color,
              },
            ]);
          });
        }
      });
    });
  }, []);

  const getUserInfo = () => {
    db.collection("Users")
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        setuserRankNumber(documentSnapshot.get("UserRank"));
      });
  };
  getUserInfo();

  const getUserRank = () => {
    if (userRankNumber > 10) {
      return <AppText style={styles.levelText}>Pro</AppText>;
    }
    if (userRankNumber < 10) {
      return <AppText style={styles.levelText}>Amature</AppText>;
    }
  };
  // if (userRankNumber > 10) {
  //   var userRank = "Pro";
  // } else if (userRankNumber < 10) {
  //   var userRank = "Amature";
  // }

  return (
    <Screen>
      <ScrollView>
        <View style={styles.max}>
          <View style={styles.container}>{getUserRank()}</View>
          {/* <View style={styles.container}>
            <AppText style={styles.levelText}>{userRank}</AppText>
          </View> */}
          <View style={styles.container}>
            <AppText style={styles.levelText}>Level 1</AppText>
          </View>
          <FlatList
            data={items}
            keyExtractor={(items) => items.id.toString()}
            renderItem={({ item }) => (
              // <RoutineItems
              //   title={item.title}
              //   shortDescription={item.shortDescription}
              //   image={item.image}
              //   userLevelReq={item.userLevelReq}
              //   item={item}
              //   onPressOut={() => navigation.navigate("Routine", { item })}
              // />
              <View
                style={{
                  backgroundColor: item.color,
                  padding: 2,
                  marginBottom: 8,
                  marginHorizontal: 10,
                  width: width * 0.95,
                  borderRadius: 5,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.18,
                  shadowRadius: 1.0,

                  elevation: 1,
                }}
              >
                <TouchableHighlight
                  delayPressIn={200}
                  activeOpacity={0.9}
                  underlayColor={colors.white}
                  onPressOut={() => navigation.navigate("Routine", { item })}
                >
                  <Animatable.View
                    style={{ flex: 1, padding: 20 }}
                    animation="bounceIn"
                    delay={420}
                  >
                    <SharedElement
                      id={`item.${item.id}.color`}
                      style={[
                        StyleSheet.absoluteFillObject,
                        { backgroundColor: item.color },
                      ]}
                    >
                      <LinearGradient
                        colors={[
                          colors.OrchidPink,
                          colors.darkmodeDisabledWhite,
                          colors.yungBlue,
                        ]}
                        style={itemStyles.background}
                        start={{ x: 5, y: 0.01 }}
                        end={{ x: 0.1, y: 0.3 }}
                        // locations={[0.4, 0.1]}
                      ></LinearGradient>
                    </SharedElement>
                    <View style={itemStyles.container}>
                      <SharedElement
                        id={`item.${item.id}.image`}
                        style={itemStyles.image}
                      >
                        <Image
                          style={itemStyles.image}
                          source={{ uri: item.image }}
                        />
                      </SharedElement>
                      <View>
                        <SharedElement id={`item.${item.id}.title`}>
                          <AppText style={itemStyles.title}>
                            {item.title}
                          </AppText>
                        </SharedElement>
                        <AppText style={itemStyles.subtitle}>
                          {item.shortDescription}
                        </AppText>
                        <AppText style={itemStyles.userLevelReq}>
                          {item.userLevelReq}
                        </AppText>
                      </View>
                    </View>
                  </Animatable.View>
                </TouchableHighlight>
              </View>
            )}
            // ItemSeparatorComponent={Separator}
          />
          <View style={styles.container}>
            <AppText style={styles.levelText}>Level 2</AppText>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 45,
    padding: 10,
    backgroundColor: colors.samRed,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
  },
  levelText: {
    textAlign: "center",
    fontSize: 20,
  },
  max: {
    display: "flex",
    flex: 1,
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
  },
  description: {
    fontSize: 11,
  },
  image: {
    resizeMode: "contain",
    position: "absolute",
    bottom: 0,
    right: 20,
  },
});

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
  },
  image: {
    width: ITEM_HEIGHT * 0.61,
    height: ITEM_HEIGHT * 0.8,
    marginRight: 10,
  },
  title: {
    color: colors.darkmodeHighWhite,
    marginLeft: 5,
    fontSize: 28,
    marginTop: 4,
  },
  subtitle: {
    color: colors.darkmodeMediumWhite,
    fontSize: 15,
    marginLeft: 5,
  },
  userLevelReq: {
    fontSize: 15,
    marginLeft: 7,
    marginTop: 18,
    color: colors.samGreen,
  },
});

export default RoutinesScreen;
