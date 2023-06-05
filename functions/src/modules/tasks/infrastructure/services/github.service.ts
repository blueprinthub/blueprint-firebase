import axios from "axios";
import { Task } from "../../domain/entities/task.entity";
import {
  AbstractRemoteRepository,
} from "../repositories/factories/remote.repository.abstract";
import { PlatformName } from "../../domain/entities/platform.enum";

/**
 * Represents a task in Github. Since in github, a task can mean different things, 
 * we need to have a union type to represent all the possible tasks.
 * 
 * 
 */
type GithubTask = GithubIssue | GithubPullRequest;

/**
 * Represents a Github Pull Request
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
/**
 * Represents a Github Issue
 */
interface GithubIssue {
  number: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  html_url: string;
}
export class GithubRemoteRepository
  extends AbstractRemoteRepository<GithubTask> {
  private GITHUB_API_URL = "https://api.atlassian.com/oauth/token/accessible-resources";

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
          filter: 'assigned'
        }
      });

      if (response.status === 200) {
        return response.data.map((issue: any) => ({
          number: issue.number,
          title: issue.title,
          body: issue.body
        }));
      } else {
        throw new Error('Failed to fetch issues.');
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
        //TODO: fetch user pull requests
      ]
    );

    return userGithubTasks.flat();
  }
  mapper(issue: GithubTask): Task {
    return {
      title: issue.title,
      estimatedTime: undefined,
      description: issue.body,
      isCompleted: false,
      createdAt: new Date(issue.created_at),
      updatedAt: new Date(issue.updated_at),
      dueDate: issue.due_date ? new Date(issue.due_date) : undefined,
      permalink: issue.html_url,
      startDate: new Date(),
      loggedTime: 0,
      priority: 3,
      project: {
        platformName: PlatformName.Github,
        name: 'Project Name',
        iconUrl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
      },
      creator: {
        displayName: 'Creator Name',
        permalink: '',
        iconUrl: ''
      },
      assigned: [],
    }
  }
}
