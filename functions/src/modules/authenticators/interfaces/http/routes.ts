import { container } from "tsyringe";
import * as functions from "firebase-functions";
import { ConnectController } from "../../infrastructure/controllers/connect.controller";

const controller = container.resolve(ConnectController);

const connect = functions.https.onCall(async (data, context) => {
  return controller.execute(data, context);
});

export default { connect };
