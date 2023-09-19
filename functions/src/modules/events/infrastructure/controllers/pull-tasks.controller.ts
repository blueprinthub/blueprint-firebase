
import {injectable} from "tsyringe";
import * as functions from "firebase-functions";
import {PullEventsUseCase} from "../../domain/usecases/pull-events.usecase";

/**
 * The context for the pull events controller.
 * @property {string} uid The user ID to pull events for.
 * @property {string} authenticatorId The authenticator ID to use for
 */
type PullTasksContext = {
  uid: string;
  authenticatorId: string
}

@injectable()
/**
 * Controller for pulling events from a remote repository and adding
 * them to a local database
 */
export class PullEventsController {
  /**
   * Creates a new instance of the PullEventsController class.
   * @param {PullEventsUseCase} pullEventsUseCase The use case for
   *  pulling events.
   */
  constructor(public pullEventsUseCase: PullEventsUseCase) { }

  /**
   * Executes the controller by pulling events from the remote repository
   * and adding them to the local repository.
   * @param {functions.firestore.QueryDocumentSnapshot} snapshot The Firestore
   * query document snapshot.
   * @param {functions.EventContext<PullTasksContext>} context The Firebase
   * event context.
   * @return {Promise<void>} A Promise that resolves when the events have been
   * added to the local repository.
   */
  async execute(snapshot: functions.firestore.QueryDocumentSnapshot,
    context: functions.EventContext<PullTasksContext>): Promise<void> {
    const {uid, authenticatorId} = context.params;
    const {platformName} = snapshot.data();

    await this.pullEventsUseCase.execute(platformName, uid, authenticatorId);
  }
}
