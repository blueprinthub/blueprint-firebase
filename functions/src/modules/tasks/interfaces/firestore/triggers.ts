import {container} from "tsyringe";
import * as functions from "firebase-functions";
import {
  PullTasksController,
} from "../../infrastructure/controllers/pull-tasks.controller";
import {Access, AuthenticatorType}
  from "../../../authenticators/domain/entities";

const controller = container.resolve(PullTasksController);

const clone = functions
  .firestore
  .document("users/{uid}/authenticators/{authenticatorId}")
  .onCreate(
    async (change, context) => {
      const authenticatorData = change.data() as Access;

      const type = authenticatorData.type;
      if (type == AuthenticatorType.Task) {
        return await controller.execute(change, context);
      }
    }
  );

export default {clone};
