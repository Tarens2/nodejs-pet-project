require('dotenv').config();

export const PORT = process.env.PORT || 9292;
export const WITH_SEEDS = process.env.WITH_SEEDS || false;
export const GITHUB_CONFIG = {
  clientID: process.env.GITHUB_KEY,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: 'http://localhost:3000/authenticated',
  scope: ['user:email'],
};

export const LOCAL_CONFIG = {
  usernameField: 'username',
  passwordField: 'password',
  session: false,
};

export default {
  GITHUB_CONFIG,
  LOCAL_CONFIG,
};
