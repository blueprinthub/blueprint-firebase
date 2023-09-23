/* eslint-disable require-jsdoc */
import { injectable } from "tsyringe";
import * as functions from "firebase-functions";
import { AddTask } from "../../domain/usecases/add-task.usecase";

/**
 * Controller for adding a task via API key. This implementation is
 * used for external integrations via API, not ideally for the
 * Blueprint client. Ideally this is for integrations like Zapier or
 * any other 3rd party automation app.
 */
@injectable()
export class AddTaskViaApiKey {
  constructor(public add: AddTask) {}

  async execute(req: functions.Request, res: functions.Response) {
    const uid = req.headers.uid as string;
    await this.add.execute(req.body, uid);
    res.json();
  }
}
