/* eslint-disable require-jsdoc */
import {ConfigService} from "../../../../common/config/config.service";
import {Access} from "../../domain/entities/access.entity";
import {OAuthClaim} from "../../domain/entities/claim-access.entity";
import {UserData} from "../../domain/entities/user-data.entity";
import {OAuth2Repository} from "../../domain/repositories/oauth2.repository";
import axios from "axios";

export class JiraOAuthStrategy implements OAuth2Repository {
  constructor(private readonly config:ConfigService) {}

  async claimAccess(claim: OAuthClaim): Promise<Omit<Access, "user">> {
    const {data} = await axios.post("https://auth.atlassian.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: this.config.get<string>("jira.clientId"),
        client_secret: this.config.get<string>("jira.clientSecret"),
        redirect_uri: this.config.get<string>("jira.redirectURI"),
        code: claim.code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      });
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      platformName: "jira",
    };
  }
  async getUser(access: Omit<Access, "user">): Promise<UserData> {
    const {data} = await axios.get("https://api.atlassian.com/me", {headers: {
      Authorization: `Bearer ${access.accessToken}`,
    }});
    return {
      gid: data.account_id,
      email: data.email,
      name: data.name,
    };
  }
}
