import { configFactory, ConfigService, OAuth2Config, WebConfig } from "./config.service";

const testConfig = {
  web: {
    baseUrl: "http://example.com",
  },
  jira: {
    clientId: "JIRA_CLIENT_ID",
    clientSecret: "JIRA_CLIENT_SECRET",
    redirectURI: "http://example.com/auth/jira/callback",
  },
};

describe("ConfigService", () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService(testConfig);
  });

  describe("get", () => {
    it("should retrieve web config", () => {
      const webConfig: WebConfig = configService.get("web");
      expect(webConfig.baseUrl).toEqual("http://example.com");
    });

    it("should retrieve OAuth2 config", () => {
      const jiraConfig: OAuth2Config = configService.get("jira");
      expect(jiraConfig.clientId).toEqual("JIRA_CLIENT_ID");
      expect(jiraConfig.clientSecret).toEqual("JIRA_CLIENT_SECRET");
      expect(jiraConfig.redirectURI).toEqual("http://example.com/auth/jira/callback");
    });

    it("should retrieve config joined by '.'", () => {
      expect(configService.get("jira.clientId")).toEqual("JIRA_CLIENT_ID");
      expect(configService.get("jira.clientSecret")).toEqual("JIRA_CLIENT_SECRET");
    });

    it("should return undefined for non-existent key", () => {
      const nonExistent: undefined = configService.get("non.existent");
      expect(nonExistent).toBeUndefined();
    });
  });
});

describe("configFactory", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = {
      ...OLD_ENV,
      BASE_URL: "http://example.com",
      JIRA_CLIENT_ID: "JIRA_CLIENT_ID",
      JIRA_CLIENT_SECRET: "JIRA_CLIENT_SECRET",
      JIRA_REDIRECT_URI: "http://example.com/auth/jira/callback",
    };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("should return a ConfigService instance with values from process.env", () => {
    const configService: ConfigService = configFactory();

    expect(configService.get("web.baseUrl")).toEqual("http://example.com");

    expect(configService.get("jira.clientId")).toEqual("JIRA_CLIENT_ID");
    expect(configService.get("jira.clientSecret")).toEqual("JIRA_CLIENT_SECRET");
    expect(configService.get("jira.redirectURI")).toEqual("http://example.com/auth/jira/callback");
  });

  // eslint-disable-next-line max-len
  it("should return a ConfigService instance with empty values if process.env is not set", () => {
    delete process.env.BASE_URL;
    delete process.env.JIRA_CLIENT_ID;
    delete process.env.JIRA_CLIENT_SECRET;
    delete process.env.JIRA_REDIRECT_URI;

    const configService: ConfigService = configFactory();

    expect(configService.get("web.baseUrl")).toEqual("");

    expect(configService.get("jira.clientId")).toEqual("");
    expect(configService.get("jira.clientSecret")).toEqual("");
    expect(configService.get("jira.redirectURI")).toEqual("");
  });
});
