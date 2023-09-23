import { injectable } from "tsyringe";
import * as functions from "firebase-functions";
import { AddEventUseCase } from "../../domain/usecases/add-event.usecase";

@injectable()
/**
 * Controller for adding events via an API key.
 */
export class AddEventViaApiKeyController {
  /**
   * Creates a new instance of the AddEventViaApiKeyController class.
   * @param {AddEventUseCase} addEventUseCase The use case for adding events.
   */
  constructor(public addEventUseCase: AddEventUseCase) {}

  /**
   * Executes the controller by calling the use case to add the event.
   * @param {functions.Request} req The HTTP request object.
   * @param {functions.Response} res The HTTP response object.
   * @return {Promise<void>}A Promise that resolves when the event has
   * been added to the system.
   */
  async execute(req: functions.Request, res: functions.Response): Promise<void> {
    const uid = req.headers.uid as string;
    await this.addEventUseCase.execute(req.body, uid);
    res.json();
  }
}
