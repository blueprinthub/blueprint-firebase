import { Firestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { container } from "tsyringe";
import { ApiKeyCurrentUser } from "../../access/api-key/api-key.middleware";
import { ApiKeyService } from "../../access/api-key/api-key.service";
import { withMiddlewares } from "../../access/http/middleware/apply-middlewares";

const firestore = container.resolve<Firestore>("firestore");
const apiKeyService = container.resolve<ApiKeyService>("api-key");

const createAfterSignUp = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;

  await firestore.collection("users").doc(uid).set({
    email,
    photoURL,
    displayName,
  });
});

const createApiKey = functions.https.onCall(async (_, context) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { uid } = context!.auth!;
  const key = await apiKeyService.generateUserKey(uid);
  return { key };
});

const getByKey = withMiddlewares(ApiKeyCurrentUser)(async (req, res) => {
  const { uid } = req.headers;
  res.json({ uid });
});

export default {
  createAfterSignUp,
  createApiKey,
  getByKey,
};
