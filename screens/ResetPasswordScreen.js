
import React from 'react';
import { View, Text, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useState } from 'react';

import { auth, db } from "../firebase";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// import { auth } from '../firebase';


const ResetPasswordScreen =  ({ navigation }) => {
  const [email, setEmail] = useState('');
  
  const passwordResetMail = () => {
    auth
    .sendPasswordResetEmail(email)
    .then(() => {
      alert('Email has been sent, please check inbox'),
      navigation.navigate ('Login', {screen: 'Login' });
    })
    .catch((error) => alert(error.message));
  };






//   const email (input från textfield)

//   auth.sendPasswordResetEmail(email)
//   .then() =>
//   console.log("Mail has been sent");
//   ))
//   .catch((error) => alert(error.message));
// };
  
//  var auth = db.auth();
// var emailAddress = "user@example.com";

// auth.sendPasswordResetEmail(emailAddress).then(function() {
//   // Email sent.
// }).catch(function(error) {
//   // An error happened.
// });


// handlePasswordReset = async (values, actions) => {
//   const { email } = values

//   try {
//     await this.props.firebase.passwordReset(email)
//     console.log('Password reset email sent successfully')
//     this.props.navigation.navigate('Login')
//   } catch (error) {
//     actions.setFieldError('general', error.message)
//   }
// }

    return (
        
        <View style={styles.container}>
           <View style={styles.inputContainer}>
          <Text> Forgot password</Text>
          <Input 
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          />
          <Button 
          style={styles.button} 
          title='Send Email'
          onPress={passwordResetMail} 
           />
          </View>
        </View>
      
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    width: 300,
    margin: 20,
  },

  inputContainer: {
    width: 300,
  },
});

// ResetPasswordScreen.propTypes = {
//   navigation: PropTypes.object.isRequired,
// };

export default ResetPasswordScreen;