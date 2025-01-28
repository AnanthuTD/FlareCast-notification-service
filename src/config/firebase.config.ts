import admin from "firebase-admin";
import env from "../env";
import { logger } from "../logger/logger";
import { existsSync } from "node:fs";

export enum FCMRoles {
	ADMIN = "admin",
	USER = "user",
}

const options: admin.AppOptions = {};

const { FIREBASE_SERVICE_ACCOUNT_FILE_PATH, FIREBASE_SERVICE_ACCOUNT_OBJECT } =
	env;

// Initialize Firebase admin SDK using either the service account key file or inline credentials
if (
	FIREBASE_SERVICE_ACCOUNT_FILE_PATH &&
	existsSync(FIREBASE_SERVICE_ACCOUNT_FILE_PATH)
) {
	// Use the key file if it exists
	options.credential = admin.credential.cert(
		FIREBASE_SERVICE_ACCOUNT_FILE_PATH
	);
	logger.info("Using service account key file for authentication.");
} else if (FIREBASE_SERVICE_ACCOUNT_OBJECT) {
	// Fall back to inline credentials if the file isn't available
	options.credential = admin.credential.cert(
		JSON.parse(FIREBASE_SERVICE_ACCOUNT_OBJECT)
	);
	logger.info("Using inline service account credentials for authentication.");
} else {
	throw new Error(
		"Neither FIREBASE_SERVICE_ACCOUNT_FILE_PATH nor FIREBASE_SERVICE_ACCOUNT_OBJECT is available."
	);
}

admin.initializeApp(options);

export default admin;
