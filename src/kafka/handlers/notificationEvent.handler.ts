import { User } from "@prisma/client";
import {
	sendFirstViewEmail,
	sendCommentEmail,
	sendTranscriptSuccessEmail,
	sendTranscriptFailureEmail,
	sendWorkspaceRemoveEmail,
	sendWorkspaceDeleteEmail,
	sendVideoShareEmail,
  sendWorkspaceInvitationEmail,
} from "../../infrastructure/emailNotifications";

import {
	sendFirstViewPushNotification,
	sendCommentPushNotification,
	sendTranscriptSuccessPushNotification,
	sendTranscriptFailurePushNotification,
	sendWorkspaceRemovePushNotification,
	sendWorkspaceDeletePushNotification,
	sendVideoSharePushNotification,
  sendWorkspaceInvitationPushNotification,
} from "../../infrastructure/pushNotifications";

import { logger } from "../../logger/logger";
import prisma from "../../prismaClient";
import { NOTIFICATION_EVENT_TYPE, NotificationEvent } from "../../types/types";

/**
 * Helper function to retrieve user and process notifications based on preferences.
 */
async function processNotification<T extends NotificationEvent>(
	event: T,
	getPreferences: (user: User) => { email?: boolean; push?: boolean } | null,
	sendEmail: (user: User, event: T) => void,
	sendPush: (user: User, event: T) => void
) {
	if (!event.userId) {
		logger.warn(`User not found for userId: ${event.userId}`);
		return false;
	}

	const user = await prisma.user.findUnique({
		where: { id: event.userId as string },
	});

	if (!user) {
		logger.warn(`User not found for userId: ${event.userId}`);
		return false;
	}

	logger.debug("User details:", JSON.stringify(user, null, 2));

	const prefs = getPreferences(user);
	if (prefs?.email) {
		await sendEmail(user, event);
	}
	if (prefs?.push) {
		await sendPush(user, event);
	}

	return true;
}

// Handlers for each event type
async function handleFirstView(event: NotificationEvent) {
	await processNotification(
		event,
		(user) => user.firstViewNotifications,
		sendFirstViewEmail,
		sendFirstViewPushNotification
	);
}

async function handleComment(event: NotificationEvent) {
	await processNotification(
		event,
		(user) => user.commentNotifications,
		sendCommentEmail,
		sendCommentPushNotification
	);
}

async function handleTranscriptSuccess(event: NotificationEvent) {
	await processNotification(
		event,
		(user) => user.transcriptSuccessNotifications,
		sendTranscriptSuccessEmail,
		sendTranscriptSuccessPushNotification
	);
}

async function handleTranscriptFailure(event: NotificationEvent) {
	await processNotification(
		event,
		(user) => user.transcriptFailureNotifications,
		sendTranscriptFailureEmail,
		sendTranscriptFailurePushNotification
	);
}

async function handleWorkspaceRemove(event: NotificationEvent) {
	await processNotification(
		event,
		(user) => user.removeFromWorkspaceNotification,
		sendWorkspaceRemoveEmail,
		sendWorkspaceRemovePushNotification
	);
}

async function handleWorkspaceDelete(event: NotificationEvent) {
	await processNotification(
		event,
		(user) => user.workspaceDeleteNotification,
		sendWorkspaceDeleteEmail,
		sendWorkspaceDeletePushNotification
	);
}

async function handleVideoShare(event: NotificationEvent) {
	await processNotification(
		event,
		(user) => user.shareNotifications,
		sendVideoShareEmail,
		sendVideoSharePushNotification
	);
}

async function handleWorkspaceInvitation(event: NotificationEvent) {
	const result = await processNotification(
		event,
		(user) => user.workspaceInvitationNotification,
		sendWorkspaceInvitationEmail,
		sendWorkspaceInvitationPushNotification
	);

	if (!result) {
		sendWorkspaceInvitationEmail(null, event);
	}
}

/**
 * Main event handler that delegates processing to the corresponding modular function.
 */
export const notificationEventHandler = async (event: NotificationEvent) => {
	logger.info("Received notification message", { event });

	try {
		switch (event.eventType) {
			case NOTIFICATION_EVENT_TYPE.FIRST_VIEW:
				await handleFirstView(event);
				break;

			case NOTIFICATION_EVENT_TYPE.COMMENT:
				await handleComment(event);
				break;

			case NOTIFICATION_EVENT_TYPE.TRANSCRIPT_SUCCESS:
				await handleTranscriptSuccess(event);
				break;

			case NOTIFICATION_EVENT_TYPE.TRANSCRIPT_FAILURE:
				await handleTranscriptFailure(event);
				break;

			case NOTIFICATION_EVENT_TYPE.WORKSPACE_REMOVE:
				await handleWorkspaceRemove(event);
				break;

			case NOTIFICATION_EVENT_TYPE.WORKSPACE_DELETE:
				await handleWorkspaceDelete(event);
				break;

			case NOTIFICATION_EVENT_TYPE.VIDEO_SHARE:
				await handleVideoShare(event);
				break;

			case NOTIFICATION_EVENT_TYPE.WORKSPACE_INVITATION:
				await handleWorkspaceInvitation(event);
				break;

			default:
				logger.warn(
					`Unhandled notification event type: ${(event as any).eventType}`
				);
		}
	} catch (error) {
		logger.error(`Error processing event type ${event.eventType}:`, error);
	}
};
