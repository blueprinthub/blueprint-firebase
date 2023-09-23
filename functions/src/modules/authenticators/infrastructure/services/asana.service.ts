/* eslint-disable require-jsdoc */
import {ConfigService} from "../../../../common/config/config.service";
import {Access} from "../../domain/entities/access.entity";
import {OAuthClaim} from "../../domain/entities/claim-access.entity";
import {UserData} from "../../domain/entities/user-data.entity";
import {OAuth2Repository} from "../../domain/repositories/oauth2.repository";
import axios from "axios";

export class AsanaOAuthStrategy implements OAuth2Repository {
  constructor(private readonly config:ConfigService) {}

  async claimAccess(claim: OAuthClaim): Promise<Omit<Access, "user">> {
    const {data} = await axios.post("https://app.asana.com/-/oauth_token",
      {
        grant_type: "authorization_code",
        client_id: this.config.get<string>("asana.clientId"),
        client_secret: this.config.get<string>("asana.clientSecret"),
        redirect_uri: this.config.get<string>("asana.redirectURI"),
        code: claim.code,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      platformName: "asana",
      type: claim.type,
    };
  }
  async getUser(access: Omit<Access, "user">): Promise<UserData> {
    const {data} = await axios.get("https://app.asana.com/api/1.0/users/me", {headers: {
      Authorization: `Bearer ${access.accessToken}`,
    }});
    return {
      gid: data.data.gid,
      email: data.data.email,
      name: data.data.name,
    };
  }
}
