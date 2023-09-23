/* eslint-disable require-jsdoc */
import { inject, injectable } from "tsyringe";
import { Event } from "../entities";

import { EventLocalRepository } from "../repositories/local/event.local.repository";

/**
 * Use case for adding an event to the repository.
 */
@injectable()
export class AddEventUseCase {
  /**
   * Creates a new instance of the AddEventUseCase use case.
   * @param {EventLocalRepository} eventLocalRepository The repository
   * to add the event to.
   */
  constructor(@inject("EventLocalRepository") private readonly eventLocalRepository: EventLocalRepository) {}

  /**
   * Executes the AddEventUseCase use case.
   * @param {Event} event The event to add to the repository.
   * @param {string} uid The user ID to associate with the event.
   * @return {Promise<void>} A Promise that resolves when the event
   * has been added to the repository.
   */
  async execute(event: Event, uid: string): Promise<void> {
    await this.eventLocalRepository.add([event], uid);
  }
}
