/* eslint-disable require-jsdoc */
import {inject, injectable} from "tsyringe";
import {OAuthClaim} from "../entities/claim-access.entity";
import {AccessRepository} from "../repositories/access.repository";
import {OAuth2Repository} from "../repositories/oauth2.repository";

@injectable()
export class ConnectOAuth {
  constructor(
    @inject("AccessRepository") private readonly accessRepo: AccessRepository,
    @inject("OAuth2Repository") private readonly oauthRepo: OAuth2Repository
  ) {}

  async execute(claim:OAuthClaim, uid:string):Promise<void> {
    const accessWithoutUser = await this.oauthRepo.claimAccess(claim);
    const user = await this.oauthRepo.getUser(accessWithoutUser);

    const access = {...accessWithoutUser, user};

    await this.accessRepo.save(access, uid);
  }
}
