import { cleanEnv, str, port, url } from "envalid";

const env = cleanEnv(process.env, {
	NODE_ENV: str({
		choices: ["development", "test", "production", "staging"],
	}),
	PORT: port(),
	DATABASE_URL: url(),
	ACCESS_TOKEN_SECRET: str(),
	KAFKA_BROKER: str(),
	GRAFANA_HOST: str(),
	LOKI_API_KEY: str(),
	LOKI_USER_ID: str(),
	FIREBASE_SERVICE_ACCOUNT_FILE_PATH: str({ default: "" }),
	FIREBASE_SERVICE_ACCOUNT_OBJECT: str({ default: "" }),
});

export default env;
