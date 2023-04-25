import {Access} from "../entities/access.entity";
import {OAuthClaim} from "../entities/claim-access.entity";

export interface OAuth2Repository{
  claimAccess(claim:OAuthClaim):Promise<Omit<Access, "user">>
  getUser(access:Omit<Access, "user">):Promise<Access["user"]>
}
