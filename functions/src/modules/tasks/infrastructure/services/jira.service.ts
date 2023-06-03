/* eslint-disable require-jsdoc */
import {Task} from "../../domain/entities/task.entity";
import {
  AbstractRemoteRepository,
} from "../repositories/factories/remote.repository.abstract";
import axios from "axios";
import {PlatformName} from "../../domain/entities/platform.enum";
import {Project} from "../../domain/entities/project.entity";
import {Priority} from "../../domain/entities/priority.entity";
import {Label} from "../../domain/entities/label.entity";
import {User} from "../../domain/entities/user.entity";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JiraTask = {
  id: string;
  self: string;
  key: string;
  fields: {
    summary: string;
    description: JiraDescription;
    startDate: string;
    dueDate: string;
    timeestimate: number;
    timespent: number;
    assignee: [JiraApiUser];
    status: any,
    created: string;
    updated: string;
    priority: Record<string, any>;
    project: JiraProject,
    creator: JiraApiUser,
  }
};
interface JiraProject {
  id: string;
  uuid: string | null;
  name: string;
  self: string;
  description: string;
  avatarUrls: Record<string, string>
}

interface JiraApiUser {
  [key: string]: any; // for arbitrary string keys and dynamic values
  self?: string;
  displayName?: string;
  avatarUrls?: { [key: string]: string };
}

interface JiraDescription {
  type: string;
  content: Array<DescriptionContent>;
}
interface DescriptionContent{
  content: Array<{text: string}>;
}

export class JiraRemoteRepository extends AbstractRemoteRepository<JiraTask> {
  private CLOUDS_API_URL = "https://api.atlassian.com/oauth/token/accessible-resources";

  private buildHeaders(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    };
  }

  private buildSearchUrl(cloudId: string) {
    return `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search?jql=assignee=currentuser() AND status!=Done`;
  }

  private async getCloudIds(accessToken: string): Promise<string[]> {
    const {data: clouds} = await
    axios.get<{ id: string }[]>(this.CLOUDS_API_URL, {
      headers: this.buildHeaders(accessToken),
    });
    return clouds.map((cloud) => cloud.id);
  }

  async getTasks(accessToken: string): Promise<JiraTask[]> {
    const clouds = await this.getCloudIds(accessToken);

    const jiraTasks = clouds.map(async (cloudId) => {
      const searchUrl = this.buildSearchUrl(cloudId);
      const {data} = await axios.get<{ issues: JiraTask[] }>(searchUrl, {
        headers: this.buildHeaders(accessToken),
      });
      return data.issues;
    });
    const tasksPerCloud = await Promise.all(jiraTasks);
    return tasksPerCloud.flat();
  }

  mapper(remote: JiraTask): Task {
    // Maybe moving all the mappers to a separate file would be a good idea
    return fromJiraApiIssueToTask(remote);
  }
}

/**
 * Convert a Jira API issue object to a Task object. In Jira, the description
 * of a field can be separated in multiple parts, so this way we join all the
 * pieces in a single string, separated by new lines or paragraphs if necessary.
 * @param {JiraDescription} descriptionField the description field from the Jira
 * API response
 * @return {string} the description of the task
 */
function fromJiraApiDescriptionToString(
  descriptionField?: JiraDescription
): string {
  let description: string;

  if (!descriptionField) {
    description = "";
  } else {
    const descriptionContent = descriptionField.content;
    description = descriptionContent.map((e) => {
      const content = e.content;
      if (!content) {
        return "";
      }
      return content
        .map((e) => (e.text as string) ?? "")
        .join("\n");
    })
      .join("\r");
  }

  return description;
}
/**
 * Convert a Jira API status object to a Status object.
 * @param {Record<string,string>} priority the api priority object
 * @return {Priority} a number representing the priority of the task.
 * That number is 1|2|3|4|5.
 */
