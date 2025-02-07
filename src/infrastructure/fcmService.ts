import { Message } from "firebase-admin/messaging";
import admin from "../config/firebase.config";
import { logger } from "../logger/logger";

class FCMService {
	async sendMessageToUser(message: Message): Promise<void> {
		try {
			logger.debug("message sent to user: " + JSON.stringify(message, null, 2));
			const response = await admin.messaging().send(message);

			console.log("Successfully sent message:", response);
		} catch (error) {
			console.error("Error sending FCM message:", error);
		}
	}
}

export default new FCMService();
