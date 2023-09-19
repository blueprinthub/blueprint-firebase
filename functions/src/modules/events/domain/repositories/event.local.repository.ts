import {PlatformName} from "../entities/platform.enum";
import {Event} from "../entities";

/**
 * A repository for events inside the Blueprint. This repository
 * should be in charge of managing events that are already inside the platform.
 * For handling events that are outside the platform, see the
 * https://www.github.com/blueprinthub/blueprint-firebase/functions/src/modules/events/domain/repositories/remotes/event.remote.repository.ts
 *
 * @interface
 */
export interface EventLocalRepository {

    /**
     * Adds events to the repository for the given user ID.
     * @param events An array of events to add to the repository.
     * @param uid The user ID to associate with the events.
     * @returns A Promise that resolves when the events have been added to the
     * repository.
     */
    add(events: Event[], uid: string): Promise<void>

    /**
     * Fetches the last event from the given platform for the given user ID.
     * @param platform The platform to fetch the event from.
     * @param uid The user ID to associate with the event.
     * @returns A Promise that resolves with the last event from the platform,
     * or undefined if there are no events.
     */
    fetchLastFromPlatform(platform: PlatformName, uid: string):
        Promise<Event | undefined>
}
