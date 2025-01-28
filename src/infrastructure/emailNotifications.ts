import { User } from "@prisma/client";
import { sendMessage } from "../kafka/producer";
import { TOPICS } from "../config/topics";
import { NotificationEvent } from "../kafka";
import { logger } from "../logger/logger";

export function sendFirstViewEmail(user: User, data: NotificationEvent) {
	logger.info("Sending first view email to user:", user.email);
	const message = {
		template: "FIRST_VIEW",
		email: user.email,
		...data,
	};

	sendMessage(TOPICS.EMAIL_NOTIFICATION, JSON.stringify(message));
}
