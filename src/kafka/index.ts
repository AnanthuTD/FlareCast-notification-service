import { TOPICS } from "../config/topics";
import { logger } from "../logger/logger";
import { createTopic } from "./admin";
import { consumeMessages } from "./consumer";
import { notificationEventHandler } from "./handlers/notificationEvent.handler";
import { handleUserVerifiedEvent } from "./handlers/userVerifiedEvent.handler";
import { invitationStatusUpdateHandler } from "./handlers/invitationStatusUpdate.handler";

// Create topics and start consuming messages
createTopic([TOPICS.EMAIL_NOTIFICATION, TOPICS.NOTIFICATION_EVENT]).then(() => {
	logger.info("✅ Topic created successfully");

	// Define topic handlers
	const topicHandlers = {
		[TOPICS.USER_VERIFIED_EVENT]: handleUserVerifiedEvent,
		[TOPICS.NOTIFICATION_EVENT]: notificationEventHandler,
		[TOPICS.INVITATION_STATUS_UPDATE]: invitationStatusUpdateHandler,
	};

	// Start consuming messages
	consumeMessages(topicHandlers).catch((error) => {
		logger.error("Failed to start consumer:", error);
	});
});
