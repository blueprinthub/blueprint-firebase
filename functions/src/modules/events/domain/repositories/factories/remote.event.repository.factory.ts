import {PlatformName} from "../../entities/platform.enum";
import {EventRemoteRepository} from "./impl/event.remote.repository";

/**
 * Factory interface for creating remote event repositories.
 *
 */
export interface RemoteEventRepositoryFactory {
  /**
   * Builds a remote event repository for the given platform.
   * @param {PlatformName} platform The platform to build the repository for.
   * @returns {EventRemoteRepository} An instance of the EventRemoteRepository
   * interface for the given platform.
   */
  buildFor(platform: PlatformName): EventRemoteRepository
}
