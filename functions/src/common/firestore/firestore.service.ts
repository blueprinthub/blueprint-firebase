/* eslint-disable require-jsdoc */
import * as admin from "firebase-admin";

export function getFirestore() {
  admin.initializeApp();

  const db = admin.firestore();
  db.settings({ignoreUndefinedProperties: true});
  return db;
}

