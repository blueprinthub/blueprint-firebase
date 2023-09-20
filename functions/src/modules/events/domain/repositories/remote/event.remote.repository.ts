import {Event, PlatformName} from "../../entities";

/**
 * A repository in charge for handling events with external platforms
 * (e.g. Google Calendar, Todoist, etc.). Do not confuse this with the
 * EventRepository, which is in charge of handling events in the local
 * database. The responsibility of this repository is only to handle
 * events that are outside Blueprint for the specific platformName.
 *
 * For more information about the EventRepository
 * visit https://www.github.com/blueprinthub/blueprint-firebase/functions/src/modules/events/domain/repositories/event.local.repository.ts
 */
export interface EventRemoteRepository {
  /**
   * The platform that this repository is for.
   */
  platformName: PlatformName;

  /**
 * Pulls events from the remote platform for the given user ID
 * and authenticator ID.
 * @param {string} uid The user ID to associate with the events.
 * @param {string} authenticatorId The authenticator ID to use for
 * authentication.
 * @param {Event} lastPulledEvent The last event that was pulled from the
 * repository (optional).
 * @returns {Promise<Event>} A Promise that resolves with an array of
 * events that have been added to the repository since the last pull.
 */
  pull(uid: string, authenticatorId: string, lastPulledTask?: Event)
    : Promise<Event[]>
}
