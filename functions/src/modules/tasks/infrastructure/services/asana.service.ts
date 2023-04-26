/* eslint-disable require-jsdoc */
import {Task} from "../../domain/entities/task.entity";
import {
  AbstractRemoteRepository,
} from "../repositories/factories/remote.repository.abstract";

type AsanaTask = {
  id:string;
  title:string
}

export class AsanaRemoteRepository extends AbstractRemoteRepository<AsanaTask> {
  async getTasks(accessToken: string): Promise<AsanaTask[]> {
    return [
      {id: "blabla", title: "blabla"},
      {id: "blablabla", title: "blablabla"},
    ];
  }
  mapper(remoteTask: AsanaTask): Task {
    throw new Error("NotImplementedException");
  }
}
