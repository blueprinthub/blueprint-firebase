import { container } from "tsyringe";
import * as functions from "firebase-functions";
import { AddTaskViaApiKey } from "../../infrastructure/controllers/add-task.controller";
import { withMiddlewares } from "../../../../access/http/middleware/apply-middlewares";
import { ApiKeyCurrentUser } from "../../../../access/api-key/api-key.middleware";

const controller = container.resolve(AddTaskViaApiKey);

const addTask = withMiddlewares(ApiKeyCurrentUser)(async (req, res) => {
  return controller.execute(req, res);
});

const webhook = functions.https.onRequest(async (req, res) => {
  console.log(req);
});

export default { addTask, webhook };
