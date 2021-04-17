// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBnyQjm-yBdKJgjsgV87U_yPtb3_SPJ1Uc",
  authDomain: "roubine-effd8.firebaseapp.com",
  projectId: "roubine-effd8",
  storageBucket: "roubine-effd8.appspot.com",
  messagingSenderId: "76622542301",
  appId: "1:76622542301:android:a0b152d6a310393dcd3234",
  measurementId: "G-Y45R3FEY4Y",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

//database access variable
const db = app.firestore();

//authentication variable
const auth = firebase.auth();

//storage variable
const cloud = firebase.storage();

//FieldValue
const fv = firebase.firestore;

export { db, auth, cloud, fv };

// const googleProvider = new firebase.auth.GoogleAuthProvider();
// export const signInWithGoogle = () => {
//   auth
//     .signInWithPopup(googleProvider)
//     .then((res) => {
//       console.log(res.user);
//     })
//     .catch((error) => {
//       console.log(error.message);
//     });
// };

// const FacebookProvider = new firebase.auth.FacebookAuthProvider();
// export const signInWithFacebook = () => {
//   auth
//     .signInWithPopup(FacebookProvider)
//     .then((res) => {
//       console.log(res.user);
//     })
//     .catch((error) => {
//       console.log(error.message);
//     });
// };
