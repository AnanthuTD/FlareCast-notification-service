import { cleanEnv, str, port, url } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging'],
  }),
  PORT: port(),
  DATABASE_URL: url(),
  ACCESS_TOKEN_SECRET: str(),
});

export default env;
