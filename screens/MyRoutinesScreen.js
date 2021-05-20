import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
// import firestore from '@react-native-firebase/firestore';
import { db, auth, cloud } from '../firebase';
import PropTypes from 'prop-types';
import { Swipeable } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import {
  MaterialCommunityIcons,
  Octicons,
  FontAwesome,
} from '@expo/vector-icons';

import * as Animatable from 'react-native-animatable';

import { useNavigationState } from '@react-navigation/native';

import Screen from '../components/Screen';
import colors from '../config/colors';
import AppButton from '../components/AppButton';
import { ScrollView } from 'react-native';

const MyRoutinesScreen = ({ navigation, route }) => {
  const width = Dimensions.get('window').width;
  const user = auth.currentUser;
  const [clickedRoutine, setClickedRoutine] = useState();
  const [officialRoutines, setOfficialRoutines] = useState([]);
  const [customRoutines, setCustomRoutines] = useState([]);
  const [removeCustomModalVisible, setRemoveCustomModalVisible] =
    useState(false);
  const [removeOfficialModalVisible, setRemoveOfficialModalVisible] =
    useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState();
  const [refresh, setRefresh] = useState(false);

  const isFocused = useIsFocused();
  useEffect(() => {
    listItems();
  }, [isFocused]);

  const removeOfficialRoutine = (clicked) => {
    if (selectedRoutine) {
      console.log(
        'Removed routine: ' +
          selectedRoutine.title +
          ' id: ' +
          selectedRoutine.key
      );
      db.collection('Users')
        .doc(user.uid)
        .collection('routines')
        .doc(selectedRoutine.title)
        .update({
          removed: true,
        });

      const filteredData = officialRoutines.filter(
        (item, index) => index !== clicked
      );
      setOfficialRoutines(filteredData);
      setRefresh(!refresh);
    }
  };
  const showModalRemoveOfficialRoutine = () => {
    setRemoveOfficialModalVisible(true);
  };
  const removeCustomRoutine = (clicked) => {
    if (selectedRoutine) {
      console.log(
        'Removed routine: ' +
          selectedRoutine.title +
          ' id: ' +
          selectedRoutine.key
      );
      db.collection('Users')
        .doc(user.uid)
        .collection('customRoutines')
        .doc(selectedRoutine.title)
        .delete();

      const filteredData = customRoutines.filter(
        (item, index) => index !== clicked
      );
      setCustomRoutines(filteredData);
      setRefresh(!refresh);
      listItems();
    }
  };
  const showModalRemoveCustomRoutine = () => {
    setRemoveCustomModalVisible(true);
  };

  const listItems = async () => {
    setOfficialRoutines([]);
    setCustomRoutines([]);

    await db
      .collection('Users')
      .doc(user.uid)
      .collection('routines')
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          let routineName = doc.id;

          let imageRefRoutine = cloud.ref(
            'RoutineScreen/' + routineName + '.png'
          );

          db.collection('Routines')
            .doc(routineName)
            .get()
            .then((documentsnapshot) => {
              imageRefRoutine
                .getDownloadURL()
                .then((urlRoutine) => {
                  if (!doc.data().removed) {
                    setOfficialRoutines((oldArray1) => [
                      ...oldArray1,
                      {
                        key: oldArray1.length
                          ? oldArray1[oldArray1.length - 1].key + 1
                          : 0,
                        title: routineName,
                        days: doc.data().days,
                        descriptionArray:
                          documentsnapshot.data()?.LongDescription,
                        color: documentsnapshot.data()?.Color,
                        image: true,
                        imageRoutine: urlRoutine,
                        fromMyRoutines: true,
                      },
                    ]);
                  }
                })
                .catch((err) => {
                  if (!doc.data().removed) {
                    setOfficialRoutines((oldArray1) => [
                      ...oldArray1,
                      {
                        key: oldArray1.length
                          ? oldArray1[oldArray1.length - 1].key + 1
                          : 0,
                        title: routineName,
                        days: doc.data().days,
                        descriptionArray:
                          documentsnapshot.data()?.LongDescription,
                        color: documentsnapshot.data()?.Color,
                        image: false,
                        fromMyRoutines: true,
                      },
                    ]);
                  }
                });
              // Here you can handle the error for individual download
            });
        });
      });

    db.collection('Users')
      .doc(user.uid)
      .collection('customRoutines')
      .get()
      .then((docs) => {
        let index = 0;
        docs.forEach((doc) => {
          let routineName = doc.id;

          setCustomRoutines((oldArray1) => [
            ...oldArray1,
            {
              key: oldArray1.length
                ? oldArray1[oldArray1.length - 1].key + 1
                : 0,
              title: routineName,
              shortDescription: doc.data()?.shortDescription,
              isCustom: true,
              routineTimes: JSON.parse(doc.data().routineTimes),
            },
          ]);

          index++;
        });
      });
  };

  let renderUneditableItems = ({ item }) => {
    return (
      <Swipeable
        friction={3}
        renderRightActions={(progress, dragX) => {
          const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          });
          return (
            <TouchableOpacity
              onPress={() => {
                showModalRemoveOfficialRoutine();
                setSelectedRoutine(
                  officialRoutines[
                    officialRoutines.findIndex((obj) => obj.key === item.key)
                  ]
                );
              }}
              style={styles.routineListItemContainer}
            >
              <MaterialCommunityIcons
                name="close"
                size={30}
                color={colors.samRed}
              />
            </TouchableOpacity>
          );
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Routine', { item });
          }}
          style={styles.routineListItemContainer}
        >
          {typeof item != 'undefined' ? (
            <Text
              style={{
                fontSize: 22,
                color: colors.darkmodeHighWhite,
                paddingRight: 8,
                paddingLeft: 3,
              }}
            >
              {item.title}
            </Text>
          ) : null}
        </TouchableOpacity>
      </Swipeable>
    );
  };
  let renderItems = ({ item }) => {
    return (
      <Swipeable
        friction={3}
        renderRightActions={(progress, dragX) => {
          const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          });
          return (
            <View style={styles.routineListItemContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Edit Custom Routines', { item });
                }}
              >
                <MaterialCommunityIcons
                  name="pencil"
                  size={24}
                  color={colors.samBlue}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  showModalRemoveCustomRoutine();
                  setSelectedRoutine(
                    customRoutines[
                      customRoutines.findIndex((obj) => obj.key === item.key)
                    ]
                  );
                }}
                style={{ paddingLeft: 4 }}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={30}
                  color={colors.samRed}
                />
              </TouchableOpacity>
            </View>
          );
        }}
      >
        <TouchableOpacity
          style={styles.routineListItemContainer}
          onPress={() => {
            navigation.navigate('Routine', { item });
          }}
        >
          {typeof item != 'undefined' ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 22,
                  color: colors.darkmodeHighWhite,
                  paddingRight: 8,
                  paddingLeft: 3,
                }}
              >
                {item.title}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </Swipeable>
    );
  };

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          setInfoModalVisible(!infoModalVisible);
        }}
        style={styles.iconContainer}
      >
        <MaterialCommunityIcons
          style={{ paddingRight: 14 }}
          name="information-outline"
          size={25}
          color={colors.darkmodeHighWhite}
        />
      </TouchableOpacity>
    ),
  });

  return (
    <Screen style={styles.container}>
      {/* <ScrollView> */}
      <View styles={styles.flatlist}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={removeCustomModalVisible}
          onRequestClose={() => {
            setRemoveCustomModalVisible(!removeCustomModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Are you sure you want to remove this routine?
              </Text>
              <AppButton
                style={styles.button}
                title={'Remove'}
                onPress={() => {
                  removeCustomRoutine(selectedRoutine.key);
                  setRemoveCustomModalVisible(!removeCustomModalVisible);
                }}
              />
              <AppButton
                style={[styles.button, styles.buttonClose]}
                title={'Cancel'}
                onPress={() =>
                  setRemoveCustomModalVisible(!removeCustomModalVisible)
                }
              ></AppButton>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={removeOfficialModalVisible}
          onRequestClose={() => {
            setRemoveOfficialModalVisible(!removeOfficialModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Are you sure you want to remove this routine?
              </Text>
              <AppButton
                style={styles.button}
                title={'Remove'}
                onPress={() => {
                  removeOfficialRoutine(selectedRoutine.key);
                  setRemoveOfficialModalVisible(!removeOfficialModalVisible);
                }}
              />
              <AppButton
                style={[styles.button, styles.buttonClose]}
                title={'Cancel'}
                onPress={() =>
                  setRemoveOfficialModalVisible(!removeOfficialModalVisible)
                }
              ></AppButton>
            </View>
          </View>
        </Modal>
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText]}>Official routines</Text>

          <Modal
            animationType="fade"
            transparent={true}
            visible={infoModalVisible}
            onRequestClose={() => {
              setInfoModalVisible(!infoModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Here you can view all of your routines.
                  {'\n'}
                  {'\n'}
                  Press a routine to view info.
                  {'\n'}
                  {'\n'}
                  Swipe left on a routine to remove.
                  {'\n'}
                  {'\n'}
                  Swipe left on a custom routine to remove/edit.
                </Text>
                <AppButton
                  style={[styles.button, styles.buttonClose]}
                  title={'Ok!'}
                  onPress={() => setInfoModalVisible(!infoModalVisible)}
                ></AppButton>
              </View>
            </View>
          </Modal>
        </View>
        <View>
          {officialRoutines.length < 1 ? (
            <View>
              <Text style={styles.text}>
                You don't have any official routines.
              </Text>
              <Pressable onPress={() => navigation.navigate('Browse routines')}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 10,
                    paddingHorizontal: 22,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.darkmodeDisabledText,
                      paddingRight: 8,
                      fontWeight: '700',
                    }}
                  >
                    {' '}
                    Browse routines...
                  </Text>
                  {/* <FontAwesome
                name='bars'
                size={20}
                color={colors.darkmodeDisabledText}
                style={{
                  shadowColor: colors.pastelBlue,
                  shadowOpacity: 2,
                  textShadowRadius: 4,
                  textShadowOffset: { width: 2, height: 2 },
                }}
              /> */}
                </View>
              </Pressable>
            </View>
          ) : (
            <View styles={styles.flatlist}>
              {typeof officialRoutines != 'undefined' ? (
                <FlatList
                  initialNumToRender={officialRoutines.length}
                  data={officialRoutines}
                  renderItem={renderUneditableItems}
                  updateCellsBatchingPeriod={0}
                  windowSize={5}
                  extraData={refresh}
                  //Style={{ flexGrow: 1 }}
                />
              ) : null}
              <Pressable onPress={() => navigation.navigate('Browse routines')}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 10,
                    paddingHorizontal: 22,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.darkmodeDisabledText,
                      paddingRight: 8,
                      fontWeight: '700',
                    }}
                  >
                    {' '}
                    Browse routines...
                  </Text>
                  {/* <FontAwesome
                    name='bars'
                    size={20}
                    color={colors.darkmodeDisabledText}
                    style={{
                      shadowColor: colors.pastelBlue,
                      shadowOpacity: 2,
                      textShadowRadius: 4,
                      textShadowOffset: { width: 2, height: 2 },
                    }}
                  /> */}
                </View>
              </Pressable>
            </View>
          )}
          <View style={[styles.titleContainer, { marginTop: 20 }]}>
            <Text style={[styles.titleText]}>Custom routines</Text>
          </View>
          {customRoutines.length < 1 ? (
            <Text style={styles.text}>You don't have any custom routines.</Text>
          ) : (
            <View styles={styles.flatlist}>
              {typeof customRoutines != 'undefined' ? (
                <FlatList
                  initialNumToRender={customRoutines.length}
                  data={customRoutines}
                  renderItem={renderItems}
                  updateCellsBatchingPeriod={0}
                  windowSize={5}
                  extraData={refresh}
                />
              ) : null}
            </View>
          )}
          <Animatable.View
            animation={route.params ? 'tada' : null}
            duration={1200}
            delay={800}
            useNativeDriver={true}
          >
            <Pressable onPress={() => navigation.navigate('Add routine')}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 10,
                  paddingHorizontal: 22,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.darkmodeDisabledText,
                    paddingRight: 8,
                    fontWeight: '700',
                  }}
                >
                  {' '}
                  New custom routine...
                </Text>
                <Octicons
                  name="plus"
                  size={18}
                  color={colors.darkmodeDisabledText}
                  style={{
                    shadowColor: colors.pastelBlue,
                    shadowOpacity: 2,
                    textShadowRadius: 4,
                    textShadowOffset: { width: 2, height: 2 },
                  }}
                />
              </View>
            </Pressable>
          </Animatable.View>
        </View>
      </View>
      {/* </ScrollView> */}
    </Screen>
  );
};
const styles = StyleSheet.create({
  headerAddButton: {
    paddingRight: 15,
  },
  button: {
    //
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    width: 200,
    height: 50,
  },
  buttonClose: {
    //
    backgroundColor: '#2196F3',
  },
  container: {},
  centeredView: {
    //
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlist: {},
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    color: colors.darkmodeHighWhite,
  },
  iconContainer: {
    flexDirection: 'row',
    paddingLeft: 70,
  },
  modalView: {
    width: '90%',
    margin: 20,
    backgroundColor: colors.darkmodeDisabledBlack,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  routineListItemContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.darkmodeDisabledBlack,
    padding: 10,
    flexDirection: 'row',
  },
  text: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 18,
    color: colors.darkmodeHighWhite,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleText: {
    color: colors.darkmodeMediumWhite,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
  },
});

MyRoutinesScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default MyRoutinesScreen;
