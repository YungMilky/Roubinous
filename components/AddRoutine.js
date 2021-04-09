import { auth, db } from "../firebase";

//  Just add routine fields as props when
//  we've decided on the logic for them

export default (title) => {
  const userID = auth.currentUser.uid;

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
