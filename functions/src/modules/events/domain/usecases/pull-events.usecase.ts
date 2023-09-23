/* eslint-disable require-jsdoc */
import { inject, injectable } from "tsyringe";
import { Event, PlatformName } from "../entities";
import { EventLocalRepository } from "../repositories/local/event.local.repository";
import { EventRemoteRepositoryFactory } from "../repositories/remote/event.remote.repository.factory";

/**
 * Use case for pulling events from a remote repository and adding
 * them to the local repository.
 * @property {EventLocalRepository} eventRepository The local event repository
 * to add events to.
 * @property {EventRemoteRepositoryFactory} remoteFactory The factory
 * for creating remote event repositories.
 */
@injectable()
export class PullEventsUseCase {
  /**
   * Creates a new instance of the PullEvents use case.
   * @param {EventLocalRepository} eventRepository The local event repository
   * to add events to.
   * @param {EventRemoteRepositoryFactory} remoteFactory The factory
   * for creating remote event repositories.
   */
  constructor(
    @inject("EventLocalRepository") private readonly eventRepository: EventLocalRepository,

    @inject("EventRemoteRepositoryFactory")
    private readonly remoteFactory: EventRemoteRepositoryFactory,
  ) {}

  /**
   * Executes the use case by pulling events from the remote
   * repository and adding them to the local repository.
   * @param {PlatformName} platform The platform to pull
   * events from.
   * @param {string} uid The user ID to associate
   * with the events.
   * @param {string} authenticatorId The authenticator ID to
   * use for authentication.
   * @return {Promise<void>}A Promise that resolves when the events have been
   * added to the local repository.
   */
  async execute(platform: PlatformName, uid: string, authenticatorId: string): Promise<void> {
    const remoteRepo = this.remoteFactory.buildFor(platform);

    const lastEventOrNone = await this.eventRepository.fetchLastFromPlatform(platform, uid);

    const events: Event[] = await remoteRepo.pull(uid, authenticatorId, lastEventOrNone);

    await this.eventRepository.add(events, uid);
  }
}
