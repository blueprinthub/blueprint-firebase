/**
 * Data required to claim the user's auth data
 */
export interface OAuthClaim {
  /**
   * Code to claim the user's auth data in OAuth2 protocol
   */
  code: string;

  /**
   * platform - Name of the platform
   */
  platform: string;
}
