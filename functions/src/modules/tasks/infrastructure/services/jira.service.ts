/* eslint-disable require-jsdoc */
import {Task} from "../../domain/entities/task.entity";
import {
  AbstractRemoteRepository,
} from "../repositories/factories/remote.repository.abstract";

type JiraTask = {
  id:string;
  title:string
}

export class JiraRemoteRepository extends AbstractRemoteRepository<JiraTask> {
  async getTasks(accessToken: string): Promise<JiraTask[]> {
    return [
      {id: "blabla", title: "blabla"},
      {id: "blablabla", title: "blablabla"},
    ];
  }
  mapper(remoteTask: JiraTask): Task {
    return {
      ...remoteTask,
      platformId: "jira",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
