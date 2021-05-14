import { auth, db, db1 } from '../firebase';
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

  let routineDifficulty = 1;
  db.collection('Routines')
    .doc(title)
    .get()
    .then((doc) => {
      routineDifficulty = doc?.data()?.DifficultyRank;
    });

  const roubineRef = db.collection('Users').doc(userID);

  const userRoutines = db
    .collection('Users')
    .doc(userID)
    .collection('routines');

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
        roubineRef.update({ Roubies: increment, Exp: increment });
        userRoutines.doc(title).set(
          {
            ComboFrequency: '2',
            DaysInCombo: 2,
            StartDate: new Date(),
            UserAlertTime: 7,
            days: '{"0":0,"1":1,"2":1,"3":1,"4":1,"5":1,"6":0}',
            routineTimes: '[{"key":1,"hours":10,"minutes":30,"isDone":false}]',
            UserRoutineRank: 'Rookie',
            removed: false,
            RoutineDifficulty: routineDifficulty,
          },
          { merge: true }
        );
      }
    });
};
