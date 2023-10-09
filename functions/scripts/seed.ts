import * as admin from "firebase-admin";

process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
process.env.GCLOUD_PROJECT = "polletask-dev";

admin.initializeApp();

const seedFirestore = async () => {
  const db = admin.firestore();

  const platforms = [
    {
      auth: {
        type: "oauth2",
        url: "https://auth.atlassian.com/authorize?audience=api.atlassian.jcom&client_id=go6jWIm4a4CI09cNNGqdI7swLJuawOXu&scope=read:me%20offline_access%20read:jira-work%20read:jira-user%20write:jira-work%20manage:jira-webhook&redirect_uri=http://localhost:3000/integrations/jira/create&state=120384019238401923840129384&response_type=code&prompt=consent",
      },
      description: "Jira",
      iconUrl: "https://static-00.iconduck.com/assets.00/jira-icon-512x512-kkop6eik.png",
      id: "jira",
      name: "Jira",
      type: "task",
    },
    {
      auth: {
        type: "oauth2",
        url: "https://github.com/login/oauth/authorize?scope=user,repo&client_id=55a08be7f48b99c70fe1",
      },
      description: "Github",
      iconUrl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      id: "github",
      name: "Github",
      type: "task",
    },
  ];

  // save platforms
  await db.collection("platforms").doc("jira").set(platforms[0]);
  await db.collection("platforms").doc("github").set(platforms[1]);
};

seedFirestore();
