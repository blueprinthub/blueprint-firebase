import { inject, injectable } from "tsyringe";
import { ConfigService } from "../../../../common/config/config.service";
import { Access } from "../../domain/entities/access.entity";
import { OAuthClaim } from "../../domain/entities/claim-access.entity";
import { UserData } from "../../domain/entities/user-data.entity";
import { OAuth2Repository } from "../../domain/repositories/oauth2.repository";
import { AsanaOAuthStrategy } from "../services/asana.service";
import { GithubOAuthStrategy } from "../services/github.service";
import { JiraOAuthStrategy } from "../services/jira.service";

/**
 * A context class for managing different OAuth2 strategies.
 */
@injectable()
export class OAuth2RepositoryContext implements OAuth2Repository {
  /**
   * The currently active OAuth2 strategy.
   */
  private strategy!: OAuth2Repository;

  constructor(@inject("config") private readonly config: ConfigService) {}

  /**
   * Sets the active OAuth2 strategy.
   *
   * @param name - The name of the strategy.
   */
  private setStrategy(name: string) {
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

  /**
   * Claims access to a third-party platform.
   *
   * @param claim - The OAuth claim.
   * @returns An access object.
   */
  async claimAccess(claim: OAuthClaim): Promise<Omit<Access, "user">> {
    this.setStrategy(claim.platform);
    return this.strategy.claimAccess(claim);
  }

  /**
   * Gets the user data associated with an access token.
   *
   * @param access - The access object.
   * @returns The user data.
   */
  async getUser(access: Omit<Access, "user">): Promise<UserData> {
    return this.strategy.getUser(access);
  }
}
