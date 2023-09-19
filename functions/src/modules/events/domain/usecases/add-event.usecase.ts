/* eslint-disable require-jsdoc */
import {inject, injectable} from "tsyringe";
import {Event} from "../entities";

import {EventRepository} from "../repositories/event.repository";

/**
 * Use case for adding an event to the repository.
 */
@injectable()
export class AddEventUseCase {
  /**
   * Creates a new instance of the AddEventUseCase use case.
   * @param {EventRepository} eventRepository The repository to add the
   * event to.
   */
  constructor(
    @inject("EventRepository") private readonly eventRepository:
      EventRepository,
  ) { }

  /**
   * Executes the AddEventUseCase use case.
   * @param {Event} event The event to add to the repository.
   * @param {string} uid The user ID to associate with the event.
   * @return {Promise<void>} A Promise that resolves when the event
   * has been added to the repository.
   */
  async execute(event: Event, uid: string): Promise<void> {
    await this.eventRepository.add([event], uid);
  }
}
