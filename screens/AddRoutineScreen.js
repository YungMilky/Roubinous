import React, { useState, useEffect } from 'react';
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
import { MaterialCommunityIcons, Entypo, EvilIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { Swipeable } from 'react-native-gesture-handler';
import { FloatingLabelInput } from 'react-native-floating-label-input';

import colors from '../config/colors';
import AppButton from '../components/AppButton';
import Screen from '../components/Screen';

const width = Dimensions.get('window').width;

const AddRoutineScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [pressed, setPressed] = useState();
  const [note, setNote] = useState('');
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
      alert('Please Enter a Name');
      return;
    } else {
      db.collection('Users')
        .doc(user.uid)
        .collection('routines')
        .doc(name)
        .set({
          routine: name,
          note: note,
          days: JSON.stringify(days),
          routineTimes: JSON.stringify(times),
        })
        .then(() => {
          console.log('Document successfully written!');
          alert('Routine Created!');
        })
        .catch((error) => {
          console.error('Catch: Error writing document: ', error);
        });
    }
  };

  const handleChange = (days) => {
    setDays(days);
  };

  const removeTime = (clicked) => {
    console.log('remove' + clicked);
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
    console.log('addItem() ran with times: ' + times);
    setRefresh(true);
  };
  const checkNumber = (number) => {
    if (number < 10) {
      number = '0' + number.toString();
    }
    return number;
  };

  let renderItems = ({ item }) => {
    //console.log('times: ' + item);
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
              style={styles.timeContainer}
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
        <View style={styles.Container}>
          <TouchableOpacity
            onPress={() => {
              setIsEditing(true);
              setClickedTime(times.findIndex((obj) => obj.key === item.key));
              showTimepicker();
            }}
            style={styles.timeListContainer}
          >
            <Text style={{ fontSize: 22, color: colors.darkmodeHighWhite }}>
              {typeof item != 'undefined'
                ? checkNumber(item.hours) + ':' + checkNumber(item.minutes)
                : null}{' '}
            </Text>
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
      <ScrollView>
        <Text style={styles.name}>Create a Custom Routine:</Text>
        <View style={styles.inputContainer}>
          <FloatingLabelInput
            inputContainerStyle={{
              backgroundColor: colors.darkmodeFocused,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            }}
            placeholder="eg. Morning workout"
            leftIcon={{
              type: 'font-awesome',
              name: 'diamond',
              color: colors.samRed,
            }}
            type="text"
            value={name}
            onChangeText={(text) => setName(text)}
            style={{ color: colors.floralWhite, height: 40 }}
          />
          <Input
            placeholder="Notes (Optional): 10 pushups"
            leftIcon={{
              type: 'font-awesome',
              name: 'diamond',
              color: colors.samRed,
            }}
            type="text"
            value={note}
            onChangeText={(text) => setNote(text)}
            style={{ color: colors.floralWhite }}
          />
          <Text style={styles.text}>Select days:</Text>
          {pressed ? (
            <WeekdayPicker
              dayStyle={{ backgroundColor: 'blue' }}
              style={styles.picker}
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

          <View style={styles.timeTitleContainer}>
            <Text style={styles.text}>Times a day:</Text>
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
            <TouchableOpacity
              onPress={() => {
                setIsEditing(false);
                showTimepicker();
              }}
            >
              <MaterialCommunityIcons
                name="plus"
                size={30}
                color={colors.darkmodeHighWhite}
              />
            </TouchableOpacity>
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
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
      {/* <AppButton
        style={styles.button}
        title="Add routine"
        onPress={createRoutine}
      /> */}
      <TouchableOpacity style={styles.button} onPress={createRoutine}>
        <Text style={styles.buttonText}>Add Routine</Text>
      </TouchableOpacity>
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
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkmodeBlack,
  },
  flatlist: {
    height: 200,
  },
  text: {
    color: colors.darkmodeHighWhite,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
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
  picker: {
    marginBottom: 20,
  },

  inputContainer: {
    width: 300,
    marginTop: 20,
  },

  name: {
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
  timeListContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.darkmodeDisabledBlack,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
});

AddRoutineScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default AddRoutineScreen;
