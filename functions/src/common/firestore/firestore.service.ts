/* eslint-disable require-jsdoc */
import * as admin from "firebase-admin";
import {initializeApp} from "firebase-admin";


let app: ReturnType<typeof initializeApp>;

export function getFirestore() {
  if (!app && !admin.apps.length) {
    try {
      admin.initializeApp();

      const db = admin.firestore();
      db.settings({ignoreUndefinedProperties: true});
      return db;
    } catch (error) {
      console.error(error);
    }
  }
  return admin.firestore();
}

