/**
 * A representation of a user who is a member of a project. This has an
 * account in the platform that the project is defined in. Don't confuse
 * this user with the user of the app, since these are very different.
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
