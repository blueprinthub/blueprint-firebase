/* eslint-disable require-jsdoc */
export class ConfigService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private dict: any) {}

  public get<T>(key: string): T {
    const properties = key.split(".");
    return properties.reduce((conf, subkey) => conf && conf[subkey], this.dict) as T;
  }
}

export interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  redirectURI: string;
}

export interface WebConfig {
  baseUrl: string;
}

export interface Config {
  web: WebConfig;
  jira: OAuth2Config;
  github: OAuth2Config;
  asana: OAuth2Config;
  google: OAuth2Config;
}

export function configFactory(): ConfigService {
  const { env } = process;

  const configDict: Config = {
    web: {
      baseUrl: env.BASE_URL || "",
    },
    jira: {
      clientId: env.JIRA_CLIENT_ID || "",
      clientSecret: env.JIRA_CLIENT_SECRET || "",
      redirectURI: env.JIRA_REDIRECT_URI || "",
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID || "",
      clientSecret: env.GITHUB_CLIENT_SECRET || "",
      redirectURI: env.GITHUB_REDIRECT_URI || "",
    },
    asana: {
      clientId: env.ASANA_CLIENT_ID || "",
      clientSecret: env.ASANA_CLIENT_SECRET || "",
      redirectURI: env.ASANA_REDIRECT_URI || "",
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
      redirectURI: env.GOOGLE_REDIRECT_URI || "",
    },
  };

  return new ConfigService(configDict);
}
