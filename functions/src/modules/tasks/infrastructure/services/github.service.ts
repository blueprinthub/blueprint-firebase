/* eslint-disable require-jsdoc */
import axios from "axios";
import {Task} from "../../domain/entities/task.entity";
import {
  AbstractRemoteRepository,
} from "../repositories/factories/remote.repository.abstract";
import {PlatformName} from "../../domain/entities/platform.enum";
import {Label, Priority, Project, User} from "../../domain/entities/entities";
/**
 * Represents a task in Github. Since in github, a task can mean different
 * things, we need to have a union type to represent all the possible tasks.
 * For now, we only support issues and pull requests.
 *
 */
type GithubTask = GithubIssue | GithubPullRequest;

/**
 * Represents a Github Pull Request (PR) data
 * @see https://docs.github.com/en/rest/reference/pulls
 *
 */
interface GithubPullRequest {
  number: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  html_url: string;
}
interface GithubLabel {
  name: string;
  color: string;
}
/**
 * Represents a Github Issue
 * @see https://docs.github.com/en/rest/reference/issues
 */
interface GithubIssue {
  id: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  state: string;
  number: number;
  title: string;
  body: string;
  labels: GithubLabel[],
  repository: {
    id: string;
    html_url: string;
    name: string;
    description: string;
    owner: {
      login: string;
      avatar_url: string;
    };
  };
  user: {
    html_url: string;
    login: string;
    avatar_url: string;
  };
  assignees: {
    login: string;
    avatar_url: string;
    html_url: string;
  }[];
}

/**
 * A Github remote repository that fetches the tasks from the Github API.
 */
export class GithubRemoteRepository
  extends AbstractRemoteRepository<GithubTask> {
  private GITHUB_API_URL = "https://api.github.com";

  private buildHeaders(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    };
  }

  private async fetchUserIssues(accessToken: string): Promise<GithubTask[]> {
    try {
      const headers = this.buildHeaders(accessToken);
      const response = await axios.get(this.GITHUB_API_URL, {
        headers: headers,
        params: {
          filter: "assigned",
        },
      });

      if (response.status === 200) {
        return response.data.map(
          (issue: GithubIssue) => this.mapper(issue)
        );
      } else {
        throw new Error("Failed to fetch issues.");
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async fetchUserRequestedReviewPullRequests(accessToken: string):
      Promise<GithubTask[]> {
    try {
      const headers = this.buildHeaders(accessToken);
      const response = await axios.get(this.GITHUB_API_URL, {
        headers: headers,
        params: {
          filter: "assigned",
        },
      });

      if (response.status === 200) {
        return response.data.map(
          (issue: GithubIssue) => this.mapper(issue)
        );
      } else {
        throw new Error("Failed to fetch issues.");
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }


  async getTasks(accessToken: string): Promise<GithubTask[]> {
    // The github tasks are the issues assigned to the user + the Pull Requests
    // that at some point are connected to the user.
    const userGithubTasks = await Promise.all(
      [
        this.fetchUserIssues(accessToken),
        this.fetchUserRequestedReviewPullRequests(accessToken),
      ]
    );

    return userGithubTasks.flat();
  }
  mapper(issue: GithubIssue): Task {
    const project: Project = {
      id: issue.repository.id,
      platformId: issue.repository.id,
      platformURL: new URL(issue.repository.html_url),
      platformName: PlatformName.Github,
      name: issue.repository.name,
      description: issue.repository.description,
      iconUrl: issue.repository.owner.avatar_url,
      colorHex: "#000000",
      owner: issue.repository.owner.login,
      slug: issue.repository.name,
    };

    const creator: User = {
      platformURL: new URL(issue.user.html_url),
      displayName: issue.user.login,
      avatarUrl: issue.user.avatar_url,
    };

    const assigned: User[] = issue.assignees.map((assignee) => {
      return {
        platformURL: new URL(assignee.html_url),
        displayName: assignee.login,
        avatarUrl: assignee.avatar_url,
      };
    });

    const labels: Label[] = issue.labels.map((label) => {
      return {
        name: label.name,
        colorHex: label.color,
      };
    });

    const task: Task = {
      createdAt: new Date(issue.created_at),
      updatedAt: new Date(issue.updated_at),
      id: issue.id,
      project: project,
      taskURL: new URL(issue.html_url),
      title: issue.title,
      description: issue.body,
      // startDate: null, // GitHub API does not provide a start date for issues
      // dueDate: issue.closed_at ? new Date(issue.closed_at) : null,
      // estimatedTime: null,
      // GitHub API does not provide an estimated time for issues
      // loggedTime: null,
      // GitHub API does not provide a logged time for issues
      assigned: assigned,
      creator: creator,
      isCompleted: issue.state === "closed",
      labels: labels,
      // GitHub API does not provide a priority for issues
      priority: 1 as Priority,
    };

    return task;
  }
}
