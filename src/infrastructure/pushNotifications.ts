import { User } from "@prisma/client";
import fcmService from "./fcmService";
import { Message } from "firebase-admin/messaging";
import { NotificationEvent } from "../kafka";

export function sendFirstViewPushNotification(
	user: User,
	value: NotificationEvent
) {
	if (!user.fcmToken) return;

	const message: Message = {
		token: user.fcmToken,
		notification: {
			title: "🎉 Your First Viewer Has Arrived!",
			body: "Exciting news! Someone just viewed your video. Keep creating amazing content on Flarecast!",
			// imageUrl: "",
		},
		data: value,
	};

	fcmService.sendMessageToUser(message);
}
