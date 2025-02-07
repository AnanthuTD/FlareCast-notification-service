import { logger } from "../../logger/logger";
import prisma from "../../prismaClient";

export const invitationStatusUpdateHandler = async (value: {
	invitationId: string;
	invitationStatus: string;
}) => {
	try {
		logger.debug(
			"Invitation status update: " +
				value.invitationId +
				" " +
				value.invitationStatus
		);
		// First, find the notification
		const notification = await prisma.notification.findFirst({
			where: {
				type: "WORKSPACE_INVITATION",
				data: { is: { invitationId: value.invitationId } },
			},
		});

		if (!notification) {
			logger.error("🟡 Notification not found");
			return;
		}

		// Now update it
		await prisma.notification.update({
			where: {
				id: notification.id,
			},
			data: {
				data: {
					...notification.data,
					invitationStatus: value.invitationStatus,
				},
			},
		});
	} catch (error) {
		logger.error("🔴 Error updating invitation status:", error);
	}
};