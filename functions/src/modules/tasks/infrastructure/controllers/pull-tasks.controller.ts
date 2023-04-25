/* eslint-disable require-jsdoc */
import {injectable} from "tsyringe";
import {PullTasks} from "../../domain/usecases/pull-tasks.usecase";
import * as functions from "firebase-functions";

type PullTasksContext={
  uid:string;
  authenticatorId:string
}

@injectable()
export class PullTasksController {
  constructor(public pull:PullTasks) {}

  async execute(change:functions.firestore.QueryDocumentSnapshot,
    context:functions.EventContext<PullTasksContext>) {
    const {uid, authenticatorId} = context.params;
    const {platformName} = change.data();

    await this.pull.execute(platformName, uid, authenticatorId);
  }
}
