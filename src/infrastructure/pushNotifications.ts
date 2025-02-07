import { Notification, User } from "@prisma/client";
import fcmService from "./fcmService";
import { Message } from "firebase-admin/messaging";
import { NotificationEvent } from "../types/types";
import { getNotificationMessage } from "../utils/getNotificationMessages.utils";

/**
 * Generic function to send push notifications.
 */
function sendPushNotification(
	user: User,
	value: NotificationEvent,
	data: Notification,
	title: string,
	body: string
) {
	if (!user.fcmToken) {
		console.warn(
			`Skipping push notification: No FCM token for user ${user.id}`
		);
		return;
	}

	const message: Message = {
		token: user.fcmToken,
		notification: {
			title,
			body,
		},
		// data: value as any, // Ensure data is properly formatted
		data: {
			notification: JSON.stringify({
				...getNotificationMessage(value, user),
				...data,
			}),
		},
	};

	fcmService.sendMessageToUser(message);
}

// Specific push notification functions using the generic function
export const sendFirstViewPushNotification = (
	user: User,
	value: NotificationEvent,
	data: Notification
) =>
	sendPushNotification(
		user,
		value,
		data,
		"🎉 Your First Viewer Has Arrived!",
		"Exciting news! Someone just viewed your video. Keep creating amazing content on Flarecast!"
	);

export const sendCommentPushNotification = (
	user: User,
	value: NotificationEvent,
	data: Notification
) =>
	sendPushNotification(
		user,
		value,
		data,
		"💬 New Comment on Your Video!",
		"Someone just commented on your video. Check it out now!"
	);

export const sendTranscriptSuccessPushNotification = (
	user: User,
	value: NotificationEvent,
	data: Notification
) =>
	sendPushNotification(
		user,
		value,
		data,
		"✅ Transcript Ready!",
		"Your video's transcript has been successfully generated."
	);

export const sendTranscriptFailurePushNotification = (
	user: User,
	value: NotificationEvent,
	data: Notification
) =>
	sendPushNotification(
		user,
		value,
		data,
		"⚠️ Transcript Generation Failed",
		"Oops! Something went wrong while generating your transcript. Please try again."
	);

export const sendWorkspaceRemovePushNotification = (
	user: User,
	value: NotificationEvent,
	data: Notification
) =>
	sendPushNotification(
		user,
		value,
		data,
		"🚪 Removed from Workspace",
		"You have been removed from a workspace."
	);

export const sendWorkspaceDeletePushNotification = (
	user: User,
	value: NotificationEvent,
	data: Notification
) =>
	sendPushNotification(
		user,
		value,
		data,
		"❌ Workspace Deleted",
		"A workspace you were a part of has been deleted."
	);

export const sendVideoSharePushNotification = (
	user: User,
	value: NotificationEvent,
	data: Notification
) =>
	sendPushNotification(
		user,
		value,
		data,
		"📤 Your Video Was Shared!",
		"Your video has been shared! See who’s watching."
	);

export const sendWorkspaceInvitationPushNotification = (
	user: User,
	value: NotificationEvent,
	data: Notification
) => {
	sendPushNotification(
		user,
		value,
		data,
		"📩 New Workspace Invitation!",
		"✨ You have been invited to join a new workspace. 🚀 Tap to check it out!"
	);
};