function fromJiraApiPriorityToPriority(priority?: Record<string, string>)
  : Priority {
  // TODO(yarn-rp): this function is not working completely fine, since it is
  // not ensuring that the priority is a number from 1 to 5.
  const priorityNumber = priority?.id;
  const priorityInt = parseInt(priorityNumber as string) || 0;
  // if priority is a number from 1|2|3|4|5, return it
  if (priorityInt >= 1 && priorityInt <= 5) {
    return priorityInt;
  }

  // return three since this is the default priority
  return 3;
}
/**
 * Convert a Jira API status object to a Status object.
  * @param {Record<string,string>} status the api status object
  * @return {Label} a label representing the status of the task.
 */
function fromJiraApiStatusToStatus(status?: Record<string, any>): Label {
  if (status == null) {
    return {name: "No Status", colorHex: "#FFC107"};
  }

  const name = status["name"] ?? "";
  const colorName = status["statusCategory"]?.["colorName"] ?? "";
  // if colorName is string, returning the color associated with that name
  if (typeof colorName === "string") {
    return {name, colorHex: getColorHexByName(colorName)};
  }

  return {name, colorHex: "#FFC107"};
}


/**
 * Returns the hex code of the color associated with a given color name.
 * Jira API returns a color name, but we need the hex code to display it, so
 * this functions is in charge of mapping the color name to the hex code.
 *
 * Since we can't support all the colors, we are just supporting the ones
 * that are used in the Jira Cloud UI and defaulting to an specific color
 * if the color is not found.
 * @param {string} name the name of the color
 * @return {string} the hex code of the color associated with the given name
 * or a default color if the color is not found.
  */
function getColorHexByName(name: string): string {
  // TODO(yarn-rp): implement this function properly, maybe calling to a
  // different service and fetching the color from database or just having
  // a temporary map of colors.
  return "#FFC107";
}

function fromJiraApiUserToUser(user?: JiraApiUser): User | null {
  if (user == null) {
    return null;
  }

  const platformURL = new URL(user.self ?? "");
  const displayName = user.displayName ?? "";
  const avatarUrl = user.avatarUrls?.["48x48"] ?? "";

  return {platformURL, displayName, avatarUrl};
}

/**
 * Builds a url that can be opened in a browser env to see the task.
 * @param {JiraTask} jiraIssue the Jira API issue object
 * @return {URL|null}the url that can be opened in a browser env to see the task
 */
function getTaskUrl(jiraIssue: JiraTask): URL | null {
  // FIXME: the domain is not the value expected.
  // It should be the domain of the Jira instance, and instead it is the
  // domain of the Jira API.
  const domain = jiraIssue.self.split("/rest/api")[0];
  const issueKey = jiraIssue.key;

  if (issueKey == null) {
    return null;
  }
  const url = new URL(`${domain}/browse/${issueKey}`);
  return url;
}

/**
 * A very simple function to hash a project to a color.
 * This function is not meant to be used in production, but it is good enough
 * for the purpose of this demo.
 *
 * Production should store projects in a database and assign a random color
 * to each project, so the projects keep the same color.
 * @param {string} projectName the name of the project
 * @return {string} the hex code of the color associated with the project name
 */
function colorFromProjectName(projectName: string): string {
  // Hash the projectName using a simple hash function
  let hash = 0;
  for (let i = 0; i < projectName.length; i++) {
    hash = projectName.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert the hash to a positive integer and divide by the
  // maximum value to get a value between 0 and 1
  const value = (hash >>> 0) / 0xffffffff;

  // Use HSV color model to generate a random color with a fixed
  // saturation and brightness and a varying hue based on the hashed value
  const hue = value * 360;
  const saturation = 70;
  const brightness = 90;

  // Convert the HSV values to RGB and then to a hex code
  const {r, g, b} = hsvToRgb(hue, saturation, brightness);
  return rgbToHex(r, g, b);
}

// Helper function to convert an HSV color to RGB
function hsvToRgb(h: number, s: number, v: number) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let rgb: { r: number, g: number, b: number };
  if (h < 60) {
    rgb = {r: c, g: x, b: 0};
  } else if (h < 120) {
    rgb = {r: x, g: c, b: 0};
  } else if (h < 180) {
    rgb = {r: 0, g: c, b: x};
  } else if (h < 240) {
    rgb = {r: 0, g: x, b: c};
  } else if (h < 300) {
    rgb = {r: x, g: 0, b: c};
  } else {
    rgb = {r: c, g: 0, b: x};
  }
  return {
    r: Math.round((rgb.r + m) * 255),
    g: Math.round((rgb.g + m) * 255),
    b: Math.round((rgb.b + m) * 255),
  };
}

