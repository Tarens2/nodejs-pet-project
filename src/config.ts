export const PORT = process.env.PORT || 9292;
export const WITH_SEEDS = process.env.WITH_SEEDS || false;
export const GITHUB_KEY = '323b287599d517f4c005';
export const GITHUB_SECRET = 'bdec50e6dd7ff9d17740c1dd437e40e076a50f56';
export const APP_SECRET = 'keyboard cat';
export const JWT_SECRET = 'keyboard cat';
export const GITHUB_CONFIG = {
  clientID: GITHUB_KEY,
  clientSecret: GITHUB_SECRET,
  callbackURL: 'http://localhost:3000/authenticated',
  scope: ['user:email'],
};

export const LOCAL_CONFIG = {
  usernameField: 'username',
  passwordField: 'password',
  session: false,
};

export default {
  JWT_SECRET,
  GITHUB_CONFIG,
  LOCAL_CONFIG,
};
