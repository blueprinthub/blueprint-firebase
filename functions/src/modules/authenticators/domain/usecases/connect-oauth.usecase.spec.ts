import "reflect-metadata";
import { container } from "tsyringe";
import { AccessRepository } from "../repositories/access.repository";
import { OAuth2Repository } from "../repositories/oauth2.repository";
import { OAuthClaim } from "../entities/claim-access.entity";
import { ConnectOAuth } from "./connect-oauth.usecase";
import { Access } from "../entities/access.entity";
import { UserData } from "../entities/user-data.entity";
import { AuthenticatorType } from "../entities";

describe("ConnectOAuth", () => {
  const uid = "user-id";
  const claim: OAuthClaim = {
    code: "test-code",
    platform: "jira",
    type: AuthenticatorType.Task,
  };
  const accessWithoutUser: Omit<Access, "user"> = {
    accessToken: "test-token",
    platformName: "jira",
    type: AuthenticatorType.Task,
  };
  const user: UserData = {
    gid: "test-jira-gid",
    email: "example@examle.com",
  };

  const accessRepoMock = {
    save: jest.fn(),
  } as unknown as AccessRepository;

  const oauthRepoMock = {
    claimAccess: jest.fn(() => accessWithoutUser),
    getUser: jest.fn(() => user),
  } as unknown as OAuth2Repository;

  let connectOAuth: ConnectOAuth;

  beforeEach(() => {
    container.register("AccessRepository", { useValue: accessRepoMock });
    container.register("OAuth2Repository", { useValue: oauthRepoMock });
    connectOAuth = container.resolve(ConnectOAuth);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(connectOAuth).toBeDefined();
  });

  it("should execute oauth connection", async () => {
    await connectOAuth.execute(claim, uid);

    expect(oauthRepoMock.claimAccess).toHaveBeenCalledWith(claim);
    expect(oauthRepoMock.getUser).toHaveBeenCalledWith(accessWithoutUser);
    expect(accessRepoMock.save).toHaveBeenCalledWith({ ...accessWithoutUser, user }, uid);
  });
});
