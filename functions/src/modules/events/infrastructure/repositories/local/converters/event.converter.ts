import { Timestamp, type DocumentData } from "firebase-admin/firestore";
import { Event, User, AttendantStatus } from "../../../../domain/entities";

/**
 * Firestore data converter for the Event interface.
 * @see https://firebase.google.com/docs/firestore/manage-data/add-data#custom_objects
 */
export const eventConverter: FirebaseFirestore.FirestoreDataConverter<Event> = {
  /**
   * Converts an Event object to a Firestore DocumentData object.
   * @param event - The Event object to convert.
   * @returns A Firestore DocumentData object
   *  representing the Event object.
   */
  toFirestore(event: Event): DocumentData {
    console.log("Event: ", event);
    const attendees: any = {};
    if (event.attendees) {
      event.attendees.forEach((status, user) => {
        attendees[JSON.stringify(user)] = status;
      });
    }

    console.log("Timestamp", Timestamp.fromDate);

    return {
      ...event,
      startTime: event.startTime ? Timestamp.fromDate(event.startTime) : null,
      endTime: event.endTime ? Timestamp.fromDate(event.endTime) : null,
      organizer: event.organizer ? JSON.stringify(event.organizer) : null,
      attendees,
      conferenceData: event.conferenceData ? JSON.stringify(event.conferenceData) : null,
    };
  },

  /**
   * Converts a Firestore QueryDocumentSnapshot to an Event object.
   * @param snapshot - The Firestore
   *  QueryDocumentSnapshot to convert.
   * @returns An Event object representing the
   * Firestore QueryDocumentSnapshot.
   */
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): Event {
    const data = snapshot.data();

    const attendeesMap = new Map<User, AttendantStatus>();
    if (data.attendees) {
      for (const [userJSON, status] of Object.entries(data.attendees)) {
        attendeesMap.set(JSON.parse(userJSON), status as AttendantStatus);
      }
    }

    return {
      ...data,
      startTime: data.startTime ? data.startTime.toDate() : null,
      endTime: data.endTime ? data.endTime.toDate() : null,
      organizer: data.organizer ? JSON.parse(data.organizer) : null,
      attendees: attendeesMap,
      conferenceData: data.conferenceData ? JSON.parse(data.conferenceData) : null,
    } as Event;
  },
};
