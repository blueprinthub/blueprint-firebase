import {PlatformName} from "./platform.enum";

/**
 * The representation of a project in Blueprint. This project is
 * linked to platform specified in the {@link PlatformName} enum. The
 * {@link Project} entity is used to represent a project in the Blueprint
 * database, mirroring the project in from the platform.
 * Since Blueprint is a multi-platform application, the {@link Project} entity
 * is used as a common language between the different platforms integrations.
 * Some fields are optional, since not all platforms provide the same
 * information.
 * @interface
 * @property {string} id - Kick-off identifier for the project.
 * @property {string} platformId - Platform-specific identifier for the project.
 * @property {URL} platformURL - Platform-specific URL for the project
 * (ex: Jira URL).
 * @property {PlatformName} platformName - The integration way of the project.
 * @property {string} name - The name of the project.
 * @property {string} description - A brief description of the project.
 * @property {URL} URL - URL of the project icon, if available.
 * @property {string} colorHex - The color of the project.
 * @property {string} owner - The owner of the project.
 * @property {string} slug - Slug of the project for indexed search.
 * @example
 * {
  id: "1234567890",
  platformId: "1234567890",
  platformURL: new URL("https://jira.com/1234567890"),
  platformName: PlatformName.Jira,
  name: "Blueprint",
  description: "Blueprint project",
  iconUrl: "https://jira.com/1234567890/icon.png",
  colorHex: "#000000",
  owner: "John Doe",
  slug: "blueprint",
}
 */
export interface Project {
  /**
   * Kick-off identifier for the project.
   */
  readonly id: string;

  /**
   * Platform-specific identifier for the project.
   */
  readonly platformId: string;

  /**
   * Platform-specific URL for the project (ex: Jira URL).
   */
  readonly platformURL: URL;

  /**
   * The integration way of the project.
   */
  readonly platformName: PlatformName;

  /**
   * The name of the project.
   */
  readonly name: string;

  /**
   * A brief description of the project.
   */
  readonly description: string;

  /**
   * URL of the project icon, if available.
   */
  readonly iconUrl?: string;

  /**
   * The color of the project.
   */
  readonly colorHex: string;

  /**
   * The owner of the project.
   */
  readonly owner?: string;

  /**
   * Slug of the project for indexed search.
   */
  readonly slug?: string;
}
