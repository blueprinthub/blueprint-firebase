/* eslint-disable require-jsdoc */
import {Firestore} from "firebase-admin/firestore";
import {Task} from "../../../domain/entities/task.entity";
import {
  RemoteRepository,
} from "../../../domain/repositories/factories/impl/remote.repository";


export abstract class AbstractRemoteRepository<RemoteTask>
implements RemoteRepository {
  constructor(private readonly firestore:Firestore) {}

  async getAccess(uid:string, authenticatorId:string):Promise<string> {
    const accessFirestoreDoc = await this.firestore
      .collection("user")
      .doc(uid)
      .collection("authenticators")
      .doc(authenticatorId)
      .get();

    const accessToken:string = accessFirestoreDoc.get("accessToken");
    return accessToken;
  }

  abstract getTasks(accessToken:string):Promise<RemoteTask[]>

  abstract mapper(remoteTask:RemoteTask):Task;

  async pull(
    uid: string,
    authenticatorId:string,
    lastPulledTask?: Task): Promise<Task[]> {
    const accessToken = await this.getAccess(uid, authenticatorId);
    const nativeTasks = await this.getTasks(accessToken);
    console.log({lastPulledTask});
    return nativeTasks.map(this.mapper);
  }
}
