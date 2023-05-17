/* eslint-disable require-jsdoc */
import {Firestore} from "firebase-admin/firestore";
import generateApiKey from "generate-api-key";
import {inject, injectable} from "tsyringe";

const KEY_PREFIX = "bp-"; // bp for BluePrint

export interface ApiKeyService {
  generateUserKey(uid:string):Promise<string>;
  getUserByKey(key:string):Promise<string|null>
}

@injectable()
export class ApiKeyServiceImpl implements ApiKeyService {
  constructor(@inject("firestore") private readonly firestore:Firestore) {}

  async generateUserKey(uid: string): Promise<string> {
    const apiKey = KEY_PREFIX
      .concat(generateApiKey({method: "bytes", length: 32}) as string);

    await this.firestore.collection("users").doc(uid).update({apiKey});
    return apiKey;
  }
  async getUserByKey(key: string): Promise<string|null> {
    const queryResult =await this.firestore
      .collection("users")
      .where("apiKey", "==", key)
      .limit(1)
      .get();
    if (queryResult.empty) return null;
    const document = queryResult.docs[0];
    return document.id;
  }
}
