import "reflect-metadata";
import { container } from "tsyringe";
import { OAuthClaim } from "../../domain/entities/claim-access.entity";
import { OAuth2RepositoryContext } from "./oauth2.repository";
import { AsanaOAuthStrategy } from "../services/asana.service";
import { GithubOAuthStrategy } from "../services/github.service";
import { JiraOAuthStrategy } from "../services/jira.service";
import { Access } from "../../domain/entities/access.entity";

const configServiceMock = {
  get: jest.fn(),
};

jest.mock("../services/jira.service");
jest.mock("../services/asana.service");
jest.mock("../services/github.service");

describe("OAuth2RepositoryContext", () => {
  let repoContext: OAuth2RepositoryContext;

  beforeEach(() => {
    container.register("config", { useValue: configServiceMock });
    repoContext = container.resolve(OAuth2RepositoryContext);
  });

  describe("claimAccess", () => {
    it("should call JiraOAuthStrategy when platform = jira", async () => {
      const claimAccess = jest.spyOn(JiraOAuthStrategy.prototype, "claimAccess").mockImplementation();
      const getUser = jest.spyOn(JiraOAuthStrategy.prototype, "getUser").mockImplementation();

      const claim: OAuthClaim = { platform: "jira", code: "abc" };
      const access: Omit<Access, "user"> = {
        accessToken: "test-token",
        platformName: "jira",
      };

      await repoContext.claimAccess(claim);
      await repoContext.getUser(access);

      expect(claimAccess).toHaveBeenCalledWith(claim);
      expect(getUser).toHaveBeenCalledWith(access);
    });

    it("should call AsanaOAuthStrategy when platform = asana", async () => {
      const claimAccess = jest.spyOn(AsanaOAuthStrategy.prototype, "claimAccess").mockImplementation();
      const getUser = jest.spyOn(AsanaOAuthStrategy.prototype, "getUser").mockImplementation();

      const claim: OAuthClaim = { platform: "asana", code: "abc" };
      const access: Omit<Access, "user"> = {
        accessToken: "test-token",
        platformName: "asana",
      };

      await repoContext.claimAccess(claim);
      await repoContext.getUser(access);

      expect(claimAccess).toHaveBeenCalledWith(claim);
      expect(getUser).toHaveBeenCalledWith(access);
    });

    it("should call GithubOAuthStrategy when platform = github", async () => {
      const claimAccess = jest.spyOn(GithubOAuthStrategy.prototype, "claimAccess").mockImplementation();
      const getUser = jest.spyOn(GithubOAuthStrategy.prototype, "getUser").mockImplementation();

      const claim: OAuthClaim = { platform: "github", code: "abc" };
      const access: Omit<Access, "user"> = {
        accessToken: "test-token",
        platformName: "github",
      };

      await repoContext.claimAccess(claim);
      await repoContext.getUser(access);

      expect(claimAccess).toHaveBeenCalledWith(claim);
      expect(getUser).toHaveBeenCalledWith(access);
    });
  });
});