// Helper function to convert an RGB color to a hex code
function rgbToHex(r: number, g: number, b: number) {
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Maps a Jira API project to a blueprint project.
 * @see https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-projects/#api-rest-api-3-project-get
 * @param {JiraProject} project a jira representation of a project
 * @return {Project} a blueprint representation of a project
 * @throws {Error} if the project doesn't have an id, name or platformURL
 */
function fromJiraProjectToProject(project: JiraProject): Project {
  const projectId = project.id;
  const projectName = project.name;
  const platformURL = project.self;
  const description = project.description;
  const iconUrl = project.avatarUrls?.$16X16;

  if (projectId == null) {
    throw new Error("Project ID is null");
  }
  if (projectName == null) {
    throw new Error("Project name is null");
  }
  if (platformURL == null) {
    throw new Error("Platform URL is null");
  }

  const color = colorFromProjectName(projectId);

  return {
    platformName: PlatformName.Jira,
    id: projectId,
    platformId: projectId,
    name: projectName,
    platformURL: new URL(platformURL),
    description: description || "",
    colorHex: color,
    iconUrl: iconUrl || "",
  };
}

/**
 * Maps a Jira Issue to a Blueprint Task.
 * @see https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-get
 * @param {JiraTask} jiraIssue a jira representation of an issue
 * @return {Task} a blueprint representation of a task
 * @throws {Error} if the issue doesn't have any fields.
 * @throws {Error} if the project doesn't have an id, name or platformURL
 */
function fromJiraApiIssueToTask(jiraIssue: JiraTask): Task {
  if (!jiraIssue.fields) {
    throw new Error("Issue fields are null");
  }
  const issueId = jiraIssue.id;
  const fields = jiraIssue.fields;

  const createdAt = new Date(fields.created as string);
  const updatedAt = new Date(fields.updated as string);

  const project = fromJiraProjectToProject(fields.project);

  const title = fields.summary || "";
  const description = fromJiraApiDescriptionToString(fields.description);
  const startDate = new Date(fields.startDate as string);
  const dueDate = new Date(fields.dueDate as string);
  const estimatedTime = fields.timeestimate as number | undefined;
  const loggedTime = fields.timespent as number | undefined;
  const assigned = fields.assignee;
  const creator = fields.creator;
  const isCompleted = false;
  const status = fromJiraApiStatusToStatus(fields.status);
  const priority = fromJiraApiPriorityToPriority(fields.priority);

  const userCreator = fromJiraApiUserToUser(creator);
  if (userCreator === null) {
    throw new Error("User creator is null");
  }
  const userAssigned = fromJiraApiUserToUser(assigned);
  const task: Task = {
    id: issueId,
    createdAt: createdAt,
    updatedAt: updatedAt,
    project: project,
    taskURL: getTaskUrl(jiraIssue) || new URL(""),
    title: title,
    description: description,
    startDate: startDate.getTime() === 0 ? undefined : startDate,
    dueDate: dueDate.getTime() === 0 ? undefined : dueDate,
    estimatedTime: estimatedTime,
    loggedTime: loggedTime,
    assigned: userAssigned ? [userAssigned] : [],
    creator: userCreator,
    isCompleted: isCompleted,
    labels: [status],
    priority: priority,
  };
  return task;
}
