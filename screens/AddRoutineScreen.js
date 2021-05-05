import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
  TouchableOpacity,
  Button,
  FlatList,
  Dimensions,
} from 'react-native';
import { Input } from 'react-native-elements';
import PropTypes from 'prop-types';
import { db, auth } from '../firebase';
import WeekdayPicker from 'react-native-weekday-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  MaterialCommunityIcons,
  FontAwesome,
  EvilIcons,
} from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Feather';
import { ScrollView } from 'react-native-gesture-handler';
import { Swipeable } from 'react-native-gesture-handler';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import DropDownPicker from 'react-native-dropdown-picker';

import colors from '../config/colors';
import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import { set } from 'react-native-reanimated';
import { setBadgeCountAsync } from 'expo-notifications';

const width = Dimensions.get('window').width;

const editIcon = () => {
  return <MaterialCommunityIcons name="pencil" size={24} color="black" />;
};

const AddRoutineScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isShortDescriptionFocused, setIsShortDescriptionFocused] = useState(
    false
  );
  const [value, setValue] = useState('empty');
  const [msg, setMsg] = useState();
  const [errorText, setErrorText] = useState();

  const [pressed, setPressed] = useState();
  //const [modalVisible, setModalVisible] = useState(false);
  const [days, setDays] = useState({
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 0,
    0: 0,
  });
  const [times, setTimes] = useState([{ key: 1, hours: 10, minutes: 30 }]);
  const [refresh, setRefresh] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [editing, setIsEditing] = useState(false);
  const [clickedTime, setClickedTime] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [userRoutines, setUserRoutines] = useState([]);

  const controller = useRef(null);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    if (event.type == 'set') {
      //ok button clicked
      if (!editing) {
        addItem(currentDate);
      } else {
        console.log(clickedTime);
        setIsEditing(false);
        //setTimes(times.find(key => key === clicked))
        //ändra times[clicked] till currentDate

        const newTimes = times;
        newTimes[clickedTime].hours = currentDate.getHours();
        newTimes[clickedTime].minutes = currentDate.getMinutes();
        setTimes(newTimes);
        setRefresh(!refresh);
      }
    } else {
      //cancel button clicked
      console.log('Cancel button pressed');
    }
  };

  const showTimepicker = () => {
    setShow(true);
  };

  const createRoutine = () => {
    if (!name.trim()) {
      setMsg('! Please enter a name');
      return;
    } else {
      const document = db
        .collection('Users')
        .doc(user.uid)
        .collection('customRoutines')
        .doc(name);

      document.get().then((doc) => {
        if (doc.exists) {
          setMsg('! Routine name already exists');
        } else {
          if (times.length === 0) {
            setMsg('! Please add a time');
          } else {
            document
              .set({
                routine: name,
                shortDescription: shortDescription,
                days: JSON.stringify(days),
                routineTimes: JSON.stringify(times),
                removed: false,
                StartDate: Date.now(),
              })
              .then(() => {
                console.log('Document successfully written!');
                setModalShow(true);
              })
              .catch((error) => {
                console.error('Catch: Error writing document: ', error);
              })
              .then(() => {
                setName('');
                setShortDescription('');
                setDays({
                  1: 1,
                  2: 1,
                  3: 1,
                  4: 1,
                  5: 1,
                  6: 0,
                  0: 0,
                });
                setTimes([{ key: 1, hours: 10, minutes: 30 }]);
                setMsg('');
              });
          }
        }
      });
    }
  };

  const handleChange = (days) => {
    setDays(days);
  };

  const removeTime = (clicked) => {
    console.log('removed: ' + clicked);
    setRefresh(!refresh);

    const filteredData = times.filter((item, index) => index !== clicked);
    setTimes(filteredData);
  };

  const addItem = (currentDate) => {
    setTimes((previousTimes) => [
      ...previousTimes,
      {
        key: previousTimes.length
          ? previousTimes[previousTimes.length - 1].key + 1
          : 0,
        hours: currentDate.getHours(),
        minutes: currentDate.getMinutes(),
      },
    ]);
    console.log('addItem() ran with times: ' + times[0] + ' ' + days[1]);
    setRefresh(true);
  };
  const checkNumber = (number) => {
    if (number < 10) {
      number = '0' + number.toString();
    }
    return number;
  };

  useEffect(() => {
    getUserRoutines();
  }, []);

  //hämtar namnen på rutinerna och lägger in dom i dropdownpickern
  const getUserRoutines = async () => {
    await db
      .collection('Users')
      .doc(user.uid)
      .collection('customRoutines')
      .get()
      .then((QuerySnapshot) => {
        setUserRoutines([]);
        QuerySnapshot.forEach((doc) => {
          setUserRoutines((oldArray) => [
            ...oldArray,
            {
              label: doc.id,
              value: doc.id,
            },
          ]);
        });
      });
  };

  //kör getRoutineInfo enbart om man ändrar rutin i dropdownpickern (om value-hooken ändrar värde)
  useEffect(() => {
    getRoutineInfo();
  }, [value]);

  //hämtar det valda namnet i dropdownpickern och hämtar fälten för den rutinen
  const getRoutineInfo = () => {
    if (value === 'empty') {
      console.log('value is empty');
    } else {
      db.collection('Users')
        .doc(user.uid)
        .collection('customRoutines')
        .doc(value)
        .get()
        .then((documentSnapshot) => {
          setName(documentSnapshot.id);
          setShortDescription(documentSnapshot.data().shortDescription);
          setDays(JSON.parse(documentSnapshot.data().days));
          setTimes(JSON.parse(documentSnapshot.data().routineTimes));
        });
    }
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
            <TouchableOpacity
              onPress={() => {
                removeTime(times.findIndex((obj) => obj.key === item.key));
              }}
              style={styles.timeListItemContainer}
            >
              <MaterialCommunityIcons
                name="close"
                size={30}
                color={'#F45B69'}
              />
            </TouchableOpacity>
          );
        }}
      >
        <View>
          <TouchableOpacity
            onPress={() => {
              setIsEditing(true);
              setClickedTime(times.findIndex((obj) => obj.key === item.key));
              showTimepicker();
            }}
            style={styles.timeListItemContainer}
          >
            {typeof item != 'undefined' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: colors.darkmodeHighWhite,
                    paddingRight: 8,
                  }}
                >
                  {checkNumber(item.hours) + ':' + checkNumber(item.minutes)}
                </Text>
                <MaterialCommunityIcons
                  name="pencil"
                  size={14}
                  color={colors.darkmodeHighWhite}
                />
              </View>
            ) : null}
            {/* <FontAwesome5
              name="tune"
              size={30}
              color={colors.darkmodeHighWhite}
            /> */}
            <EvilIcons
              name="navicon"
              size={33}
              color={colors.darkmodeHighWhite}
            />
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  return (
    <Screen style={styles.container}>
      <Text style={styles.message}>{msg}</Text>
      <Text style={styles.name}>Create a custom routine</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalShow}
            onRequestClose={() => {
              setModalShow(!modalShow);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Routine created!</Text>
                <AppButton
                  style={[styles.button, styles.buttonClose]}
                  title={'Ok'}
                  onPress={() => setModalShow(!modalShow)}
                ></AppButton>
              </View>
            </View>
          </Modal>
          {/* <DropDownPicker
            items={userRoutines}
            labelStyle={{
              fontSize: 14,
              textAlign: 'left',
              color: colors.darkmodeMediumWhite,
            }}
            placeholder="Edit one of your routines here"
            defaultValue={value}
            containerStyle={{ height: 30 }}
            style={{
              backgroundColor: colors.darkmodeLightBlack,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              borderBottomColor: colors.darkmodeMediumWhite,
              borderTopColor: colors.darkmodeMediumWhite,
              borderStartColor: colors.darkmodeMediumWhite,
              borderEndColor: colors.darkmodeMediumWhite,
            }}
            itemStyle={{
              justifyContent: 'flex-start',
            }}
            dropDownStyle={{
              backgroundColor: colors.darkmodeLightBlack,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              borderBottomColor: colors.darkmodeMediumWhite,
              borderTopColor: colors.darkmodeMediumWhite,
              borderStartColor: colors.darkmodeMediumWhite,
              borderEndColor: colors.darkmodeMediumWhite,
            }}
            controller={(instance) => (controller.current = instance)}
            onChangeList={(items, callback) => {
              Promise.resolve(setUserRoutines(items))
                .then(() => callback())
                .catch(() => {});
            }}
            onChangeItem={
              (i) => setValue(i.value)
              //getRoutineInfo();
            } //det valda itemet
          /> */}
          <View
            style={[
              isNameFocused
                ? {
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.samRed,
                    marginBottom: 12,
                  }
                : {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.darkmodeDisabledBlack,
                    marginBottom: 12,
                  },
            ]}
          >
            <FloatingLabelInput
              isFocused={isNameFocused}
              hint="eg. Morning workout"
              hintTextColor={colors.darkmodeMediumWhite}
              inputStyles={styles.inputStyles}
              customLabelStyles={{
                colorFocused: colors.darkmodeHighWhite,
                colorBlurred: colors.darkmodeMediumWhite,
                fontSizeBlurred: 16,
              }}
              containerStyles={styles.containerStyles}
              onFocus={() => {
                setIsNameFocused(true);
              }}
              onBlur={() => {
                setIsNameFocused(false);
              }}
              label="Routine name"
              leftComponent={
                <View style={{ padding: 12 }}>
                  <FontAwesome
                    name="diamond"
                    size={22}
                    color={
                      isNameFocused
                        ? colors.samRed
                        : colors.darkmodeDisabledBlack
                    }
                  />
                </View>
              }
              rightComponent={
                name != '' ? (
                  <View style={{ padding: 12 }}>
                    <TouchableOpacity
                      style={{ justifyContent: 'center' }}
                      onPress={() => {
                        setName('');
                        setIsNameFocused(false);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="close"
                        size={20}
                        color={colors.darkmodeMediumWhite}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null
              }
              type="text"
              value={name}
              onChangeText={(text) => setName(text)}
              // style={{ color: colors.darkmodeHighWhite, height: 40 }}
            />
          </View>
          <View
            style={[
              isShortDescriptionFocused
                ? {
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.samRed,
                    marginBottom: 20,
                  }
                : {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.darkmodeDisabledBlack,
                    marginBottom: 20,
                  },
            ]}
          >
            <FloatingLabelInput
              isFocused={isShortDescriptionFocused}
              hint="eg. 10 push-ups"
              hintTextColor={colors.darkmodeMediumWhite}
              inputStyles={styles.inputStyles}
              customLabelStyles={{
                colorFocused: colors.darkmodeHighWhite,
                colorBlurred: colors.darkmodeMediumWhite,
                fontSizeBlurred: 16,
              }}
              containerStyles={styles.containerStyles}
              onFocus={() => {
                setIsShortDescriptionFocused(true);
              }}
              onBlur={() => {
                setIsShortDescriptionFocused(false);
              }}
              label="Notes (Optional)"
              leftComponent={
                <View style={{ padding: 12 }}>
                  <FontAwesome
                    name="diamond"
                    size={22}
                    color={
                      isShortDescriptionFocused
                        ? colors.samRed
                        : colors.darkmodeDisabledBlack
                    }
                  />
                </View>
              }
              rightComponent={
                shortDescription != '' ? (
                  <View style={{ padding: 12 }}>
                    <TouchableOpacity
                      style={{ justifyContent: 'center' }}
                      onPress={() => {
                        setShortDescription('');
                        setIsShortDescriptionFocused(false);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="close"
                        size={20}
                        color={colors.darkmodeMediumWhite}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null
              }
              type="text"
              value={shortDescription}
              onChangeText={(text) => setShortDescription(text)}
              // style={{ color: colors.darkmodeHighWhite, height: 40 }}
            />
          </View>

          <Text style={styles.weekText}>Select days:</Text>
          {pressed ? (
            <WeekdayPicker
              days={days}
              onChange={() => {
                handleChange(days);
                setPressed(false);
              }}
              style={styles.picker}
              dayStyle={styles.day}
            />
          ) : (
            <WeekdayPicker
              days={days}
              onChange={() => {
                handleChange(days);
                setPressed(true);
              }}
              style={styles.picker}
              dayStyle={styles.day}
            />
          )}

          <Text style={styles.text}>Times a day:</Text>
          <View>
            <TouchableOpacity
              onPress={() => {
                setIsEditing(false);
                showTimepicker();
              }}
              style={styles.timeListContainerAddButton}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: -8,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.darkmodeHighWhite,
                    paddingRight: 6,
                  }}
                >
                  Add
                </Text>
                <MaterialCommunityIcons
                  name="plus"
                  size={22}
                  color={colors.darkmodeHighWhite}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.timeTitleContainer}>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={onChange}
                />
              )}
            </View>

            <View styles={styles.flatlist}>
              {typeof times != 'undefined' ? (
                <FlatList
                  initialNumToRender={times.length}
                  data={times}
                  renderItem={renderItems}
                  updateCellsBatchingPeriod={0}
                  windowSize={5}
                  extraData={refresh}
                  contentContainerStyle={{ flexGrow: 0 }}
                />
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>
      {name != '' && typeof days != 'undefined' ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            createRoutine();
            getUserRoutines();
          }}
        >
          <Text style={styles.buttonText}>Create Routine</Text>
        </TouchableOpacity>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  button: {
    width: width,
    backgroundColor: '#F45B69',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonText: {
    color: colors.floralWhite,
    fontSize: 18,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  container: {
    paddingTop: 5,
    width: width,
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkmodeLightBlack,
  },
  inputStyles: {
    color: colors.darkmodeHighWhite,
    fontSize: 17,
    paddingTop: 6,
    paddingLeft: 5,
  },
  containerStyles: {
    height: 55,
  },
  flatlist: {
    height: 500,
    flexGrow: 0,
  },
  text: {
    color: colors.darkmodeMediumWhite,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
  picker: {
    margin: 40,
  },

  inputContainer: {
    width: 300,
    marginTop: 20,
  },
  message: {
    color: colors.samRed,
    textAlign: 'center',
    paddingBottom: 2,
    fontSize: 24,
  },
  modalText: {
    //
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    color: colors.darkmodeHighWhite,
  },
  modalView: {
    //
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
  name: {
    marginBottom: 10,
    fontSize: 22,
    color: colors.darkmodeHighWhite,
    fontWeight: '600',
    alignItems: 'center',
  },
  timeTitleContainer: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeListItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.darkmodeDisabledBlack,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  timeListContainerAddButton: {
    borderBottomWidth: 1,
    borderBottomColor: colors.darkmodeDisabledBlack,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 50,
    width: '105%',
  },
  weekText: {
    color: colors.darkmodeMediumWhite,
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
});

AddRoutineScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default AddRoutineScreen;

// TODO:
//  manage custom routines?
//  if routine name already exists?
//  auto increment times a day by an hour
//
//  keyboard:
//    smoother keyboard
//    input keeps being focused after hiding keyboard
//
//  scrollview only on flatlist?
//  default no days selected
//  color picker
//  add some vector background for color
//  three lines on press = open swipeable?
