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
} from 'react-native';
import { Input } from 'react-native-elements';
import PropTypes from 'prop-types';
import { db, auth } from '../firebase';
import WeekdayPicker from 'react-native-weekday-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

import colors from '../config/colors';
import AppButton from '../components/AppButton';
import Screen from '../components/Screen';

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

    if (!editing) {
      addItem(currentDate);
    } else {
      console.log(clickedTime);
      setIsEditing(false);
      //setTimes(times.find(key => key === clicked))
      //ändra times[clicked] till currentDate

      const newTimes = times;
      newTimes[clickedTime - 1].hours = currentDate.getHours();
      newTimes[clickedTime - 1].minutes = currentDate.getMinutes();
      setTimes(newTimes);
      setRefresh(!refresh);
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

  // const addTimes = (currentTimes) => {
  //   setTimes((previousTimes) => [
  //     ...previousTimes,
  //     {
  //       hours: currentTimes.getHours(),
  //       minutes: currentTimes.getMinutes(),
  //     },
  //   ]);
  // };

  const addItem = (currentDate) => {
    setTimes((previousTimes) => [
      ...previousTimes,
      {
        key: previousTimes[previousTimes.length - 1].key + 1,
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
      <View style={styles.timeContainer}>
        <TouchableOpacity
          onPress={() => {
            setIsEditing(true);
            setClickedTime(item.key);
            showTimepicker();
          }}
          style={styles.timeContainer}
        >
          <Text>
            {typeof item != 'undefined'
              ? checkNumber(item.hours) + ':' + checkNumber(item.minutes)
              : null}{' '}
          </Text>
          <MaterialCommunityIcons name="cog" size={30} color={colors.samRed} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView>
      <Screen style={styles.container}>
        <Text style={styles.name}>Create a Custom Routine:</Text>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Name: Morning workout"
            type="text"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Input
            placeholder="Notes (Optional): 10 pushups"
            type="text"
            value={note}
            onChangeText={(text) => setNote(text)}
          />
          <Text style={styles.text}>Select days:</Text>
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

          <View style={styles.timeContainer}>
            <Text>Times a day:</Text>
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
                color={colors.samRed}
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

        <AppButton
          style={styles.button}
          title="Add routine"
          onPress={createRoutine}
        />
      </Screen>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 200,
    margin: 20,
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
  flatlist: {
    height: 200,
  },
  text: {
    marginBottom: 20,
    textAlign: 'center',
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputContainer: {
    width: 300,
    marginTop: 20,
  },

  name: {
    fontSize: 22,
    color: colors.samBlack,
    fontWeight: '600',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

AddRoutineScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default AddRoutineScreen;
