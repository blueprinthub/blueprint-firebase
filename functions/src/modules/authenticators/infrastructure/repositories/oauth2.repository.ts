/* eslint-disable require-jsdoc */
import {inject, injectable} from "tsyringe";
import {ConfigService} from "../../../../common/config/config.service";
import {Access} from "../../domain/entities/access.entity";
import {OAuthClaim} from "../../domain/entities/claim-access.entity";
import {UserData} from "../../domain/entities/user-data.entity";
import {OAuth2Repository} from "../../domain/repositories/oauth2.repository";
import {AsanaOAuthStrategy} from "../services/asana.service";
import {GithubOAuthStrategy} from "../services/github.service";
import {JiraOAuthStrategy} from "../services/jira.service";

@injectable()
export class OAuth2RepositoryContext implements OAuth2Repository {
  private strategy!:OAuth2Repository;

  constructor(@inject("config") private readonly config:ConfigService) {}

  private setStrategy(name:string) {
    switch (name) {
    case "jira":
      this.strategy = new JiraOAuthStrategy(this.config);
      break;
    case "asana":
      this.strategy = new AsanaOAuthStrategy(this.config);
      break;
    case "github":
      this.strategy = new GithubOAuthStrategy(this.config);
      break;
    }
  }

  async claimAccess(claim: OAuthClaim): Promise<Omit<Access, "user">> {
    this.setStrategy(claim.platform);
    return await this.strategy.claimAccess(claim);
  }
  async getUser(access: Omit<Access, "user">): Promise<UserData> {
    return await this.strategy.getUser(access);
  }
}
