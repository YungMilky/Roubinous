import React, { useState, useEffect } from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import Screen from "../components/Screen";
import PropTypes from "prop-types";
import { Input, Button } from "react-native-elements";
import { db, auth } from "../firebase";

const SettingScreen = ({ navigation }) => {
  const [name, setName] = useState();
  const [newUsername, setNewusername] = useState();
  const user = auth.currentUser;

  useEffect(() => {
    console.log(newUsername);

    db.collection("Users")
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        setName(documentSnapshot.get("Name"));
      });
  }, [newUsername]);

  function changeUsername() {
    db.collection("Users").doc(user.uid).update({
      Name: newUsername,
    });
  }

  function deleteAccount() {
    db.collection("Users").doc(user.uid).delete();
    setTimeout(() => {
      auth.signOut();
    }, 5000);
    auth.currentUser.delete();
  }

  return (
    <Screen style={styles.container}>
      <Text style={styles.text}> Settings </Text>
      <Input placeholder={name} onChangeText={(text) => setNewusername(text)} />
      <Button
        style={styles.button}
        title="Change username"
        onPress={changeUsername}
      />
      <Button
        style={styles.button}
        title={"Delete my account"}
        onPress={deleteAccount}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D7FDFF",
    flex: 1,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
    width: 200,
    height: 50,
  },
  text: {
    fontSize: 40,
  },
});

SettingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default SettingScreen;
