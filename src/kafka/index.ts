import { TOPICS } from "../config/topics";
import { sendFirstViewEmail } from "../infrastructure/emailNotifications";
import { sendFirstViewPushNotification } from "../infrastructure/pushNotifications";
import { logger } from "../logger/logger";
import prisma from "../prismaClient";
import { createTopic } from "./admin";
import { consumeMessages } from "./consumer";

createTopic().then(() => {
	logger.info("✅ Topic created successfully");
	consumeMessages([TOPICS.NOTIFICATION_EVENT], async (value) => {
		logger.info("Received notification message", value);

		if (value["eventType"] === "firstView") {
			const user = await prisma.user.findFirst({
				where: {
					userId: value.userId,
				},
			});

			if (user?.firstViewEmail) {
				sendFirstViewEmail(user);
			}

			if (user?.firstViewPushNotifications) {
				sendFirstViewPushNotification(user);
			}
		}
	});
});
