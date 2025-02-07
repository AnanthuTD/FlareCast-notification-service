import { RequestHandler } from "express";
import prisma from "../prismaClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class PreferenceController {
	getPreference = <RequestHandler>(async (req, res) => {
		const userId = req.user.id;

		try {
			const preferences = await prisma.user.findFirst({
				where: {
					id: userId,
				},
				select: {
					removeFromWorkspaceNotification: true,
					transcriptFailureNotifications: true,
					transcriptSuccessNotifications: true,
					commentNotifications: true,
					shareNotifications: true,
					firstViewNotifications: true,
				},
			});

			if (!preferences) {
				return res.status(404).json({ message: "User preferences not found." });
			}

			res.json(preferences);
		} catch (error) {
			console.error("Error fetching preferences:", error);
			res
				.status(500)
				.json({ message: "An error occurred while fetching preferences." });
		}
	});

	updatePreference = <RequestHandler>(async (req, res) => {
		const userId = req.user.id;
		const data = req.body;

    console.log('UserId: ' + userId);

		if (!data) {
			return res.status(400).json({ message: "No data provided for update." });
		}

		try {
			const updatedUser = await prisma.user.updateMany({
				where: { id: userId },
				data: {
					[data.preferenceId]: {
						[data.type]: data.checked,
					},
				},
			});

			res.status(200).json({
				message: "Preference updated successfully.",
				user: updatedUser,
			});
		} catch (error) {
			console.error("Error updating preference:", error);

			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === "P2025") {
					return res.status(404).json({ message: "User not found." });
				}
			}

			res
				.status(500)
				.json({ message: "An error occurred while updating the preference." });
		}
	});
}
