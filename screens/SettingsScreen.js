import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { Input } from 'react-native-elements';
import { db, auth } from '../firebase';

import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import colors from '../config/colors';
import CancelAllNotifications from '../components/notification/CancelAllNotifications';

const SettingsScreen = ({ navigation }) => {
  const [name, setName] = useState();
  const [newUsername, setNewusername] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [inputError, setInputError] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    db.collection('Users')
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        setName(documentSnapshot.get('Name'));
      });
  }, [newUsername]);

  function changeUsername() {
    if (!newUsername.trim()) {
      alert('Please Enter a new Name');
      return;
    } else {
      db.collection('Users').doc(user.uid).update({
        Name: newUsername,
      });
      setNewusername('');
    }
  }
  function deleteAccount() {
    db.collection('Users').doc(user.uid).delete();
    setTimeout(() => {
      auth.signOut();
    }, 5000);
    auth.currentUser.delete();
  }
  const signOutUser = () => {
    CancelAllNotifications();
    auth.signOut().then(() => {
      setTimeout(() => navigation.navigate('Welcome'), 0);
    });
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.container}>
        <AppButton
          style={styles.button}
          title={'Notification Settings'}
          onPress={() =>
            navigation.navigate('Notification Settings', {
              screen: 'Notification Settings',
            })
          }
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={nameModalVisible}
          onRequestClose={() => {
            setNameModalVisible(!nameModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Change Username:</Text>
              <Input
                style={styles.input}
                placeholder={name}
                onChangeText={(text) => setNewusername(text)}
              />
              <Text style={styles.errorText}>{inputError}</Text>
              <AppButton
                style={styles.button}
                title="Change username"
                onPress={changeUsername}
              />
              <AppButton
                style={[styles.button, styles.buttonClose]}
                title={'Cancel'}
                onPress={() => setNameModalVisible(!nameModalVisible)}
              ></AppButton>
            </View>
          </View>
        </Modal>
        <AppButton
          style={styles.button}
          title="Change username"
          onPress={() => setNameModalVisible(true)}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={deleteModalVisible}
          onRequestClose={() => {
            setDeleteModalVisible(!deleteModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Are you sure you want to delete your account?
              </Text>
              <AppButton
                style={styles.button}
                title={'Delete'}
                onPress={deleteAccount}
              />
              <AppButton
                style={[styles.button, styles.buttonClose]}
                title={'Cancel'}
                onPress={() => setDeleteModalVisible(!deleteModalVisible)}
              ></AppButton>
            </View>
          </View>
        </Modal>
        <AppButton
          style={[styles.button, styles.buttonOpen]}
          title={'Delete account'}
          onPress={() => setDeleteModalVisible(true)}
        ></AppButton>
        <Modal
          animationType="fade"
          transparent={true}
          visible={logoutModalVisible}
          onRequestClose={() => {
            setLogoutModalVisible(!logoutModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Log Out?</Text>
              <AppButton
                style={styles.button}
                title={'Yes'}
                onPress={signOutUser}
              />
              <AppButton
                style={[styles.button, styles.buttonClose]}
                title={'No'}
                onPress={() => setLogoutModalVisible(!logoutModalVisible)}
              ></AppButton>
            </View>
          </View>
        </Modal>
        <AppButton
          style={styles.button}
          title={'Log Out'}
          onPress={() => setLogoutModalVisible(!logoutModalVisible)}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    width: 200,
    height: 50,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
  },
  input: {
    width: '60%',
    color: colors.darkmodeHighWhite,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    paddingBottom: 20,
  },

  centeredView: {
    //
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

SettingsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default SettingsScreen;
