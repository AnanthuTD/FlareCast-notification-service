import { User } from "@prisma/client";
import fcmService from "./fcmService";
import { Message } from "firebase-admin/messaging";

export function sendFirstViewPushNotification(user: User) {
	if (!user.fcmToken) return;

	const message: Message = {
		token: user.fcmToken,
		notification: {
			title: "🎉 Your First Viewer Has Arrived!",
			body: "Exciting news! Someone just viewed your video. Keep creating amazing content on Flarecast!",
			// imageUrl: "",
		},
	};

	fcmService.sendMessageToUser(message);
}
