import { inject, injectable } from "tsyringe";
import { OAuthClaim } from "../entities/claim-access.entity";
import { AccessRepository } from "../repositories/access.repository";
import { OAuth2Repository } from "../repositories/oauth2.repository";

/**
 * Use case to connect an OAuth2 authenticator to a user.
 */
@injectable()
export class ConnectOAuth {
  private readonly accessRepo: AccessRepository;
  private readonly oauthRepo: OAuth2Repository;

  /**
   * Constructor.
   *
   * @param accessRepo - The AccessRepository.
   * @param oauthRepo - The OAuth2Repository.
   */
  constructor(
    @inject("AccessRepository") accessRepo: AccessRepository,
    @inject("OAuth2Repository") oauthRepo: OAuth2Repository,
  ) {
    this.accessRepo = accessRepo;
    this.oauthRepo = oauthRepo;
  }

  /**
   * Save an authenticator for the user.
   *
   * @param claim - The OAuth claim.
   * @param uid - The user ID.
   */
  async execute(claim: OAuthClaim, uid: string): Promise<void> {
    const accessWithoutUser = await this.oauthRepo.claimAccess(claim);
    const user = await this.oauthRepo.getUser(accessWithoutUser);

    const access = { ...accessWithoutUser, user };

    await this.accessRepo.save(access, uid);
  }
}
