import { User } from "@prisma/client";
import { sendMessage } from "../kafka/producer";
import { TOPICS } from "../config/topics";
import { logger } from "../logger/logger";
import { NotificationEvent } from "../types/types";

enum EMAIL_TEMPLATES {
	FIRST_VIEW = "first_view",
	COMMENT = "comment",
	TRANSCRIPT_SUCCESS = "transcript_success",
	TRANSCRIPT_FAILURE = "transcript_failure",
	WORKSPACE_REMOVE = "workspace_remove",
	WORKSPACE_DELETE = "workspace_delete",
	VIDEO_SHARE = "video_share",
}

/**
 * Generic function to send email notifications.
 */
function sendEmailNotification(
	user: User,
	data: NotificationEvent,
	template: EMAIL_TEMPLATES
) {
	if (!user.email) {
		logger.warn(`Skipping email notification: User ${user.id} has no email.`);
		return;
	}

	logger.info(`Sending ${template} email to user:`, user.email);

	const message = {
		template,
		email: user.email,
		...data,
	};

	// Send message to the email notification service via Kafka
	sendMessage(TOPICS.EMAIL_NOTIFICATION, JSON.stringify(message));
}

// Specific email notification functions using the generic function
export const sendFirstViewEmail = (user: User, data: NotificationEvent) =>
	sendEmailNotification(user, data, EMAIL_TEMPLATES.FIRST_VIEW);

export const sendCommentEmail = (user: User, data: NotificationEvent) =>
	sendEmailNotification(user, data, EMAIL_TEMPLATES.COMMENT);

export const sendTranscriptSuccessEmail = (
	user: User,
	data: NotificationEvent
) => sendEmailNotification(user, data, EMAIL_TEMPLATES.TRANSCRIPT_SUCCESS);

export const sendTranscriptFailureEmail = (
	user: User,
	data: NotificationEvent
) => sendEmailNotification(user, data, EMAIL_TEMPLATES.TRANSCRIPT_FAILURE);

export const sendWorkspaceRemoveEmail = (user: User, data: NotificationEvent) =>
	sendEmailNotification(user, data, EMAIL_TEMPLATES.WORKSPACE_REMOVE);

export const sendWorkspaceDeleteEmail = (user: User, data: NotificationEvent) =>
	sendEmailNotification(user, data, EMAIL_TEMPLATES.WORKSPACE_DELETE);

export const sendVideoShareEmail = (user: User, data: NotificationEvent) =>
	sendEmailNotification(user, data, EMAIL_TEMPLATES.VIDEO_SHARE);
