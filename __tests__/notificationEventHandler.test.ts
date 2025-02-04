import prisma from "../src/prismaClient";
import {
	NOTIFICATION_EVENT_TYPE,
	notificationEventHandler,
} from "../src/kafka/handlers/notificationEvent.handler";
import { logger } from "../src/logger/logger";
import { sendFirstViewEmail } from "../src/infrastructure/emailNotifications";
import { sendFirstViewPushNotification } from "../src/infrastructure/pushNotifications";
import { NotificationEvent } from "../src/types/types";

jest.mock("../src/logger/logger", () => ({
	logger: {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		debug: jest.fn(),
	},
}));

jest.mock("../src/prismaClient", () => {
	return {
		__esModule: true, // Ensure it treats it as a module
		default: {
			user: {
				findUnique: jest.fn(),
			},
		},
	};
});

jest.mock("../src/infrastructure/emailNotifications", () => ({
	sendFirstViewEmail: jest.fn(),
}));

jest.mock("../src/infrastructure/pushNotifications", () => ({
	sendFirstViewPushNotification: jest.fn(),
}));

describe("notificationHandler", () => {
	const mockUser = {
		id: "test-user-id",
		email: "test-user@example.com",
		fcmToken: "test-fcm-token",
		firstViewNotifications: { email: true, push: true },
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("should handle firstView and send email and push notifications", async () => {
		(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

		const event: NotificationEvent = {
			eventType: NOTIFICATION_EVENT_TYPE.FIRST_VIEW,
			userId: "user123",
			videoName: "Test Video",
			videoId: "video123",
			viewerName: "John Doe",
			timestamp: new Date().getTime(),
		};

		await notificationEventHandler(event);

		expect(logger.error).not.toHaveBeenCalledWith(
			"Error processing event type firstView:",
			expect.any(Error)
		);

		expect(sendFirstViewEmail).toHaveBeenCalled();
		expect(sendFirstViewPushNotification).toHaveBeenCalled();
	});
});
