/**
 * Represents an entry point for a conference, such as a video call
 * or phone call.
 * There are the different ways to join a certain conference.
 * The entry point type can be one of the following:
 * - video
 * - phone
 * - sip
 * - more
 * - unknown
 *
 * @example
 * ```
 * const entryPoint: EntryPoint = {
 *   entryPointType: 'video',
 *   label: 'Join video call',
 *   uri: 'https://example.com/video-call',
 * };
 * ```
 */
export interface EntryPoint {
  entryPointType?: string;
  label?: string;
  uri?: string;
}

/**
 * Represents the conference data for an event.
 *
 * @example
 * ```
 * const conferenceData: ConferenceData = {
 *   entryPoints: [
 *     {
 *       entryPointType: 'video',
 *       label: 'Join video call',
 *       uri: 'https://example.com/video-call',
 *     },
 *     {
 *       entryPointType: 'phone',
 *       label: 'Join phone call',
 *       uri: 'tel:+1234567890',
 *     },
 *   ],
 *   notes: 'Please be on time.',
 * };
 * ```
 */
export interface ConferenceData {
  entryPoints: Iterable<EntryPoint>;
  notes?: string;
}
