/* eslint-disable require-jsdoc */
import {Firestore} from "firebase-admin/firestore";
import {inject, injectable} from "tsyringe";
import {PlatformName} from "../../domain/entities/platform.enum";
import {Task} from "../../domain/entities/task.entity";
import {TasksRepository} from "../../domain/repositories/tasks.repository";

@injectable()
export class FirestoreTasksRepository implements TasksRepository {
  constructor(@inject("firestore") private readonly firestore:Firestore) {}

  async add(tasks: Task[], uid: string): Promise<void> {
    const batch = this.firestore.batch();
    tasks.forEach((task) => {
      const taskRef = this.firestore
        .collection("users")
        .doc(uid)
        .collection("tasks")
        .doc();
      batch.set(taskRef, task);
    });

    await batch.commit();
  }

  async fetchLastFromPlatform(
    platform: PlatformName,
    uid: string): Promise<Task | undefined> {
    const taskQuerySnapshot = await this.firestore
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .where("platform", "==", platform)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    return taskQuerySnapshot.empty?
      taskQuerySnapshot.docs[0] as unknown as Task:undefined;
  }
}
