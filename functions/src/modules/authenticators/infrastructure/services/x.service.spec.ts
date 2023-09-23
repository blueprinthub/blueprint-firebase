import axios from "axios";
import { AsanaOAuthStrategy } from "./asana.service";
import { GithubOAuthStrategy } from "./github.service";
import { JiraOAuthStrategy } from "./jira.service";

jest.mock("axios");

const configMock = {
  get: jest.fn(),
};

describe("OAuth2Repository", () => {
  let axiosMock: jest.Mocked<typeof axios>;

  beforeEach(() => {
    axiosMock = axios as jest.Mocked<typeof axios>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("claimAccess", () => {
    test.each([
      {
        repo: new JiraOAuthStrategy(configMock as never),
        platform: "jira",
        urlPrefix: "https://auth.atlassian.com",
      },
      {
        repo: new AsanaOAuthStrategy(configMock as never),
        platform: "asana",
        urlPrefix: "https://app.asana.com",
      },
      { repo: new GithubOAuthStrategy(configMock as never), platform: "aithub", urlPrefix: "https://github.com" },
    ])("should call $platform identity provider with correct url", async ({ repo, platform, urlPrefix }) => {
      const post = axiosMock.post.mockResolvedValue({
        data: {
          accessToken: "test-token",
          platformName: platform,
        },
      });
      await repo.claimAccess({ code: "test-code" } as never);
      expect(post).toHaveBeenCalledWith(expect.stringContaining(urlPrefix), expect.anything(), expect.anything());
    });
  });

  describe("getUser", () => {
    test.each([
      {
        repo: new JiraOAuthStrategy(configMock as never),
        platform: "jira",
        urlPrefix: "https://api.atlassian.com",
      },
      {
        repo: new AsanaOAuthStrategy(configMock as never),
        platform: "asana",
        urlPrefix: "https://app.asana.com/api",
      },
      {
        repo: new GithubOAuthStrategy(configMock as never),
        platform: "aithub",
        urlPrefix: "https://api.github.com",
      },
    ])("should call $platform identity provider with correct url", async ({ repo, urlPrefix }) => {
      const get = axiosMock.get.mockResolvedValue({
        data: {
          gid: "test-gid",
          email: "test-email",
          name: "test-name",
          data: {
            // only for asana
            gid: "test-gid",
            email: "test-email",
            name: "test-name",
          },
        },
      });
      await repo.getUser({ accessToken: "test-code" } as never);
      expect(get).toHaveBeenCalledWith(expect.stringContaining(urlPrefix), expect.anything());
    });
  });
});
