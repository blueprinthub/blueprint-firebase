/* eslint-disable require-jsdoc */
import { inject, injectable } from "tsyringe";
import { PlatformName } from "../entities/platform.enum";
import { RemoteRepositoryFactory } from "../repositories/factories/remote.repository.factory";
import { TasksRepository } from "../repositories/tasks.repository";

@injectable()
export class PullTasks {
  constructor(
    @inject("TasksRepository") private readonly tasksRepo: TasksRepository,
    @inject("RemoteRepositoryFactory")
    private readonly remoteFactory: RemoteRepositoryFactory,
  ) {}

  async execute(platform: PlatformName, uid: string, authenticatorId: string): Promise<void> {
    const remoteRepo = this.remoteFactory.buildFor(platform);

    const lastTaskOrNone = await this.tasksRepo.fetchLastFromPlatform(platform, uid);

    const tasks = await remoteRepo.pull(uid, authenticatorId, lastTaskOrNone);

    await this.tasksRepo.add(tasks, uid);
  }
}
