import { AuthenticatorType } from "./authenticator-type.enum";

export interface OAuthClaim {
  code: string;
  platform: string;
  type: AuthenticatorType;
}
