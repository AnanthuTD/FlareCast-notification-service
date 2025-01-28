import { TOPICS } from "../config/topics";
import { sendFirstViewEmail } from "../infrastructure/emailNotifications";
import { sendFirstViewPushNotification } from "../infrastructure/pushNotifications";
import { logger } from "../logger/logger";
import prisma from "../prismaClient";
import { createTopic } from "./admin";
import { consumeMessages } from "./consumer";

enum NOTIFICATION_EVENT_TYPE {
	FIRST_VIEW = "firstView",
}

export interface NotificationEvent {
	eventType: NOTIFICATION_EVENT_TYPE;
	userId: string;
	videoName: string;
	videoId: string;
	viewerName: string;
}

interface UserVerifiedEvent {
	userId: string;
	email: string;
	firstName: string;
}

createTopic([TOPICS.EMAIL_NOTIFICATION, TOPICS.NOTIFICATION_EVENT]).then(() => {
	logger.info("✅ Topic created successfully");

	// Consume messages for NOTIFICATION_EVENT
	consumeMessages(
		[TOPICS.NOTIFICATION_EVENT],
		async (value: NotificationEvent) => {
			logger.info("Received notification message", value);

			if (value.eventType === NOTIFICATION_EVENT_TYPE.FIRST_VIEW) {
				try {
					const user = await prisma.user.findFirst({
						where: {
							userId: value.userId,
						},
					});

					if (!user) return;

					logger.debug(JSON.stringify(user, null, 2));

					if (user?.firstViewNotifications?.email) {
						sendFirstViewEmail(user, value);
					}

					if (user?.firstViewNotifications?.push) {
						sendFirstViewPushNotification(user, value);
					}
				} catch (error) {
					logger.error("Error processing firstView event:", error);
				}
			}
		}
	);

	// Consume messages for USER_VERIFIED_EVENT
	consumeMessages(
		[TOPICS.USER_VERIFIED_EVENT],
		async (value: UserVerifiedEvent) => {
			logger.info("New verified user data received", value);

			try {
				await prisma.user.create({
					data: {
						userId: value.userId,
						email: value.email,
						username: value.firstName,
					},
				});
			} catch (error) {
				logger.error("Error creating user:", error);
			}
		}
	);
});
