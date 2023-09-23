import { Label, PlatformName, Priority, User } from "../../../domain/entities/entities";
import { Project } from "../../../domain/entities/project.entity";
import { Task } from "../../../domain/entities/task.entity";
import { GithubIssue } from "../github.service";

/* eslint-disable require-jsdoc */
export class GithubMapper {
  static map(issue: GithubIssue): Task {
    console.log({ issue });
    const project: Project = {
      id: issue.repository?.id,
      platformId: issue.repository?.id,
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
      project,
      taskURL: new URL(issue.html_url),
      title: issue.title,
      description: issue.body,
      // startDate: null, // GitHub API does not provide a start date for issues
      // dueDate: issue.closed_at ? new Date(issue.closed_at) : null,
      // estimatedTime: null,
      // GitHub API does not provide an estimated time for issues
      // loggedTime: null,
      // GitHub API does not provide a logged time for issues
      assigned,
      creator,
      isCompleted: issue.state === "closed",
      labels,
      // GitHub API does not provide a priority for issues
      priority: 1 as Priority,
    };

    return task;
  }
}
