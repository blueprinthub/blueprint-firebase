/* eslint-disable camelcase */
import { google, calendar_v3 } from "googleapis";
import { PlatformName } from "../../../domain/entities";
import { BaseEventRemoteRepository } from "./base.event.remote.repository";
import "reflect-metadata";
import { container } from "tsyringe";
import { ConfigService } from "../../../../../common/config/config.service";

export type GoogleCalendarEvent = calendar_v3.Schema$Event;

/**
 * A Google Calendar remote repository that fetches the events from the
 * Google Calendar API.
 *
 * @see https://developers.google.com/calendar/v3/reference/events
 * @see https://developers.google.com/calendar/v3/reference/events/list
 */
export class GoogleCalendarEventRemoteRepository extends BaseEventRemoteRepository<GoogleCalendarEvent> {
  /**
   * Override of the Platform name to indicate the platform
   * name of the remote repository.
   */
  platformName: PlatformName = PlatformName.GoogleCalendar;

  /**
   * Retrieves the events from the Google Calendar API using
   * the access token.
   * @param accessToken - the access token to authenticate
   * with the remote source.
   */
  async getEvents(accessToken: string): Promise<GoogleCalendarEvent[]> {
    const calendarAPIClient = this._getCalendarAPIClient(accessToken);
    try {
      const response = await calendarAPIClient.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
      });

      const gCalendarEvents = response.data.items;
      return gCalendarEvents || [];
    } catch (error) {
      console.log("Error: ", error);
      // Depending on the error we might return different
      // exceptions
      throw error;
    }
  }

  /**
   * Creates a Google Calendar V3 API client given a valid access token.
   * Please note that the access token must have the following scopes:
   * - https://www.googleapis.com/auth/calendar.events.readonly
   * - https://www.googleapis.com/auth/calendar.readonly
   *
   * @param accessToken - the access token to authenticate
   * with client.
   * @returns a Google Calendar API client
   * authenticated client
   *
   * @see https://developers.google.com/calendar/v3/reference
   */
  private _getCalendarAPIClient(accessToken: string): calendar_v3.Calendar {
    const config = container.resolve<ConfigService>("config");
    console.log("ClientID", config.get("google.clientId"));
    const client = new google.auth.OAuth2(
      config.get("google.clientId"),
      config.get("google.clientSecret"),
      config.get("google.redirectURI"),
    );
    client.setCredentials({ access_token: accessToken });
    return google.calendar({
      version: "v3",
      auth: client,
    });
  }
}
