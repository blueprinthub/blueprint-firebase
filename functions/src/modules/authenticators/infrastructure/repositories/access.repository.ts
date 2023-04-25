/* eslint-disable require-jsdoc */
import {Firestore} from "firebase-admin/firestore";
import {inject, injectable} from "tsyringe";
import {Access} from "../../domain/entities/access.entity";
import {AccessRepository} from "../../domain/repositories/access.repository";

@injectable()
export class FirestoreAccessRepository implements AccessRepository {
  constructor(@inject("firestore") private readonly firestore:Firestore ) {}

  async save(access: Access, uid:string): Promise<void> {
    await this.firestore
      .collection("users")
      .doc(uid)
      .collection("authenticators")
      .add(access);
  }
}
