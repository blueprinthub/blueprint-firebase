/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";
import {injectable} from "tsyringe";
import {ConnectOAuth} from "../../domain/usecases/connect-oauth.usecase";

export type ConnectData = {
  code:string;
  platform:string;
}

@injectable()
export class ConnectController {
  constructor(public connect:ConnectOAuth) {}

  async execute(data:ConnectData, context:functions.https.CallableContext) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const uid = context!.auth!.uid;
    const {code, platform} = data;
    await this.connect.execute({code, platform}, uid);
  }
}
