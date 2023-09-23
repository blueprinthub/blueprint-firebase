/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";
import {injectable} from "tsyringe";
import {ConnectOAuth} from "../../domain/usecases/connect-oauth.usecase";
import {AuthenticatorType} from "../../domain/entities";

export type ConnectData = {
  code:string;
  platform:string;
  type: AuthenticatorType,
}

@injectable()
export class ConnectController {
  constructor(public connect:ConnectOAuth) {}

  async execute(data:ConnectData, context:functions.https.CallableContext) {
    const uid = context.auth?.uid;
    if (!uid) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "This method requires an authorized user"
      );
    }
    await this.connect.execute(data, uid);
  }
}
