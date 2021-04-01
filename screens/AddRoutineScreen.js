import React, { useState } from "react";
import { StyleSheet, Text, View,  } from 'react-native'
import { Input, Button } from 'react-native-elements';
import colors from '../config/colors';
import PropTypes from 'prop-types';
import { db, auth } from "../firebase";




    const AddRoutineScreen = ({ navigation }) => {
        const user = auth.currentUser;
        const [name, setName] = useState('');

    const createRoutine = () => {
        db.collection("Users").doc(user.uid).update({
            routine: name, 
        })
        .then(() => {
            navigation.navigate('Routines'), {screen: Routines};
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
     })};
     
    return (
    <View style={styles.container}>
        <Text style={styles.name}> Create a habit </Text>
    <View style={styles.inputContainer}>
        <Input
          placeholder="Read a book, floss etc..."
          type="text"
          value={name}
          onChangeText={(text) => setName(text)}
        />
    </View>
        <Button
        style={styles.button}
        title="Add routine"
        onPress={createRoutine}
        />
        </View>
    )
}

const styles = StyleSheet.create({
    
    button: {
      width: 200,
      margin: 20,
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
          alignItems: 'center'
          
        },
    });
    
    AddRoutineScreen.propTypes = {
      navigation: PropTypes.object.isRequired,
    };

    export default AddRoutineScreen;