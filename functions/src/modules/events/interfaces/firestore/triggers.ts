import { container } from "tsyringe";
import * as functions from "firebase-functions";
import { Access, AuthenticatorType } from "../../../authenticators/domain/entities";
import { PullEventsController } from "../../infrastructure/controllers/pull-events.controller";

const pullEvents = container.resolve(PullEventsController);

const clone = functions.firestore
  .document("users/{uid}/authenticators/{authenticatorId}")
  .onCreate(async (change, context) => {
    const authenticatorData = change.data() as Access;

    const type = authenticatorData.type;
    if (type == AuthenticatorType.Event) {
      return await pullEvents.execute(change, context);
    }
  });

export default { clone };
