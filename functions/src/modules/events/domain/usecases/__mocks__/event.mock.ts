import {
  AttendantStatus, ConferenceData, PlatformName,
  User, Event,
} from "../../entities";


const testUser: User = {
  platformUrl: "https://example.com",
  displayName: "John Doe",
  avatarUrl: "https://example.com/avatar.png",
  email: "john.doe@example.com",
};

const testConferenceData: ConferenceData = {
  entryPoints: [
    {
      entryPointType: "video",
      label: "Join video call",
      uri: "https://example.com/video-call",
    },
    {
      entryPointType: "phone",
      label: "Join phone call",
      uri: "tel:+1234567890",
    },
  ],
  notes: "Please be on time.",
};


export const testEvent: Event = {
  startTime: new Date("2022-01-01T09:00:00Z"),
  endTime: new Date("2022-01-01T10:00:00Z"),
  subject: "Meeting",
  description: "Discuss project status.",
  isAllDay: false,
  colorHex: "#4285F4",
  organizer: testUser,
  attendees: new Map([
    [testUser, AttendantStatus.accepted],
  ]),
  platformLink: "https://example.com/meeting",
  platform: PlatformName.GoogleCalendar,
  attendantStatus: AttendantStatus.accepted,
  conferenceData: testConferenceData,
};

export const testUserId = "test-uid";
