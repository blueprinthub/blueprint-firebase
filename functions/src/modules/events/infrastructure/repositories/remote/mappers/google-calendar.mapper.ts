import { Mapper } from "../base.event.remote.repository";
import { Event, User, AttendantStatus, PlatformName } from "../../../../domain/entities";
import { GoogleCalendarEvent } from "../google-calendar.event.remote.repository";

/**
 * A mapper in charge of converting objects from Google Calendar Platform to
 * Event entities.
 */
export class GoogleCalendarMapper implements Mapper<GoogleCalendarEvent> {
  /**
   * Maps GoogleCalendarEvent to Event.
   * @param remoteEvent - the remote event to map
   * @returns the mapped event
   */
  fromRemoteEvent(remoteEvent: GoogleCalendarEvent): Event {
    const startTime = remoteEvent.start?.dateTime ? new Date(remoteEvent.start.dateTime) : undefined;
    const endTime = remoteEvent.end?.dateTime ? new Date(remoteEvent.end.dateTime) : undefined;
    const subject = remoteEvent.summary || "";
    const description = remoteEvent.description || "";
    const isAllDay = !!remoteEvent.start?.date;
    const colorHex = remoteEvent.colorId || undefined;
    const organizer: User = {
      displayName: remoteEvent.organizer?.displayName || "",
      email: remoteEvent.organizer?.email || "",
    };
    const attendees = new Map<User, AttendantStatus>();

    remoteEvent.attendees?.forEach((att) => {
      const user: User = {
        displayName: att.displayName || "",
        email: att.email || "",
      };
      const status: AttendantStatus =
        AttendantStatus[att.responseStatus as keyof typeof AttendantStatus] || AttendantStatus.NeedsAction;
      attendees.set(user, status);
    });

    const platformLink = remoteEvent.htmlLink || undefined;

    // const conferenceData = this.getConferenceData(
    //   remoteEvent.conferenceData || ({} as calendar_v3.Schema$ConferenceData),
    // );

    const event: Event = {
      startTime,
      endTime,
      subject,
      description,
      isAllDay,
      colorHex,
      organizer,
      attendees,
      platformLink,
      platform: PlatformName.GoogleCalendar,
      attendantStatus: AttendantStatus.Accepted, // Replace with the real status
      conferenceData: undefined,
    };

    return event;
  }

  /**
   * Maps conference data from Google Calendar API to ConferenceData domain
   * entity
   * @param gConferenceData - the
   * conference data from the Google Calendar API
   * @returns the mapped conference data
   */
  // private getConferenceData(gConferenceData: calendar_v3.Schema$ConferenceData): ConferenceData | undefined {
  //   return undefined;
  // }
}
