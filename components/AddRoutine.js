import { auth, db, db1 } from "../firebase";
import firebase from 'firebase/app';


//  Just add routine fields as props when
//  we've decided on the logic for them


// const db1 = firebase.firestore();


// Update read count



export default (title) => {

  const increment = firebase.firestore.FieldValue.increment(50);
  // const increment = db.FieldValue.increment(50);
  // // Document reference
  const userID = auth.currentUser.uid;
  console.log(userID);
  const roubineRef = db.collection('Users').doc(userID);

  const userRoutines = db
    .collection("Users")
    .doc(userID)
    .collection("Routines");

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
        roubineRef.update({ Roubies: increment });
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
