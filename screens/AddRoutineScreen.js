import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
  TouchableOpacity,
  Button,
} from 'react-native';
import { Input } from 'react-native-elements';
import PropTypes from 'prop-types';
import { db, auth } from '../firebase';
import WeekdayPicker from 'react-native-weekday-picker';
import colors from '../config/colors';
import AppButton from '../components/AppButton';

const AddRoutineScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [pressed, setPressed] = useState();
  const [note, setNote] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [days, setDays] = useState({
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 0,
    0: 0,
  });
  const [selectedDays, setSelectedDays] = useState(false);

  const createRoutine = () => {
    db.collection('Users')
      .doc(user.uid)
      .collection('Routines')
      .doc(name)
      .set({
        routine: name,
        note: note,
      })
      .then(() => {
        navigation.navigate('Routines'), { screen: 'Routines' };
        console.log('Document successfully written!');
      })
      .catch((error) => {
        console.error('Catch: Error writing document: ', error);
      });
  };

  const handleChange = (days) => {
    setDays(days);
    console.log(days);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select days:</Text>
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

            <Button
              style={[styles.button, styles.buttonClose]}
              title="Im done"
              onPress={() => setModalVisible(!modalVisible)}
            />
          </View>
        </View>
      </Modal>
      <Text style={styles.name}> Create a habit </Text>
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
        <AppButton title="Select days" onPress={() => setModalVisible(true)} />
      </View>
      <AppButton
        style={styles.button}
        title="Add routine"
        onPress={createRoutine}
      />
    </View>
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
  modalText: {
    marginBottom: 20,
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
});

AddRoutineScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default AddRoutineScreen;
