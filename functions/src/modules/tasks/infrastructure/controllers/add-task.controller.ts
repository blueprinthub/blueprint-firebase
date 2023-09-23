/* eslint-disable require-jsdoc */
import { injectable } from "tsyringe";
import * as functions from "firebase-functions";
import { AddTask } from "../../domain/usecases/add-task.usecase";

@injectable()
export class AddTaskViaApiKey {
  constructor(public add: AddTask) {}

  async execute(req: functions.Request, res: functions.Response) {
    const uid = req.headers.uid as string;
    await this.add.execute(req.body, uid);
    res.json();
  }
}
