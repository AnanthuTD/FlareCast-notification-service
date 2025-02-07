import { Notification, User } from "@prisma/client";
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
import {
	NOTIFICATION_EVENT_TYPE,
	NotificationEvent,
	WorkspaceInvitationNotificationEvent,
} from "../../types/types";
import { getNotificationMessage } from "../../utils/getNotificationMessages.utils";

/**
 * Helper function to retrieve user and process notifications based on preferences.
 */
async function processNotification<T extends NotificationEvent>(
	event: T,
	getPreferences: (user: User) => { email?: boolean; push?: boolean } | null,
	sendEmail: (user: User, event: T) => void,
	sendPush: (user: User, event: T, data: Notification) => void,
	notificationType: Notification["type"]
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

	console.log("user: ", user);

	logger.debug("User details:", JSON.stringify(user, null, 2));

	try {
		const { title, content } = getNotificationMessage(event, user);

		const newNotification = await prisma.notification.create({
			data: {
				userId: user.id,
				title: title,
				content: content, // Customize this
				type: notificationType,
				status: "UNREAD",
				data: event?.data || {},
			},
		});

		const prefs = getPreferences(user);
		console.log(prefs);

		if (prefs?.email) {
			logger.debug(`🗽 sending email notification for ${user.email}`);
			sendEmail(user, event);
		}
		if (prefs?.push) {
			logger.debug(`🗽 sending push notification for ${user.fcmToken}`);
			sendPush(user, event, newNotification);
		}
	} catch (error) {
		logger.error("Error creating notification:", error);
		return false;
	}

	return true;
}

// Handlers for each event type
async function handleFirstView(event: NotificationEvent) {
	await processNotification(
		event,
		(user) => user.firstViewNotifications,
		sendFirstViewEmail,
		sendFirstViewPushNotification,
		"FIRST_VIEW"
	);
}

async function handleComment(event: NotificationEvent) {
	await processNotification(
		event,
		(user) => user.commentNotifications,
		sendCommentEmail,
		sendCommentPushNotification,
		"COMMENT"
	);
}

async function handleTranscriptSuccess(event: NotificationEvent) {
	await processNotification(
		event,
		(user) => user.transcriptSuccessNotifications,
		sendTranscriptSuccessEmail,
		sendTranscriptSuccessPushNotification,
		"TRANSCRIPT_SUCCESS"
	);
}

async function handleTranscriptFailure(event: NotificationEvent) {
	await processNotification(
		event,
		(user) => user.transcriptFailureNotifications,
		sendTranscriptFailureEmail,
		sendTranscriptFailurePushNotification,
		"TRANSCRIPT_FAILURE"
	);
}

async function handleWorkspaceRemove(event: NotificationEvent) {
	await processNotification(
		event,
		(user) => user.removeFromWorkspaceNotification,
		sendWorkspaceRemoveEmail,
		sendWorkspaceRemovePushNotification,
		"WORKSPACE_REMOVE"
	);
}

async function handleWorkspaceDelete(event: NotificationEvent) {
	await processNotification(
		event,
		(user) => user.workspaceDeleteNotification,
		sendWorkspaceDeleteEmail,
		sendWorkspaceDeletePushNotification,
		"WORKSPACE_DELETE"
	);
}

async function handleVideoShare(event: NotificationEvent) {
	await processNotification(
		event,
		(user) => user.shareNotifications,
		sendVideoShareEmail,
		sendVideoSharePushNotification,
		"VIDEO_SHARE"
	);
}

async function handleWorkspaceInvitation(
	event: WorkspaceInvitationNotificationEvent
) {
	event.invites.forEach(async (invitation) => {
		const eventData = {
			eventType: event.eventType,
			email: invitation.receiverEmail,
			url: invitation.url,
			senderId: event.senderId,
			workspaceId: event.workspaceId,
			workspaceName: event.workspaceName,
			timestamp: event.timestamp,
			userId: invitation.receiverId,
			data: {
				invitationId: invitation.invitationId,
				url: invitation.url,
				invitationStatus: "PENDING", 
			},
		};
		const result = await processNotification(
			eventData,
			(user) => user.workspaceInvitationNotification,
			sendWorkspaceInvitationEmail,
			sendWorkspaceInvitationPushNotification,
			"WORKSPACE_INVITATION"
		);

		if (!result) {
			sendWorkspaceInvitationEmail(null, eventData);
		}
	});
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
