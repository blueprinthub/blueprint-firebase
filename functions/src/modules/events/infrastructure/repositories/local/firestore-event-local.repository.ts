/* eslint-disable require-jsdoc */
import {Firestore} from "firebase-admin/firestore";
import {inject, injectable} from "tsyringe";
import {Event, PlatformName} from "../../../domain/entities";
import {EventLocalRepository} from
  "../../../domain/repositories/local/event.local.repository";
import {eventConverter} from "./converters/event.converter";


@injectable()
export class FirestoreEventLocalRepository implements EventLocalRepository {
  constructor(@inject("firestore") private readonly firestore: Firestore) { }

  async add(events: Event[], uid: string): Promise<void> {
    const batch = this.firestore.batch();
    events.forEach((event) => {
      const eventRef = this.firestore
        .collection("users")
        .doc(uid)
        .collection("events")
        .withConverter(eventConverter)
        .doc();
      batch.set(eventRef, event);
    });

    await batch.commit();
  }

  async fetchLastFromPlatform(
    platform: PlatformName,
    uid: string): Promise<Event | undefined> {
    const eventQuerySnapshot = await this.firestore
      .collection("users")
      .doc(uid)
      .collection("events")
      .withConverter(eventConverter)
      .where("platform", "==", platform)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    const eventOrUndefined =
      !eventQuerySnapshot.empty ?
        eventQuerySnapshot.docs[0] as unknown as Event : undefined;
    return eventOrUndefined;
  }
}
