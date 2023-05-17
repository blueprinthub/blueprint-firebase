/* eslint-disable require-jsdoc */
import {inject, injectable} from "tsyringe";
import {Task} from "../entities/task.entity";
import {TasksRepository} from "../repositories/tasks.repository";

@injectable()
export class AddTask {
  constructor(
    @inject("TasksRepository") private readonly tasksRepo:TasksRepository,
  ) {}

  async execute(task:Task, uid:string):Promise<void> {
    await this.tasksRepo.add([task], uid);
  }
}
