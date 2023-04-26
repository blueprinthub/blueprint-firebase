import {container} from "tsyringe";
import * as functions from "firebase-functions";
import {Firestore} from "firebase-admin/firestore";

const firestore:Firestore = container.resolve("firestore");

const createTask = functions.https.onRequest(async (req, res) => {
  const apiKey = req.query.api_key || "";
  const {name, description} = req.body;
  console.log({apiKey});
  const queryResult = await firestore
    .collection("users")
    .where("apiKey", "==", apiKey)
    .get();

  const userRef = queryResult.docs[0].ref;

  await userRef.collection("tasks").add({
    name,
    description,
  });

  res.sendStatus(200);
});

const me = functions.https.onRequest(async (req, res) => {
  const apiKey = req.query.api_key || "";
  console.log({apiKey});
  const queryResult = await firestore
    .collection("users")
    .where("apiKey", "==", apiKey)
    .get();

  const user = queryResult.docs[0];

  console.log({user});
  if (!user) {
    res.sendStatus(401);
  } else {
    console.log(user.data);
    res.json(user.data());
  }
});

export default {
  me,
  createTask,
};
