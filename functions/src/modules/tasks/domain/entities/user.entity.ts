/**
 * A representation of a user who is a member of a project. This has an
 * account in the platform that the project is defined in. Don't confuse
 * this user with the user of the app, since these are very different.
 *
 * @interface
 * @property {string} platformURL - The URL of the user's profile in
 * the platform.
 * @property {string} displayName - The display name of the user.
 * @property {string} avatarUrl - The URL of the user's avatar in the platform.
 * @example
 * {
  displayName: "Mock Username",
  platformURL: new URL("https://mocklinks.blueprint/user1"),
  avatarUrl: "https://mocklinks.blueprint/icon2",
}
 */
export interface User {
  /**
   * The URL of the user's profile in the platform.
   */
  platformURL: URL;

  /**
   * The display name of the user.
   */
  displayName: string;

  /**
   * The URL of the user's avatar in the platform.
   */
  avatarUrl: string;
}
