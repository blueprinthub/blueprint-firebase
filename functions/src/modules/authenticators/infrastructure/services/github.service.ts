import axios from "axios";
import { ConfigService } from "../../../../common/config/config.service";
import { AuthenticatorType } from "../../domain/entities";
import { Access } from "../../domain/entities/access.entity";
import { OAuthClaim } from "../../domain/entities/claim-access.entity";
import { UserData } from "../../domain/entities/user-data.entity";
import { OAuth2Repository } from "../../domain/repositories/oauth2.repository";

/**
 * An OAuth2 strategy for Github.
 */
export class GithubOAuthStrategy implements OAuth2Repository {
  constructor(private readonly config: ConfigService) {}

  /**
   * Claims access to Github.
   *
   * @param claim - The OAuth claim.
   * @returns An access object.
   */
  async claimAccess(claim: OAuthClaim): Promise<Omit<Access, "user">> {
    const { data } = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: this.config.get<string>("github.clientId"),
        client_secret: this.config.get<string>("github.clientSecret"),
        redirect_uri: this.config.get<string>("github.redirectURI"),
        code: claim.code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      },
    );
    return {
      accessToken: data.access_token,
      platformName: "github",
      type: AuthenticatorType.Task,
    };
  }

  /**
   * Gets the user data associated with an access object.
   *
   * @param access - The access object.
   * @returns The user data.
   */
  async getUser(access: Omit<Access, "user">): Promise<UserData> {
    const { data } = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access.accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
      },
    });
    return {
      gid: data.node_id,
      email: data.email,
      name: data.name,
    };
  }
}
