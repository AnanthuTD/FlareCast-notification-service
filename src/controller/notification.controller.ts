import { Request, Response } from "express";
import prisma from "../prismaClient";
import { logger } from "../logger/logger";
import { Notification, Prisma } from "@prisma/client";

/**
 * Controller for handling notification-related requests.
 */
export class NotificationController {
	/**
	 * Get all notifications for a user.
	 */
	async getUserNotifications(req: Request, res: Response) {
		try {
			const userId = req.user.id;
			const { type, page, limit } = req.query;
			const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

			const query: Prisma.NotificationWhereInput = {
				userId,
			};

			if (type !== "all") {
				const types = (type as string).split(",");
				if (types.length)
					query["type"] = { in: types as Notification["type"][] };
			}

			logger.debug("query: " + JSON.stringify(query));

			const notifications = await prisma.notification.findMany({
				where: query,
				orderBy: { createdAt: "desc" },
				skip: offset,
				take: parseInt(limit as string),
			});

			const count = await prisma.notification.count({ where: query });

			res.status(200).json({
				notifications,
				count,
				message: "Notification fetched successfully",
			});
		} catch (error) {
			logger.error("Error fetching notifications:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	/**
	 * Mark a notification as read.
	 */
	async markAsRead(req: Request, res: Response) {
		try {
			const { notificationId } = req.body;

			await prisma.notification.update({
				where: { id: notificationId },
				data: { status: "READ" },
			});

			res.status(200).json({ message: "Notification marked as read" });
		} catch (error) {
			logger.error("Error updating notification:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	/**
	 * Mark all notification as read.
	 */
	async markAllAsRead(req: Request, res: Response) {
		try {
			const userId = req.user.id;

			await prisma.notification.updateMany({
				where: { userId },
				data: { status: "READ" },
			});

			res
				.status(200)
				.json({ message: "All notifications of user marked as read" });
		} catch (error) {
			logger.error("Error updating notification:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	/**
	 * Delete a notification.
	 */
	async deleteNotification(req: Request, res: Response) {
		try {
			const { notificationId } = req.body;

			await prisma.notification.deleteMany({
				where: { id: { in: notificationId } },
			});

			res.status(200).json({ message: "Notification deleted successfully" });
		} catch (error) {
			logger.error("Error deleting notification:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	/**
	 * Get notification count for a user.
	 */
	async getUnreadNotificationCount(req: Request, res: Response) {
		try {
			const userId = req.user.id;

			const count = await prisma.notification.count({
				where: { userId, status: "UNREAD" },
			});

			res
				.status(200)
				.json({ count, message: "Notification count fetched successfully" });
		} catch (error) {
			logger.error("Error fetching notification count:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	}
}

export default NotificationController;
