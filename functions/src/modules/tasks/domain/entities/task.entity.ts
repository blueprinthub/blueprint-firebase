import {Priority} from "./priority.entity";
import {Project} from "./project.entity";
import {User} from "./user.entity";
import {Label} from "./label.entity";

/**
 * A representation of a ticket in a project. Like the {@link Project} entity,
 * this entity is used to represent a ticket in the Blueprint database,
 * mirroring the ticket in from the platform.
 *
 * Since Blueprint is a multi-platform application, the {@link Task} entity
 * is used as a common language between the different platforms integrations.
 * Some fields are optional, since not all platforms provide the same
 * information.
 *
 * @interface
 * @property {Date} createdAt - Kick off creation date.
 * @property {Date} updatedAt - Kick off creation date.
 * @property {string} id - Kick off id.
 * @property {Project} project - Project to which the ticket belongs.
 * @property {URL} taskURL - The url of the ticket in the platform.
 * @property {string} title - Title of the ticket.
 * @property {string} description - Maybe rich text (markdown || html).
 * @property {Date} startDate - Start date of the ticket.
 * @property {Date} dueDate - Due date of the ticket.
 * @property {number} estimatedTime - Estimated time to complete the ticket.
 * @property {number} loggedTime - Time logged in the ticket.
 * @property {User[]} assigned - Assigned users including me.
 * @property {User} creator - Creator of the ticket.
 * @property {Priority} priority - Priority of the ticket.
 * @property {Label[]} labels - Labels of the ticket.
 * @example
{
  createdAt: '2019-01-01T00:00:00.000Z',
  updatedAt: '2019-01-01T00:00:00.000Z',
  id: '1234567890',
  project: {
    id: '1234567890',
    platformId: '1234567890',
    platformURL: 'https://jira.com/1234567890',
    platformName: 'JIRA',
    name: 'Blueprint',
    description: 'Blueprint project',
    iconUrl: 'https://jira.com/1234567890/icon.png',
    colorHex: '#000000',
    owner: 'John Doe',
    slug: 'blueprint'
  },
  taskURL: 'https://jira.com/1234567890/1234567890',
  title: 'Blueprint task',
  description: 'Blueprint task description',
  startDate: '2019-01-01T00:00:00.000Z',
  dueDate: '2019-01-01T00:00:00.000Z',
  estimatedTime: 3600,
  loggedTime: 1800,
  assigned: [
    {
      platformUrl: 'https://jira.com/1234567890',
      displayName: 'John Doe',
      avatarUrl: 'https://jira.com/1234567890/avatar.png'
    },
    {
      platformUrl: 'https://jira.com/1234567890',
      displayName: 'Jane Doe',
      avatarUrl: 'https://jira.com/1234567890/avatar.png'
    }
  ],
  creator: {
    platformUrl: 'https://jira.com/1234567890',
    displayName: 'John Doe',
    avatarUrl: 'https://jira.com/1234567890/avatar.png'
  },
  priority: 1,
  labels: [
    {
      id: '1234567890',
      name: 'Blueprint',
      colorHex: '#000000'
    },
    {
      id: '1234567890',
      name: 'Blueprint',
      colorHex: '#000000'
    }
  ]
}
 */
export interface Task {
  /**
   * Kick off creation date
   */
  createdAt: Date;

  /**
   * Kick off creation date
   */
  updatedAt: Date;

  /**
   * Kick off id
   */
  id: string;

  /**
   * Project to which the ticket belongs
   */
  project: Project;

  /**
   * The url of the ticket in the platform
   */
  taskURL: URL;

  /**
   * Title of the ticket
   */
  title: string;

  /**
   * Maybe rich text (markdown || html)
   */
  description: string;

  /**
   * Start date of the ticket
   */
  startDate?: Date;

  /**
   * Due date of the ticket
   */
  dueDate?: Date;

  /**
   * Estimated time to complete the ticket
   */
  estimatedTime?: number;

  /**
   * Time logged in the ticket
   */
  loggedTime?: number;

  /**
   * Assigned users including me
   */
  assigned: User[];

  /**
   * Creator of the ticket
   */
  creator: User;

  /**
   * Is the ticket completed
   */
  isCompleted: boolean;

  /**
   * Status of the ticket
   */
  labels: Label[];

  /**
   * The priority of the ticket.
   */
  priority: Priority;
}
