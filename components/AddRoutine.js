import { auth, db } from "../firebase";

//  Just add routine fields as props when
//  we've decided on the logic for them

export default (title) => {
  const userID = auth.currentUser.uid;

  const userRoutines = db
    .collection("Users")
    .doc(userID)
    .collection("routines");

  console.log(userRoutines.doc(title).exists);

  // .set(
  //   {
  //     ComboFrequency: "2",
  //     DaysInCombo: 2,
  //     StartDate: new Date(),
  //     UserAlertTime: 7,
  //     UserRoutineRank: "Rookie",
  //   },
  //   { merge: true }
  // );
};
