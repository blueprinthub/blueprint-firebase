/**
 * A representation of a user who is a member of a project. This has an
 * account in the platform that the project is defined in. Don't confuse
 * this user with the user of the app, since these are very different.
 *
 * @interface
 * @property {string} platformUrl - The URL of the user's profile in
 * the platform.
 * @property {string} displayName - The display name of the user.
 * @property {string} avatarUrl - The URL of the user's avatar in the platform.
 * @example
 * {
 *  platformUrl: 'https://jira.com/1234567890',
 *  displayName: 'John Doe',
 *  avatarUrl: 'https://jira.com/1234567890/avatar.png'
 * }
 */
export interface User {
  /**
   * The URL of the user's profile in the platform.
   */
  platformUrl: string;

  /**
   * The display name of the user.
   */
  displayName: string;

  /**
   * The URL of the user's avatar in the platform.
   */
  avatarUrl: string;
}
