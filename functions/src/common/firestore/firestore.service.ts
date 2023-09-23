/* eslint-disable require-jsdoc */
import * as admin from "firebase-admin";
import { Firestore } from "firebase-admin/firestore";

export function getFirestore(): Firestore {
  admin.initializeApp();

  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}
