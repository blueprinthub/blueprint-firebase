/**
 * Represents a user in the event context.
 *
 * @example
 * ```
 * const user: User = {
 *   platformUrl: 'https://example.com',
 *   displayName: 'John Doe',
 *   avatarUrl: 'https://example.com/avatar.png',
 *   email: 'john.doe@example.com',
 * };
 * ```
 */
export interface User {
  platformUrl?: string;
  displayName?: string;
  avatarUrl?: string;
  email?: string;
}
