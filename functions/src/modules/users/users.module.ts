import {Firestore} from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import {container} from "tsyringe";

const firestore = container.resolve<Firestore>("firestore");

const createAfterSignUp = functions.auth.user().onCreate(async (user) => {
  const {uid, email, displayName, photoURL} = user;

  await firestore.collection("users").doc(uid).set({
    email,
    photoURL,
    displayName,
  });
});

export default {
  createAfterSignUp,
};
