/* eslint-disable require-jsdoc */
import {Task} from "../../domain/entities/task.entity";
import {
  AbstractRemoteRepository,
} from "../repositories/factories/remote.repository.abstract";

type GithubTask = {
  id:string;
  title:string
}

export class GithubRemoteRepository
  extends AbstractRemoteRepository<GithubTask> {
  async getTasks(accessToken: string): Promise<GithubTask[]> {
    return [
      {id: "blabla", title: "blabla"},
      {id: "blablabla", title: "blablabla"},
    ];
  }
  mapper(remoteTask: GithubTask): Task {
    throw new Error("NotImplementedException");
  }
}
