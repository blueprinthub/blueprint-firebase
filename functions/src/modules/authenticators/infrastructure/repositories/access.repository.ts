import { Firestore } from "firebase-admin/firestore";
import { inject, injectable } from "tsyringe";
import { Access } from "../../domain/entities/access.entity";
import { AccessRepository } from "../../domain/repositories/access.repository";

/**
 * Repository for saving and retrieving Access entities from Firestore.
 */
@injectable()
export class FirestoreAccessRepository implements AccessRepository {
  private readonly firestore: Firestore;

  /**
   * Constructor.
   *
   * @param firestore - The Firestore instance.
   */
  constructor(@inject("firestore") firestore: Firestore) {
    this.firestore = firestore;
  }

  /**
   * Saves an Access entity to Firestore.
   *
   * @param access - The Access entity to save.
   * @param uid - The user ID.
   * @returns A Promise that resolves to void.
   */
  async save(access: Access, uid: string): Promise<void> {
    console.log({ access, uid });
    await this.firestore
      .collection("users")
      .doc(uid)
      .collection("authenticators")
      // prevent multiple authenticators creation,
      // not sure if multiple authenticators must trigger tasksClone
      .doc(`${access.platformName}-${access.user.gid}`)
      .set(access);
  }
}
