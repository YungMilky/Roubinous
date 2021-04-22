import { db, auth, cloud } from '../firebase';

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';

// used to optimize swipeable
// import { debounce } from "lodash";

import { useIsFocused } from '@react-navigation/native';

import { SearchBar } from 'react-native-elements';

import { ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

// import Swipeable from "react-native-swipeable-row";

import * as Animatable from 'react-native-animatable';

import { AntDesign, FontAwesome } from '@expo/vector-icons';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import Tag from '../components/Tag';
import colors from '../config/colors';

import AddAndRemoveButton from '../components/AddAndRemoveButton';

const { width, height } = Dimensions.get('screen');
const ITEM_HEIGHT = height * 0.18;

const getItemLayout = (data, index) => ({
  length: ITEM_HEIGHT * 0.78,
  offset: ITEM_HEIGHT * 0.78 * index,
  index,
});

const separator = (text) => {
  return (
    <View>
      <View
        style={{
          width: '80%',
          display: 'flex',
          justifyContent: 'center',
        }}
      ></View>
      <View
        style={{
          flexDirection: 'row',
          paddingBottom: 12,
          paddingTop: 1,
        }}
      >
        <View
          style={{
            backgroundColor: colors.darkmodeDisabledBlack,
            height: 2,
            flex: 1,
            alignSelf: 'center',
          }}
        />
        <Text
          style={{
            textAlign: 'center',
            paddingBottom: 0,
            marginBottom: 6,
            paddingTop: 2,
            paddingHorizontal: 10,
            fontSize: 16,
            fontStyle: 'italic',
            color: colors.darkmodeDisabledWhite,
          }}
        >
          {text}
        </Text>
        <View
          style={{
            backgroundColor: colors.darkmodeDisabledBlack,
            height: 2,
            flex: 1,
            alignSelf: 'center',
          }}
        />
      </View>
    </View>
  );
};

function RoutinesScreen({ navigation }) {
  const user = auth.currentUser;
  const dbUser = db.collection('Users').doc(user.uid);
  console.log(user.uid);

  const rank1 = 'kn00b';
  const rank2 = 'Achiever';
  const rank3 = 'Bambaclat';
  const [userRank, setuserRank] = useState(rank1);

  //routines, locked routines, ongoing routines
  const [items, setItems] = useState([]);
  const [lockedItems, setLockedItems] = useState([]);
  const [alreadyAddeditems, setAlreadyAddedItems] = useState([]);

  const [search, setSearch] = useState();

  //to refresh on reload/back
  const [refresh, setRefresh] = useState(false);

  const [longPress, setLongPress] = useState(false);

  //  references to the swipeable objects
  // const [swipeableRef, setSwipeableRef] = useState();
  // const [swipeableRefAdded, setSwipeableRefAdded] = useState();

  //selections
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedAddedItem, setSelectedAddedItem] = useState([]);

  const [swipeText, setSwipeText] = useState('Add me!');
  const [swipeTextAdded, setSwipeTextAdded] = useState('Remove me');

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
    db.collection('Routines')
      .get()
      .then((docs) => {
        let index = 0;
        docs.forEach((doc) => {
          let routineName = doc.id;

          //routine image from storage
          let imageRefRoutines = cloud.ref(
            'RoutinesScreen/' + routineName + '.png'
          );
          let imageRefRoutine = cloud.ref(
            'RoutineScreen/' + routineName + '.png'
          );

          //set default difficulty to 0
          let diff = doc.data().DifficultyRank;
          if (typeof diff === 'undefined') {
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
            if (removed || (!alreadyAdded && !lock)) {
              imageRefRoutines.getDownloadURL().then((urlRoutines) => {
                imageRefRoutine.getDownloadURL().then((urlRoutine) => {
                  setItems((oldArray1) => [
                    ...oldArray1,
                    {
                      key: index,
                      title: routineName,
                      shortDescription: doc.data().ShortDescription,
                      descriptionArray: doc.data().LongDescription,
                      color: doc.data().Color,
                      difficulty: diff,
                      image: urlRoutines,
                      imageRoutine: urlRoutine,
                      lock: lock,
                      alreadyAdded: alreadyAdded,
                      removed: removed,
                    },
                  ]);
                });
              });
            } else if (!alreadyAdded && lock) {
              imageRefRoutines.getDownloadURL().then((urlRoutines) => {
                imageRefRoutine.getDownloadURL().then((urlRoutine) => {
                  setLockedItems((oldArray2) => [
                    ...oldArray2,
                    {
                      key: index,
                      title: routineName,
                      shortDescription: doc.data().ShortDescription,
                      descriptionArray: doc.data().LongDescription,
                      color: doc.data().Color,
                      difficulty: diff,
                      image: urlRoutines,
                      imageRoutine: urlRoutine,
                      lock: lock,
                      alreadyAdded: alreadyAdded,
                      removed: false,
                    },
                  ]);
                });
              });
            } else if (alreadyAdded && !removed) {
              imageRefRoutines.getDownloadURL().then((urlRoutines) => {
                imageRefRoutine.getDownloadURL().then((urlRoutine) => {
                  setAlreadyAddedItems((oldArray3) => [
                    ...oldArray3,
                    {
                      key: index,
                      title: routineName,
                      shortDescription: doc.data().ShortDescription,
                      descriptionArray: doc.data().LongDescription,
                      color: doc.data().Color,
                      difficulty: diff,
                      image: urlRoutines,
                      imageRoutine: urlRoutine,
                      lock: lock,
                      alreadyAdded: alreadyAdded,
                      removed: false,
                    },
                  ]);
                });
              });
            }
            index++;
          }
          //routines with default images
          function onReject() {
            if (removed || (!alreadyAdded && !lock)) {
              setItems((oldArray1) => [
                ...oldArray1,
                {
                  key: index,
                  title: routineName,
                  shortDescription: doc.data().ShortDescription,
                  descriptionArray: doc.data().LongDescription,
                  color: doc.data().Color,
                  difficulty: diff,
                  imageDefault: require('../assets/RoutinesPics/default.png'),
                  lock: lock,
                  alreadyAdded: alreadyAdded,
                  removed: removed,
                },
              ]);
            } else if (lock) {
              setLockedItems((oldArray2) => [
                ...oldArray2,
                {
                  key: index,
                  title: routineName,
                  shortDescription: doc.data().ShortDescription,
                  descriptionArray: doc.data().LongDescription,
                  color: doc.data().Color,
                  difficulty: diff,
                  imageDefault: require('../assets/RoutinesPics/default.png'),
                  lock: lock,
                  alreadyAdded: alreadyAdded,
                  removed: false,
                },
              ]);
            } else if (alreadyAdded && !removed) {
              setAlreadyAddedItems((oldArray3) => [
                ...oldArray3,
                {
                  key: index,
                  title: routineName,
                  shortDescription: doc.data().ShortDescription,
                  descriptionArray: doc.data().LongDescription,
                  color: doc.data().Color,
                  difficulty: diff,
                  imageDefault: require('../assets/RoutinesPics/default.png'),
                  lock: lock,
                  alreadyAdded: alreadyAdded,
                  removed: false,
                },
              ]);
            }
            index++;
          }

          let removed = undefined;
          let alreadyAdded = undefined;
          dbUser
            .collection('routines')
            .doc(routineName)
            .get()
            .then((documentSnapshot) => {
              if (documentSnapshot.exists) {
                if (documentSnapshot.data().removed) {
                  removed = true;
                } else {
                  alreadyAdded = true;
                }
              } else {
                alreadyAdded = false;
              }
              imageRefRoutines.getDownloadURL().then(onResolve, onReject);
            });
        });
      });
  }

  dbUser.get().then((documentSnapshot) => {
    let userRank = documentSnapshot.get('UserRank');
    let translatedUserRank = 'Unranked';
    if (userRank >= '0' && userRank < '10') {
      translatedUserRank = rank1;
    } else if (userRank >= '10' && userRank < '20') {
      translatedUserRank = rank2;
    } else if (userRank >= '20' && userRank <= '30') {
      translatedUserRank = rank3;
    }
    setuserRank(translatedUserRank);
  });

  //  Flatlist items pre-render for performance
  let renderItems = ({ item }) => {
    return (
      // <Swipeable
      //   onRef={(ref) => setSwipeableRef(ref)}
      //   style={{ width: width, paddingLeft: 0 }}
      //   bounceOnMount={true}
      //   useNativeDriver={true}
      //   rightActionActivationDistance={200}
      //   onSwipeStart={debounce(() => {
      //     setTimeout(() => {
      //       swipeableRef.recenter();
      //     }, 3000);
      //   }, 500)}
      //   onRightActionRelease={debounce(() => {
      //     if (swipeText === "Add me!") {
      //       setSwipeText("Added!");
      //       AddRoutine(item.title);
      //       setTimeout(() => {
      //         swipeableRef.recenter();
      //       }, 1000);
      //       setTimeout(() => {
      //         setSwipeText("Remove me");
      //       }, 1000);
      //     } else if (swipeText === "Remove me") {
      //       setSwipeText("Removed!");
      //       setTimeout(() => {
      //         swipeableRef.recenter();
      //       }, 1000);
      //       setTimeout(() => {
      //         setSwipeText("Add me!");
      //       }, 1000);
      //     }
      //     if (selectedItem.includes(item.title)) {
      //       setSelectedItem(
      //         selectedItem.filter((added) => added !== item.title)
      //       );
      //     } else {
      //       setSelectedItem((lastItem) => [...lastItem, item.title]);
      //     }
      //   }, 500)}
      //   rightButtons={[
      //     <View style={styles.swipeable}>
      //       <AppText
      //         style={[
      //           styles.swipeableText,
      //           swipeText === "Removed!" || swipeText === "Remove me"
      //             ? { color: colors.darkmodeErrorColor }
      //             : { color: colors.pastelGreen },
      //         ]}
      //       >
      //         {swipeText}
      //       </AppText>
      //     </View>,
      //   ]}
      // >
      <Animatable.View
        animation="zoomIn"
        duration={200}
        useNativeDriver={true}
        style={[
          selectedItem.includes(item.title) ? styles.selectedOverlay : null,
          styles.card,
        ]}
      >
        <TouchableHighlight
          delayLongPress={200}
          onLongPress={() => {
            setLongPress(true);
          }}
          delayPressIn={200}
          activeOpacity={0.9}
          onPressOut={() =>
            longPress
              ? setLongPress(false)
              : navigation.navigate('Routine', { item })
          }
        >
          {/* <SharedElement
            id={`item.${item.id}.color`}
            // style={[
            //   StyleSheet.absoluteFillObject,
            //   { backgroundColor: item.color },
            // ]}
          > */}
          <LinearGradient
            colors={[colors.OrchidPink, colors.darkmodeMediumWhite, item.color]}
            style={itemStyles.background}
            start={{ x: 5, y: 0.01 }}
            end={{ x: 0.1, y: 0.3 }}
            // locations={[0.4, 0.1]}
          >
            <View style={[itemStyles.container]}>
              {/* <SharedElement
                  id={`item.${item.id}.image`}
                  style={itemStyles.image}
                > */}

              {item.image ? (
                <Image style={itemStyles.image} source={{ uri: item.image }} />
              ) : (
                <Image
                  style={itemStyles.imageDefault}
                  source={item.imageDefault}
                />
              )}
              {/* </SharedElement> */}

              <View>
                {/* <SharedElement id={`item.${item.id}.title`}> */}
                <AppText
                  style={[
                    item.image
                      ? {
                          marginLeft: -200,
                        }
                      : {
                          marginLeft: -168,
                        },
                    itemStyles.title,
                  ]}
                >
                  {item.title}
                </AppText>
                {/* </SharedElement> */}
                <AppText
                  style={[
                    item.image
                      ? {
                          marginLeft: -200,
                        }
                      : {
                          marginLeft: -168,
                        },
                    itemStyles.subtitle,
                  ]}
                >
                  {item.shortDescription}
                </AppText>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    position: 'absolute',
                    width:
                      typeof item.imageDefault != 'undefined'
                        ? width * 0.37
                        : width * 0.295,
                    top: 66,
                  }}
                >
                  <AddAndRemoveButton check={true} routine={item.title} />
                  <Tag difficulty={item.difficulty} />
                </View>
              </View>
            </View>
          </LinearGradient>
          {/* </SharedElement> */}
        </TouchableHighlight>
      </Animatable.View>
      /* </Swipeable> */
    );
  };
  let renderLockedItems = ({ item }) => {
    return (
      // <Swipeable
      //   style={{ width: width, paddingLeft: 0 }}
      //   useNativeDriver={true}
      //   rightContent={[
      //     <View style={styles.swipeable}>
      //       <AppText
      //         style={[
      //           styles.swipeableText,
      //           { color: colors.darkmodeDisabledWhite },
      //         ]}
      //       >
      //         Locked{" "}
      //         <FontAwesome
      //           name="lock"
      //           size={18}
      //           color={colors.darkmodeDisabledWhite}
      //         />
      //       </AppText>
      //     </View>,
      //   ]}
      // >
      <Animatable.View
        animation={'zoomIn'}
        duration={200}
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
          delayLongPress={300}
          onLongPress={() => {
            setLongPress(true);
          }}
          delayPressIn={200}
          activeOpacity={0.9}
          onPressOut={() =>
            longPress
              ? setLongPress(false)
              : navigation.navigate('Routine', { item })
          }
        >
          {/* <SharedElement
            id={`item.${item.id}.color`}
            // style={[
            //   StyleSheet.absoluteFillObject,
            //   { backgroundColor: item.color },
            // ]}
          > */}
          <LinearGradient
            colors={[colors.OrchidPink, colors.darkmodeMediumWhite, item.color]}
            style={itemStyles.background}
            start={{ x: 5, y: 0.01 }}
            end={{ x: 0.1, y: 0.3 }}
            // locations={[0.4, 0.1]}
          >
            <View style={itemStyles.container}>
              {/* <SharedElement
                  id={`item.${item.id}.image`}
                  style={itemStyles.image}
                > */}
              {item.image ? (
                <Image style={itemStyles.image} source={{ uri: item.image }} />
              ) : (
                <Image
                  style={itemStyles.imageDefault}
                  source={item.imageDefault}
                />
              )}
              {/* </SharedElement> */}

              <View>
                {/* <SharedElement id={`item.${item.id}.title`}> */}
                <AppText
                  style={[
                    item.image
                      ? {
                          marginLeft: -200,
                        }
                      : {
                          marginLeft: -168,
                        },
                    itemStyles.title,
                  ]}
                >
                  {item.title}
                </AppText>
                {/* </SharedElement> */}
                <AppText
                  style={[
                    item.image
                      ? {
                          marginLeft: -200,
                        }
                      : {
                          marginLeft: -168,
                        },
                    itemStyles.subtitle,
                  ]}
                >
                  {item.shortDescription}
                </AppText>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    position: 'absolute',
                    width:
                      typeof item.imageDefault != 'undefined'
                        ? width * 0.37
                        : width * 0.295,
                    top: 66,
                  }}
                >
                  <Tag lock={true} />
                  <Tag difficulty={item.difficulty} />
                </View>
              </View>
            </View>
          </LinearGradient>
          {/* </SharedElement> */}
        </TouchableHighlight>
      </Animatable.View>
      /* </Swipeable> */
    );
  };
  let renderAlreadyAddedItems = ({ item }) => {
    return (
      // <Swipeable
      //   onRef={(ref) => setSwipeableRefAdded(ref)}
      //   style={{ width: width, paddingLeft: 0 }}
      //   useNativeDriver={true}
      //   rightActionActivationDistance={200}
      //   onSwipeStart={debounce(() => {
      //     setTimeout(() => {
      //       swipeableRefAdded.recenter();
      //     }, 3000);
      //   }, 500)}
      //   onRightActionRelease={debounce(() => {
      //     if (swipeTextAdded === "Remove me") {
      //       setSwipeTextAdded("Removed!");
      //       setTimeout(() => {
      //         swipeableRefAdded.recenter();
      //       }, 1000);
      //       setTimeout(() => {
      //         setSwipeTextAdded("Add me!");
      //       }, 1000);
      //     } else if (swipeTextAdded === "Add me!") {
      //       setSwipeTextAdded("Added!");
      //       AddRoutine(item.title);
      //       setTimeout(() => {
      //         swipeableRefAdded.recenter();
      //       }, 1000);
      //       setTimeout(() => {
      //         setSwipeTextAdded("Remove me");
      //       }, 1000);
      //     }
      //     if (selectedAddedItem.includes(item.title)) {
      //       setSelectedAddedItem(
      //         selectedAddedItem.filter((added) => added !== item.title)
      //       );
      //     } else {
      //       setSelectedAddedItem((lastItem) => [...lastItem, item.title]);
      //     }
      //   }, 500)}
      //   rightButtons={[
      //     <View style={styles.swipeable}>
      //       <AppText
      //         style={[
      //           styles.swipeableText,
      //           swipeTextAdded === "Removed!" || swipeTextAdded === "Remove me"
      //             ? { color: colors.darkmodeErrorColor }
      //             : { color: colors.pastelGreen },
      //         ]}
      //       >
      //         {swipeTextAdded}
      //       </AppText>
      //     </View>,
      //   ]}
      // >
      <Animatable.View
        animation="zoomIn"
        duration={200}
        useNativeDriver={true}
        style={[
          selectedAddedItem.includes(item.title)
            ? styles.selectedAddedOverlay
            : null,
          styles.card,
        ]}
      >
        <TouchableHighlight
          delayLongPress={300}
          onLongPress={() => {
            setLongPress(true);
          }}
          delayPressIn={200}
          activeOpacity={0.9}
          onPressOut={() =>
            longPress
              ? setLongPress(false)
              : navigation.navigate('Routine', { item })
          }
        >
          {/* <SharedElement
            id={`item.${item.id}.color`}
            // style={[
            //   StyleSheet.absoluteFillObject,
            //   { backgroundColor: item.color },
            // ]}
          > */}
          <LinearGradient
            colors={[colors.OrchidPink, colors.darkmodeMediumWhite, item.color]}
            style={itemStyles.background}
            start={{ x: 5, y: 0.01 }}
            end={{ x: 0.1, y: 0.3 }}
            // locations={[0.4, 0.1]}
          >
            <View style={itemStyles.container}>
              {/* <SharedElement
                  id={`item.${item.id}.image`}
                  style={itemStyles.image}
                > */}
              {item.image ? (
                <Image style={itemStyles.image} source={{ uri: item.image }} />
              ) : (
                <Image
                  style={itemStyles.imageDefault}
                  source={item.imageDefault}
                />
              )}
              {/* </SharedElement> */}

              <View>
                {/* <SharedElement id={`item.${item.id}.title`}> */}
                <AppText
                  style={[
                    item.image
                      ? {
                          marginLeft: -200,
                        }
                      : {
                          marginLeft: -168,
                        },
                    itemStyles.title,
                  ]}
                >
                  {item.title}
                </AppText>
                {/* </SharedElement> */}
                <AppText
                  style={[
                    item.image
                      ? {
                          marginLeft: -200,
                        }
                      : {
                          marginLeft: -168,
                        },
                    itemStyles.subtitle,
                  ]}
                >
                  {item.shortDescription}
                </AppText>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    position: 'absolute',
                    width:
                      typeof item.imageDefault != 'undefined'
                        ? width * 0.37
                        : width * 0.295,
                    top: 66,
                  }}
                >
                  <TouchableOpacity disabled={false}>
                    <AddAndRemoveButton check={false} routine={item.title} />
                  </TouchableOpacity>
                  <Tag difficulty={item.difficulty} />
                </View>
              </View>
            </View>
          </LinearGradient>
          {/* </SharedElement> */}
          {/* </View> */}
        </TouchableHighlight>
      </Animatable.View>
      /* </Swipeable> */
    );
  };

  return (
    <Screen style={{ backgroundColor: colors.darkmodeBlack, marginTop: -12 }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
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
          <View style={{ alignItems: 'center', paddingTop: 2 }}>
            <SearchBar
              placeholder="Search routines..."
              onChangeText={setSearch}
              value={search}
              containerStyle={{
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                backgroundColor: 'rgba(0,0,0,0.0)',
                width: width * 0.92,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                height: 50,
              }}
              inputContainerStyle={{
                borderRadius: 16,
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
            // keyExtractor={(items) => items.id.toString()}
            extraData={refresh}
            renderItem={renderItems}
            updateCellsBatchingPeriod={0}
            windowSize={5}
          />

          {lockedItems.length ? separator('Locked routines') : null}

          <FlatList
            getItemLayout={getItemLayout}
            initialNumToRender={lockedItems.length}
            data={lockedItems.sort(function (a, b) {
              return a.difficulty - b.difficulty;
            })}
            // keyExtractor={(lockedItems) => lockedItems.id.toString()}
            renderItem={renderLockedItems}
            updateCellsBatchingPeriod={0}
            windowSize={5}
          />

          {alreadyAddeditems.length ? separator('Ongoing routines') : null}

          <FlatList
            getItemLayout={getItemLayout}
            initialNumToRender={alreadyAddeditems.length}
            data={alreadyAddeditems.sort(function (a, b) {
              return a.difficulty - b.difficulty;
            })}
            // keyExtractor={(alreadyAddeditems) =>
            //   alreadyAddeditems.id.toString()
            // }
            extraData={refresh}
            renderItem={renderAlreadyAddedItems}
            updateCellsBatchingPeriod={0}
            windowSize={5}
          />

          <TouchableHighlight
            activeOpacity={0.9}
            underlayColor={colors.white}
            onPressOut={() =>
              navigation.navigate('Add Custom Routine', {
                screen: 'AddRoutine',
              })
            }
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
  card: {
    padding: 3,
    marginBottom: 8,
    marginHorizontal: 10,
    width: width * 0.89,
    borderRadius: 5,
    elevation: -8,
  },
  // swipeable: {
  //   flex: 1,
  //   marginLeft: -23,
  //   marginTop: 3,
  //   marginBottom: 10,
  //   borderRadius: 4,
  //   backgroundColor: colors.darkmodeDisabledBlack,
  // },
  // swipeableText: {
  //   flex: 1,
  //   transform: [{ rotate: "90deg" }],
  //   width: width * 0.3,
  //   right: 40,
  //   fontWeight: "700",
  //   fontSize: 16,
  //   marginTop: 14,
  //   marginBottom: 10,
  //   textAlign: "center",
  //   padding: 12,
  // },
  description: {
    fontSize: 11,
  },
  image: {
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
    right: 20,
  },
  selectedOverlay: {
    backgroundColor: colors.darkmodeMediumWhite,
    padding: 30,
    // borderWidth: 6,
    // borderColor: colors.pastelGreen,
    // borderRadius: 10,
  },
  selectedAddedOverlay: {
    backgroundColor: colors.darkmodeMediumWhite,
    padding: 30,
    // borderWidth: 6,
    // borderColor: colors.pastelGreen,
    // borderRadius: 10,
  },
});

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 10,
    borderRadius: 16,
    height: ITEM_HEIGHT * 0.78,
  },
  image: {
    overflow: 'hidden',
    resizeMode: 'contain',
    width: ITEM_HEIGHT * 1.4,
    height: ITEM_HEIGHT * 1.4,
    marginTop: -60,
    left: width * 0.4,
  },
  imageDefault: {
    overflow: 'hidden',
    width: ITEM_HEIGHT * 1.2,
    height: ITEM_HEIGHT * 1.08,
    marginTop: -55,
    left: width * 0.4,
  },
  title: {
    color: colors.darkmodeHighWhite,
    fontSize: 22,
    marginTop: 1,
    width: width * 0.78,
    textShadowOffset: { width: 8, height: 8 },
    textShadowRadius: 8,
    textShadowColor: 'rgba(0,0,0,0.4)',
  },
  subtitle: {
    color: colors.darkmodeMediumWhite,
    fontSize: 15,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    textShadowColor: 'rgba(0,0,0,0.4)',
  },
  background: {
    borderRadius: 16,
    height: height * 0.14,
  },
  makeYourOwnRoutine: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '170%',
  },
  makeYourOwnRoutineText: {
    flex: 1,
    color: colors.darkmodeHighWhite,
    fontWeight: '100',
    paddingLeft: 22,
  },
  makeYourOwnRoutinePlus: {
    flex: 1,
  },
});

export default RoutinesScreen;
