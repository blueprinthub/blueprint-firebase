import { container } from "tsyringe";
import * as functions from "firebase-functions";
import { PullTasksController } from "../../infrastructure/controllers/pull-tasks.controller";

const controller = container.resolve(PullTasksController);

const clone = functions.firestore
  .document("users/{uid}/authenticators/{authenticatorId}")
  .onCreate(async (change, context) => {
    return controller.execute(change, context);
  });

export default { clone };
