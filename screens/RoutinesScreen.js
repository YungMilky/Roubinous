import { db, auth, cloud } from "../firebase";

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  FlatList,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";

import { SearchBar } from "react-native-elements";

import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";

import { LinearGradient } from "expo-linear-gradient";

import { SharedElement } from "react-navigation-shared-element";

import * as Animatable from "react-native-animatable";

import { AntDesign } from "@expo/vector-icons";

import Screen from "../components/Screen";
import Separator from "../components/Separator";
import AppText from "../components/AppText";
import Tag from "../components/Tag";
import colors from "../config/colors";
import AppButton from "../components/AppButton";

// RN >= 0.63
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Warning: ...", "Setting a timer"]);

const { width, height } = Dimensions.get("screen");
const ITEM_HEIGHT = height * 0.18;

const getItemLayout = (data, index) => ({
  length: height * 0.14,
  offset: height * 0.14 * index,
  index,
});

function RoutinesScreen({ navigation }) {
  const user = auth.currentUser;
  const dbUser = db.collection("Users").doc(user.uid);
  console.log(user.uid);

  const rank1 = "kn00b";
  const rank2 = "Achiever";
  const rank3 = "Bambaclat";

  const [userRank, setuserRank] = useState(rank1);
  const [items, setItems] = useState([]);
  const [lockedItems, setLockedItems] = useState([]);
  const [alreadyAddeditems, setAlreadyAddedItems] = useState([]);
  const [search, setSearch] = useState();
  const [refresh, setRefresh] = useState(false);

  const isFocused = useIsFocused();
  useEffect(() => {
    listItems();
  }, [isFocused]);

  function listItems() {
    //  reset item arrays to prevent
    //  double loading on back navigation
    setItems([]);
    setAlreadyAddedItems([]);
    setLockedItems([]);
    // resetItems;
    db.collection("Routines").onSnapshot((docs) => {
      let index = 0;
      docs.forEach((doc) => {
        let routineName = doc.id;

        //routine image from storage
        let imageRef = cloud.ref(routineName + ".png");

        //set default difficulty to 0
        let diff = doc.data().DifficultyRank;
        if (typeof diff === "undefined") {
          diff = 0;
        }

        // lock routine based on routine difficulty and user rank
        let lock = true;
        if (userRank === rank1 && diff <= 1) {
          lock = false;
        } else if (userRank === rank2 && diff <= 2) {
          lock = false;
        } else if (userRank === rank3 && diff <= 3) {
          lock = false;
        }

        function onResolve() {
          if (!alreadyAdded && !lock) {
            imageRef.getDownloadURL().then((url) => {
              setItems((oldArray1) => [
                ...oldArray1,
                {
                  id: index,
                  title: routineName,
                  shortDescription: doc.data().ShortDescription,
                  descriptionArray: doc.data().LongDescription,
                  color: doc.data().Color,
                  difficulty: diff,
                  image: url,
                  lock: lock,
                  alreadyAdded: alreadyAdded,
                },
              ]);
            });
          } else if (!alreadyAdded && lock) {
            imageRef.getDownloadURL().then((url) => {
              setLockedItems((oldArray2) => [
                ...oldArray2,
                {
                  id: index,
                  title: routineName,
                  shortDescription: doc.data().ShortDescription,
                  descriptionArray: doc.data().LongDescription,
                  color: doc.data().Color,
                  difficulty: diff,
                  image: url,
                  lock: lock,
                  alreadyAdded: alreadyAdded,
                },
              ]);
            });
          } else if (alreadyAdded) {
            imageRef.getDownloadURL().then((url) => {
              setAlreadyAddedItems((oldArray3) => [
                ...oldArray3,
                {
                  id: index,
                  title: routineName,
                  shortDescription: doc.data().ShortDescription,
                  descriptionArray: doc.data().LongDescription,
                  color: doc.data().Color,
                  difficulty: diff,
                  image: url,
                  lock: lock,
                  alreadyAdded: alreadyAdded,
                },
              ]);
            });
          }
          index++;
        }
        function onReject() {
          if (!alreadyAdded && !lock) {
            setItems((oldArray1) => [
              ...oldArray1,
              {
                id: index,
                title: routineName,
                shortDescription: doc.data().ShortDescription,
                descriptionArray: doc.data().LongDescription,
                color: doc.data().Color,
                difficulty: diff,
                imageDefault: require("../assets/RoutinesPics/default.png"),
                lock: lock,
                alreadyAdded: alreadyAdded,
              },
            ]);
          } else if (lock) {
            setLockedItems((oldArray2) => [
              ...oldArray2,
              {
                id: index,
                title: routineName,
                shortDescription: doc.data().ShortDescription,
                descriptionArray: doc.data().LongDescription,
                color: doc.data().Color,
                difficulty: diff,
                imageDefault: require("../assets/RoutinesPics/default.png"),
                lock: lock,
                alreadyAdded: alreadyAdded,
              },
            ]);
          } else if (alreadyAdded) {
            setAlreadyAddedItems((oldArray3) => [
              ...oldArray3,
              {
                id: index,
                title: routineName,
                shortDescription: doc.data().ShortDescription,
                descriptionArray: doc.data().LongDescription,
                color: doc.data().Color,
                difficulty: diff,
                imageDefault: require("../assets/RoutinesPics/default.png"),
                lock: lock,
                alreadyAdded: alreadyAdded,
              },
            ]);
          }
          index++;
        }

        let alreadyAdded = undefined;
        dbUser
          .collection("routines")
          .doc(routineName)
          .get()
          .then((documentSnapshot) => {
            documentSnapshot.exists
              ? (alreadyAdded = true)
              : (alreadyAdded = false);
            imageRef.getDownloadURL().then(onResolve, onReject);
          });
      });
    });
  }

  dbUser.get().then((documentSnapshot) => {
    let userRank = documentSnapshot.get("UserRank");
    let translatedUserRank = "Unranked";
    if (userRank >= "0" && userRank < "10") {
      translatedUserRank = rank1;
    } else if (userRank >= "10" && userRank < "20") {
      translatedUserRank = rank2;
    } else if (userRank >= "20" && userRank <= "30") {
      translatedUserRank = rank3;
    }
    setuserRank(translatedUserRank);
  });

  let renderItems = ({ item }) => {
    return (
      <Animatable.View
        animation="fadeIn"
        useNativeDriver={true}
        style={{
          padding: 3,
          marginBottom: 8,
          marginHorizontal: 10,
          width: width * 0.89,
          borderRadius: 5,
          elevation: -8,
        }}
      >
        <TouchableHighlight
          delayPressIn={200}
          activeOpacity={0.9}
          underlayColor={colors.white}
          onPressOut={() => navigation.navigate("Routine", { item })}
        >
          <SharedElement
            id={`item.${item.id}.color`}
            // style={[
            //   StyleSheet.absoluteFillObject,
            //   { backgroundColor: item.color },
            // ]}
          >
            <LinearGradient
              colors={[
                colors.OrchidPink,
                colors.darkmodeMediumWhite,
                item.color,
              ]}
              style={itemStyles.background}
              start={{ x: 5, y: 0.01 }}
              end={{ x: 0.1, y: 0.3 }}
              // locations={[0.4, 0.1]}
            >
              <View style={itemStyles.container}>
                <SharedElement
                  id={`item.${item.id}.image`}
                  style={itemStyles.image}
                >
                  {item.image ? (
                    <Image
                      style={itemStyles.image}
                      source={{ uri: item.image }}
                    />
                  ) : (
                    <Image
                      style={itemStyles.imageDefault}
                      source={item.imageDefault}
                    />
                  )}
                </SharedElement>

                <View>
                  {/* <SharedElement id={`item.${item.id}.title`}> */}
                  <AppText style={itemStyles.title}>{item.title}</AppText>
                  {/* </SharedElement> */}
                  <AppText style={itemStyles.subtitle}>
                    {item.shortDescription}
                  </AppText>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      position: "absolute",
                      width: 90,
                      top: 60,
                      left: width * 0.23,
                    }}
                  >
                    {item.lock && <Tag lock={true} />}
                    <Tag difficulty={item.difficulty} />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </SharedElement>
        </TouchableHighlight>
      </Animatable.View>
    );
  };
  let renderLockedItems = ({ item }) => {
    return (
      <Animatable.View
        animation="fadeIn"
        useNativeDriver={true}
        style={{
          padding: 3,
          marginBottom: 8,
          marginHorizontal: 10,
          width: width * 0.89,
          borderRadius: 5,
          elevation: -8,
        }}
      >
        <TouchableHighlight
          delayPressIn={200}
          activeOpacity={0.9}
          underlayColor={colors.white}
          onPressOut={() => navigation.navigate("Routine", { item })}
        >
          <SharedElement
            id={`item.${item.id}.color`}
            // style={[
            //   StyleSheet.absoluteFillObject,
            //   { backgroundColor: item.color },
            // ]}
          >
            <LinearGradient
              colors={[
                colors.OrchidPink,
                colors.darkmodeMediumWhite,
                item.color,
              ]}
              style={itemStyles.background}
              start={{ x: 5, y: 0.01 }}
              end={{ x: 0.1, y: 0.3 }}
              // locations={[0.4, 0.1]}
            >
              <View style={itemStyles.container}>
                <SharedElement
                  id={`item.${item.id}.image`}
                  style={itemStyles.image}
                >
                  {item.image ? (
                    <Image
                      style={itemStyles.image}
                      source={{ uri: item.image }}
                    />
                  ) : (
                    <Image
                      style={itemStyles.imageDefault}
                      source={item.imageDefault}
                    />
                  )}
                </SharedElement>

                <View>
                  {/* <SharedElement id={`item.${item.id}.title`}> */}
                  <AppText style={itemStyles.title}>{item.title}</AppText>
                  {/* </SharedElement> */}
                  <AppText style={itemStyles.subtitle}>
                    {item.shortDescription}
                  </AppText>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      position: "absolute",
                      width: 90,
                      top: 60,
                      left: width * 0.23,
                    }}
                  >
                    <Tag lock={true} />
                    <Tag difficulty={item.difficulty} />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </SharedElement>
        </TouchableHighlight>
      </Animatable.View>
    );
  };
  let renderAlreadyAddedItems = ({ item }) => {
    return (
      <Animatable.View
        animation="fadeIn"
        useNativeDriver={true}
        style={{
          padding: 3,
          marginBottom: 8,
          marginHorizontal: 10,
          width: width * 0.89,
          borderRadius: 5,
          elevation: -8,
        }}
      >
        <TouchableHighlight
          delayPressIn={200}
          activeOpacity={0.9}
          underlayColor={colors.white}
          onPressOut={() => navigation.navigate("Routine", { item })}
        >
          <SharedElement
            id={`item.${item.id}.color`}
            // style={[
            //   StyleSheet.absoluteFillObject,
            //   { backgroundColor: item.color },
            // ]}
          >
            <LinearGradient
              colors={[
                colors.OrchidPink,
                colors.darkmodeMediumWhite,
                item.color,
              ]}
              style={itemStyles.background}
              start={{ x: 5, y: 0.01 }}
              end={{ x: 0.1, y: 0.3 }}
              // locations={[0.4, 0.1]}
            >
              <View style={itemStyles.container}>
                <SharedElement
                  id={`item.${item.id}.image`}
                  style={itemStyles.image}
                >
                  {item.image ? (
                    <Image
                      style={itemStyles.image}
                      source={{ uri: item.image }}
                    />
                  ) : (
                    <Image
                      style={itemStyles.imageDefault}
                      source={item.imageDefault}
                    />
                  )}
                </SharedElement>

                <View>
                  <SharedElement id={`item.${item.id}.title`}>
                    <AppText style={itemStyles.title}>{item.title}</AppText>
                  </SharedElement>
                  <AppText style={itemStyles.subtitle}>
                    {item.shortDescription}
                  </AppText>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      position: "absolute",
                      width: 90,
                      top: 60,
                      left: width * 0.23,
                    }}
                  >
                    <Tag difficulty={item.difficulty} />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </SharedElement>
          {/* </View> */}
        </TouchableHighlight>
      </Animatable.View>
    );
  };

  return (
    <Screen style={{ backgroundColor: colors.darkmodeBlack, marginTop: -12 }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: height * 0.81,
        }}
      >
        <ScrollView
          style={{
            backgroundColor: colors.darkmodeFocused,
            borderRadius: 16,
            width: width * 0.94,
            height: height * 0.77,
          }}
        >
          <View style={{ alignItems: "center", paddingTop: 2 }}>
            <SearchBar
              placeholder="Search routines..."
              onChangeText={setSearch}
              value={search}
              containerStyle={{
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                backgroundColor: "rgba(0,0,0,0.0)",
                width: width * 0.92,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                height: 50,
              }}
              inputContainerStyle={{
                borderRadius: 15,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                height: 34,
              }}
            />
          </View>

          <FlatList
            getItemLayout={getItemLayout}
            initialNumToRender={items.length}
            data={items.sort(function (a, b) {
              return a.difficulty - b.difficulty;
            })}
            keyExtractor={(items) => items.id.toString()}
            extraData={refresh}
            renderItem={renderItems}
          />

          {lockedItems.length ? (
            <View>
              <View
                style={{
                  width: "80%",
                  display: "flex",
                  justifyContent: "center",
                }}
              ></View>
              <View
                style={{
                  flexDirection: "row",
                  paddingBottom: 12,
                  paddingTop: 1,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.darkmodeDisabledBlack,
                    height: 2,
                    flex: 1,
                    alignSelf: "center",
                  }}
                />
                <Text style={styles.separatorText}>Locked routines</Text>
                <View
                  style={{
                    backgroundColor: colors.darkmodeDisabledBlack,
                    height: 2,
                    flex: 1,
                    alignSelf: "center",
                  }}
                />
              </View>
            </View>
          ) : null}

          <FlatList
            getItemLayout={getItemLayout}
            initialNumToRender={lockedItems.length}
            data={lockedItems.sort(function (a, b) {
              return a.difficulty - b.difficulty;
            })}
            keyExtractor={(lockedItems) => lockedItems.id.toString()}
            renderItem={renderLockedItems}
          />

          {alreadyAddeditems.length ? (
            <View>
              <View
                style={{
                  width: "80%",
                  display: "flex",
                  justifyContent: "center",
                }}
              ></View>
              <View
                style={{
                  flexDirection: "row",
                  paddingBottom: 12,
                  paddingTop: 1,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.darkmodeDisabledBlack,
                    height: 2,
                    flex: 1,
                    alignSelf: "center",
                  }}
                />
                <Text style={styles.separatorText}>Ongoing routines</Text>
                <View
                  style={{
                    backgroundColor: colors.darkmodeDisabledBlack,
                    height: 2,
                    flex: 1,
                    alignSelf: "center",
                  }}
                />
              </View>
              <View></View>
            </View>
          ) : null}

          <FlatList
            getItemLayout={getItemLayout}
            initialNumToRender={alreadyAddeditems.length}
            data={alreadyAddeditems.sort(function (a, b) {
              return a.difficulty - b.difficulty;
            })}
            keyExtractor={(alreadyAddeditems) =>
              alreadyAddeditems.id.toString()
            }
            extraData={refresh}
            renderItem={renderAlreadyAddedItems}
          />

          <TouchableHighlight
            activeOpacity={0.9}
            underlayColor={colors.white}
            onPressOut={() => console.log("bla")}
          >
            <View style={itemStyles.makeYourOwnRoutine}>
              <AppText style={itemStyles.makeYourOwnRoutineText}>
                Make your own routine
              </AppText>
              <View style={itemStyles.makeYourOwnRoutinePlus}>
                <AntDesign
                  name="plus"
                  size={28}
                  color={colors.darkmodeHighWhite}
                />
              </View>
            </View>
          </TouchableHighlight>
        </ScrollView>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  separatorText: {
    textAlign: "center",
    paddingBottom: 0,
    marginBottom: 6,
    paddingTop: 2,
    paddingHorizontal: 10,
    fontSize: 16,
    fontStyle: "italic",
    color: colors.darkmodeDisabledWhite,
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
    width: ITEM_HEIGHT * 0.9,
    height: ITEM_HEIGHT * 0.9,
    left: -18,
  },
  imageDefault: {
    width: ITEM_HEIGHT * 1.2,
    height: ITEM_HEIGHT * 1.2,
    marginTop: -62,
    marginLeft: 0,
  },
  title: {
    color: colors.darkmodeHighWhite,
    fontSize: 22,
    marginTop: 0,
    width: width * 0.54,
    marginLeft: -130,
    textShadowOffset: { width: 8, height: 8 },
    textShadowRadius: 8,
    textShadowColor: "rgba(0,0,0,0.5)",
  },
  subtitle: {
    color: colors.darkmodeMediumWhite,
    fontSize: 15,
    marginLeft: -130,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    textShadowColor: "rgba(0,0,0,0.5)",
  },
  background: {
    borderRadius: 16,
    height: height * 0.14,
  },
  makeYourOwnRoutine: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
    width: "170%",
  },
  makeYourOwnRoutineText: {
    flex: 1,
    color: colors.darkmodeHighWhite,
    fontWeight: "100",
    paddingLeft: 22,
  },
  makeYourOwnRoutinePlus: {
    flex: 1,
  },
});

export default RoutinesScreen;
