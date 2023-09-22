import {Firestore} from "firebase-admin/firestore";
import {Event, PlatformName} from "../../../domain/entities";
import {EventRemoteRepository}
  from "../../../domain/repositories/remote/event.remote.repository";

/**
 * An abstract base class for EventRemoteRepository implementations.
 * It provides common functionality for interacting with a remote event
 * data source.
 *
 * It implements the pull method from the EventRemoteRepository interface,
 * but you will still need to implement the platformName property.
 *
 * @template RemoteEvent The type of the event in the remote data source.
 * @implements {EventRemoteRepository}
 */
export abstract class BaseEventRemoteRepository<RemoteEvent>
implements EventRemoteRepository {
  /**
   * Creates a new instance of BaseEventRemoteRepository.
   *
   * @param {Firestore} firestore - An instance of Firestore to interact
   * with Firebase.
   * @param {Mapper<RemoteEvent>} mapper - A mapper function to map a
   * RemoteEvent object to an Event entity.
   */
  constructor(private readonly firestore: Firestore,
    private readonly mapper: Mapper<RemoteEvent>,
  ) { }

  /**
   * Retrieves the access token for a user based on their uid
   * and authenticatorId.
   *
   * @param {string} uid - The user ID.
   * @param {string} authenticatorId - The ID of the authenticator.
   * @return {Promise<string>} The access token as a Promise.
   */
  private async getAccess(uid: string, authenticatorId: string):
    Promise<string> {
    const accessFirestoreDoc = await this.firestore
      .collection("users")
      .doc(uid)
      .collection("authenticators")
      .doc(authenticatorId)
      .get();

    const accessToken: string = accessFirestoreDoc.get("accessToken");
    return accessToken;
  }

  /**
   * Abstract method to retrieve events from the remote source.
   *
   * @abstract
   * @param {string} accessToken - The access token to authenticate with
   * the remote source.
   * @returns {Promise<RemoteEvent[]>} A Promise containing an array of
   * RemoteEvent objects.
   */
  abstract getEvents(accessToken: string): Promise<RemoteEvent[]>;


  /**
   * Platform name to indicate which platform the remote repository
   * is interacting with.
   *
   * @abstract
   * @type {PlatformName}
   */
  abstract platformName: PlatformName;

  /**
   * Retrieves events from a remote source and maps them to domain entities.
   *
   * @param {string} uid - The user ID.
   * @param {string} authenticatorId - The ID of the authenticator.
   * @param {Event} [lastPulledEvent] - Optional last pulled event.
   * @return {Promise<Event[]>} A Promise containing an array of Event entities.
   */
  async pull(
    uid: string,
    authenticatorId: string,
  ): Promise<Event[]> {
    const accessToken = await this.getAccess(uid, authenticatorId);
    const nativeTasks = await this.getEvents(accessToken);
    return nativeTasks.map(this.mapper.fromRemoteEvent);
  }
}

/**
 * Mapper interface to map a RemoteEvent object to an Event entity.
 *
 * @template RemoteEvent The type of the event in the remote data source.
 */
export interface Mapper<RemoteEvent> {
  /**
   * Maps a RemoteEvent object to an Event entity.
   * @param {RemoteTask} remoteEvent The RemoteEvent object to map.
   */
  fromRemoteEvent(remoteEvent: RemoteEvent): Event;
}
