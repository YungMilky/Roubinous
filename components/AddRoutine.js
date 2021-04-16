import { auth, db } from "../firebase";
import firebase from "firebase/app";

//  Just add routine fields as props when
//  we've decided on the logic for them

const increment = firebase.firestore.FieldValue.increment(50);

export default (title) => {
  const userID = auth.currentUser.uid;
  console.log(userID);

  const roubineRef = db.collection("Users").doc(userID);
  roubineRef.update({ Roubies: increment });

  const userRoutines = db
    .collection("Users")
    .doc(userID)
    .collection("routines");

  userRoutines
    .doc(title)
    .get()
    .then((documentSnapshot) => {
      //  if document exists, set removed to false
      //  else, add brand new routine data
      if (documentSnapshot.exists) {
        userRoutines.doc(title).update({
          removed: false,
        });
      } else {
        userRoutines.doc(title).set(
          {
            ComboFrequency: "2",
            DaysInCombo: 2,
            StartDate: new Date(),
            UserAlertTime: 7,
            UserRoutineRank: "Rookie",
            removed: false,
          },
          { merge: true }
        );
      }
    });
};
