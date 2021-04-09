import { auth, db } from "../firebase";

export default (title) => {
  const userID = auth.currentUser.uid;

  const userRoutines = db
    .collection("Users")
    .doc(userID)
    .collection("routines");
  console.log(title);
  userRoutines
    .doc(title)
    .get()
    .then((documentSnapshot) => {
      //  if document exists, set removed to true
      if (documentSnapshot.exists) {
        userRoutines.doc(title).update({
          removed: true,
        });
      }
    });
};
