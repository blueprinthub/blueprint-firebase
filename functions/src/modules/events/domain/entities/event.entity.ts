import {AttendantStatus} from "./attendant-status.enum";
import {ConferenceData} from "./conference-data.entity";
import {PlatformName} from "./platform.enum";
import {User} from "./user.entity";

/**
 * Represents the properties of an event.
 *
 * @example
 * ```
 * const eventProps: EventProps = {
 *   startTime: new Date('2022-01-01T09:00:00Z'),
 *   endTime: new Date('2022-01-01T10:00:00Z'),
 *   subject: 'Meeting',
 *   description: 'Discuss project status.',
 *   isAllDay: false,
 *   colorHex: '#4285F4',
 *   organizer: {
 *     displayName: 'John Doe',
 *     email: 'john.doe@example.com',
 *   },
 *   attendees: new Map([
 *     [
 *       {
 *         displayName: 'Jane Doe',
 *         email: 'jane.doe@example.com',
 *       },
 *       AttendantStatus.Accepted,
 *     ],
 *     [
 *       {
 *         displayName: 'Bob Smith',
 *         email: 'bob.smith@example.com',
 *       },
 *       AttendantStatus.Tentative,
 *     ],
 *   ]),
 *   platformLink: 'https://example.com/meeting',
 * };
 * ```
 */
interface EventProps {
    startTime?: Date;
    endTime?: Date;
    subject: string;
    description?: string;
    isAllDay?: boolean;
    colorHex?: string;
    organizer?: User;
    attendees?: Map<User, AttendantStatus>;
    platformLink?: string;
}

/**
 * Represents an event.
 *
 * @example
 * ```
 * const event: Event = {
 *   startTime: new Date('2022-01-01T09:00:00Z'),
 *   endTime: new Date('2022-01-01T10:00:00Z'),
 *   subject: 'Meeting',
 *   description: 'Discuss project status.',
 *   isAllDay: false,
 *   colorHex: '#4285F4',
 *   organizer: {
 *     displayName: 'John Doe',
 *     email: 'john.doe@example.com',
 *   },
 *   attendees: new Map([
 *     [
 *       {
 *         displayName: 'Jane Doe',
 *         email: 'jane.doe@example.com',
 *       },
 *       AttendantStatus.Accepted,
 *     ],
 *     [
 *       {
 *         displayName: 'Bob Smith',
 *         email: 'bob.smith@example.com',
 *       },
 *       AttendantStatus.Tentative,
 *     ],
 *   ]),
 *   platformLink: 'https://example.com/meeting',
 *   platform: 'Google Calendar',
 *   attendantStatus: AttendantStatus.Accepted,
 *   conferenceData: {
 *     entryPoints: [
 *       {
 *         entryPointType: 'video',
 *         label: 'Join video call',
 *         uri: 'https://example.com/video-call',
 *       },
 *       {
 *         entryPointType: 'phone',
 *         label: 'Join phone call',
 *         uri: 'tel:+1234567890',
 *       },
 *     ],
 *     notes: 'Please be on time.',
 *   },
 * };
 * ```
 */
export interface Event extends EventProps {
    platform: PlatformName;
    attendantStatus: AttendantStatus;
    conferenceData?: ConferenceData;
}
