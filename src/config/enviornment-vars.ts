const defaults = {
  BASE_HREF: 'http://localhost:8080/home',
};

export enum VarName {
  BaseHref = 'BASE_HREF',
  ClientId = 'OAUTH_CLIENT_ID',
  Issuer = 'OAUTH_ISSUER',
  Testing = 'OAUTH_TESTING',
  Audience = 'OAUTH_AUDIENCE',
  AppClientId = 'OAUTH_APP_CLIENT_ID',
}

export const env = {
  ...defaults,
  ...process.env,
};

export const System = {
  getProperty(varName: VarName): string {
    return env[varName];
  }
};