/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();
const proofHubApiKey = "51fe151c00e53030a107b433b7da61337cb9192f";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const createUser = functions.auth.user().onCreate((user) => {
  const { uid, email, displayName } = user;

  return admin.firestore().collection("users").doc(uid).set({
    email: email,
    name: displayName,
  });
});

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const getProofHubTasks = functions.https.onRequest(
  async (request, response) => {
    return await getPendingTasks();
  }
);

async function getPendingTasks() {
  try {
    const projects = await getProjects();

    const tasksArray = await Promise.all(
      projects.map(async (project) => {
        const tasks = await getTasks(project.id);
        return tasks;
      })
    );

    // Utilizamos flat para aplanar el arreglo multidimensional
    // de tareas obtenidas de cada proyecto
    const pendingTasks = tasksArray.flat();

    return pendingTasks;
  } catch (error) {
    console.error(error);
  }
}

async function getProjects() {
  const url = "https://api.proofhub.com/v3/projects";

  const headers = {
    Authorization: `Bearer ${proofHubApiKey}`,
  };

  const response = await axios.get(url, { headers });

  return response.data;
}

async function getTasks(projectId: string) {
  const url = `https://api.proofhub.com/v3/projects/${projectId}/tasks?completed=false`;

  const headers = {
    Authorization: `Bearer ${proofHubApiKey}`,
  };

  const response = await axios.get(url, { headers });

  return response.data.tasks;
}
